// Response Object
/* 
{
    success = 1 or 0 
    data : { 
        object 
    } or null,
    issue: {
        object 
    } or null
}
*/
const file = require('fs');
const path = require('path');
require('dotenv').config({path: path.resolve(__dirname, "../../../.env")});


const jwt = require('jsonwebtoken');
const devJWT = process.env.JWT_SECRET;
console.log("JWT Secret",devJWT);

const nodemailer = require('nodemailer');


common_issues = {
    0: "fallthrough error (nothing happened)",
    1: "Bad Body (No body or required keys)",
    2: "Invalid JWT (Didnt verify or jwt had a bad time)",
    3: "Wrong User Permission (vendor/user)",
    4: "Bcrypt Hash Error",
    5: "Bad password",
    6:  "Bad Email (signup:already in db, login:not in db)",
    7: "SQL Query Problem"
}

class res_obj {
    // defualt constructor
    // all fields set to uninitilized

    constructor(){
        this.success = 0;
        this.logger = getLogFile();
    }


    // only call one of these

    // on success 
    // set the returned data 
    setData(data){
        this.success = 1;
        this.data = data;
        this.issues = null;
    }

    // on failure of operation
    // set the returned issue
    setIssues(issues){
        this.success = 0;
        this.issues = issues;
        this.data = null;
    }

    setIssue(code, msg=''){
        this.success = 0;
        this.issues = {
            error: code,
            message: ''
        }
        this.data = null;

        if(code in Object.keys(common_issues)){
            this.issues.message = common_issues[code];
        }
        else{
            this.issues.message = msg;
        }

    }

    // just return the string version of this object
    package(){
        let js = JSON.stringify(this);
        Log.writeToLog(js);
        console.log(`Packaging response as : ${js}`);
        return js;
    }
    
}

class food_card{
    constructor(foodData){
        this.id = foodData.id; // probably will change to be generated as a rand key or that rand key is set here
        this.vendor = foodData.vendor;
        this.cuisine = foodData.cuisine;
        this.item = foodData.item;
        this.pos = foodData.pos;  
        this.reserved = "";
        this.image = "";
        this.favorite = "";
    }
}

/*  Validate the incoming request for fields and now also for the body
    using this to cut down on the logic in all the requests and still have a way to check for what we need

    checks to make sure the object exists
    then check to make sure all keys in the fields array are present in the object

    returns false if either the object is null, or fields are not present
    returns true if all fields are present in a non-null object
*/

function validate(fields, object){
    if(!object){ 
        return false;
    }

    for(x in fields){
        if(fields[x] in object){
            continue
        }else{
            return false;
        }
    }
    return true;
}

class UserStore 
{
    // initialize empty data table
    constructor(){
        this.user_data = {};
    }

    // attemp to add a user based on credentials
    // callback(null) on successful add
    // callback(err) on error
    insertUser(credentials, callback){
        if(validate(['email','pass'],credentials)){

            if(credentials.email in this.user_data){
                return callback({error: 3, message:`user ${credentials.email} already exists`});
            }

            let vend = ("vendor" in credentials) ? credentials.vendor : 0;

            this.user_data[credentials.email] = {
                pass: credentials.pass,
                vendor: vend
            };

            return callback(null);
        }

        return callback({error: 2, message: `Passed : ${Object.keys(credentials)}, expected .email, .pass, .vendor`});
    }

    // return callback(null, user_data) on success
    // return callback(err, null) on error or failure to find
    getUser(email, callback){
        if(email in this.user_data){
            return callback(null,this.user_data[email]);
        }
        
        let err = {
            error: "failed to find user",
            message: `${email} not found in user data`
        }
        return callback(err, null);
    }

    deleteAll(){
        this.user_data = [];
    }

}

// implemented callbackss bc that is what we will most likely be using for the SQL stuff
class FoodStore {
    constructor() {
        this.ids = 0;
        this.foodlist = [];
        
    }
    
    getId = () => {
        let id = this.ids;
        this.ids +=1;
        return id;
    }

    // upload just with item name
    uploadItem(item, cb){

        const upload = new food_card({
            id: this.getId(),
            item: item,
            vendor: "cal",
            cuisine: "Tex Mex",
            pos: [0.0,0.0]
        });

        this.foodlist.push(upload);
        return cb(null);

    }

    uploadCard(fooddata, cb){

        const upload = new food_card(fooddata);
        //check database for dup entry
        //const found = this.foodlist.find(FoodCard.id => FoodCard.id = )
        for(x in this.foodlist){
            console.log(x);
            if(upload.id === this.foodlist[x].id){
                console.log("FoodCard alread in LIST");
                return cb("Card in List");
            }
        }
        
        this.foodlist.push(upload);
        console.log("FoodCard added to list");
        return cb(null);
    }

    getCard(id, cb){
        for(x in this.foodlist){
            if(id === this.foodlist[x].id){
                return cb(null, this.foodlist[x]);
            }
        }

        return cb({code:1, msg: "no card with that id"}, null);
    }

    getCardsAll(cb){
        return cb(this.foodlist);
    }

    getCards(pos , [filters]){
        //for(i = 0; i < this.foodlist.length(); i++){
            //if(foodlist item in range)
            //return list of all items in range       
        //}
    }

    deleteCard(id, cb){
        for(x in this.foodlist){
            if(id === this.foodlist[x].id){
                this.foodlist[x] = null;
                return cb(null);
            }
        }

        return cb({code: 1, msg: "couldnt delete"});
    }

    markCardReserved(id, user, cb){
        for(x in this.foodlist ){
            if(id === this.foodlist[x].id){
                this.foodlist[x].reserved = user;
                return cb(null);
            }
        }

        return cb({code: 1, msg:"Cant reserve / cant find card"});
    }


}

// JWT sign and verifcation
function signtoken(data){
    // create the token 
    const token = jwt.sign({ user: data.user, vendor: data.vendor},devJWT, {expiresIn: "10d"});

    return token;
}

// Asynchronously verify a token
// err    : return callback(err,null) bad jwt
// user   : return callback(null,0)
// vendor : return callback(null,1)
// example: sutil.verify(in_token, (err, vendor) => { if err throw err; if vendor do vendor stuff, else is a user}
function verifytoken(token, callback){
    jwt.verify(token, devJWT, (err, result) => {
        if(err){
            return callback(err, null);
        }

        //vendor
        if(result.vendor == "1"){
            return callback(null,1);
        }
        //not vendor
        return callback(null,0); 
    });
}

class Logger {
    constructor(file){
        //folder to place log file
        this.fpath = path.resolve(__dirname, file);
    }

    writeToLog(string){
        string = string+ "\n";
        file.appendFile(this.fpath, string, (err) => {
            if(err) throw err;
            //console.log(`Logged ${string}`);
        })
    }

    readLogs(callback){
        file.readFile(this.fpath, 'utf8', (err,data) => {
            if(err) return callback(err,null);

            data = data.split("\n");
            let obj = {};
            for(let x in data){
                obj[x] = data[x];
            }
            return callback(null,obj);
        });
    }

    getPath(){
        return this.fpath;
    }

}

function getKM(miles){
    return miles * 1.609344;
}

function getM(Km){
    return Km * 0.62137119;
}

function getDistance(lat1, lon1, lat2, lon2){
    let dLat = (lat2 - lat1) * Math.PI / 180.0;
    let dLon = (lon2 - lon1) * Math.PI / 180.0;
    // convert to radians
    lat1 = (lat1) * Math.PI / 180.0;
    lat2 = (lat2) * Math.PI / 180.0;
    // apply formula
    let a = Math.pow(Math.sin(dLat / 2), 2) + Math.pow(Math.sin(dLon / 2), 2) * Math.cos(lat1) * Math.cos(lat2);
    let rad = 6371;
    let dist_km = 2 * Math.asin(Math.sqrt(a));
    // conversion factor
    const factor = 0.621371
    const miles = dist_km * factor;
    return miles;
}

//send email
function sendEmail(email, token) {
    console.log(token)
    var email = email;
    var token = token;
 
    var transport = nodemailer.createTransport({
        service: "gmail",    
        auth: {
            user: 'foodseek2022.ucsc@gmail.com', // Your email id
            pass: 'qtazkxgenmugphsh' // Your password
        }
    });
 
    var mailOptions = {
        from: 'FoodSeek',
        to: email,
        subject: 'New password token',
        html: '<p>You requested for reset password, kindly use this <a href="http://localhost:3000/updatepass%3Ftoken=' + token + '">link</a> to reset your password</p>'
 
    };
 
    transport.sendMail(mailOptions, function(error, info) {
        if (error) {
            //console.log(1)
            return 1;
            
        } else {
            //console.log(0)
            return 0;
        }
    });
}


const FS = new FoodStore();
const US = new UserStore(); // instantiate these 1 time 

const startTime = new Date();
const getLogFile = () => {`../logs/log_${startTime.getHours()}_${startTime.getMinutes()}.txt`}
const Log = new Logger(`../logs/log_${startTime.getHours()}_${startTime.getMinutes()}.txt`);

module.exports = {
    res_obj: res_obj,
    food_card: food_card,
    validate: validate,
    UserStore: US,
    FoodStore: FS,
    sign: signtoken,
    verify: verifytoken,
    getKm: getKM,
    getM: getM,
    getDistance: getDistance,
    Logger: Log,
    logFile: getLogFile,
    sendEmail: sendEmail,

}

const L = new Logger('../logs/log_21_56.txt');
