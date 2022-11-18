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
var randtoken = require('rand-token');
const bcrypt = require('bcrypt');

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
        //Log.writeToLog(js);
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

        if(result){
            return callback(null,result);
        }

        return callback(null,null);
    });
}

class Logger {
    constructor(file){
        //folder to place log file
        this.fpath = path.resolve(__dirname, file);
    }

    writeToLog(string){
        let date = new Date(); // get the time'
        let extra_space = (date.getSeconds() < 9) ? " " : "";
        string = `(${date.getMonth()+1}/${date.getDate()}):${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}s  ${extra_space}|  ${string}\n`;
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
function createOptions(email, subject , html_str){
    
    var mailOptions = {
        from: 'FoodSeek',
        to: email,
        subject: subject,
        html: html_str
    };
    return mailOptions;
}

function signUpEmail(email, callback){
    const token = jwt.sign({ user: email},devJWT, {expiresIn: "10d"});
    let html_str = '<p>Use this link to confirm email, kindly use this <a href="http://localhost:3000/confirmEmail?token=' + token + '">link</a> </p>';
    let subject = 'Confirmation email';
    let mailOptions = createOptions(email, subject, html_str);
    sendEmail(mailOptions, (error,sent) =>{
        if(error){
            return callback(error,null);
        }
        else {
            return callback(null,sent);
        }
    });
}

function fgpssEmail(email, code, callback){
    let html_str = '<p>Use this code: ' + code + ' to proceed with updating your password</p>';
    let subject = 'Confirmation code, forgot password';
    let mailOptions = createOptions(email, subject, html_str);
    sendEmail(mailOptions, (error,sent) =>{
        if(error){
            return callback(error,null);
        }
        else {
            return callback(null,sent);
        }
    });
}

//send email
function sendEmail(mailOptions, callback) {
    
 
    var transport = nodemailer.createTransport({
        service: "gmail",    
        auth: {
            user: 'foodseek2022.ucsc@gmail.com', // Your email id
            pass: 'qtazkxgenmugphsh' // Your password
        }
    });
 
    transport.sendMail(mailOptions, function(error, info) {
        if (error) {
            //console.log(1)
            return callback(error,0);
            
        } else {
            //console.log(0)
            return callback(null, 1);
        }
    });
}



function genToken(size){
    let token = randtoken.generate(size);
    return token;
}

// hash an input with bcrypt and return callback(null, hashed)
// on error callback(err,null)
function bHash(input, callback){
    bcrypt.hash(input, 10, (err, hash) => {
        if(err){
            return callback(err, null); // error in hashing password
        }

        return callback(null,hash);
    });
}

//compare an input to something else (comparison) using bcrypt
// failure : callback(err,null)
// success : callback(null,true)
function bCompare(input, comparison, callback){
    bcrypt.compare(input,comparison, (err, result) => {
        if(err){
            return callback(err,null);
        }
        
        return (result) ? callback(null,true) : callback(null,false); // return true
    });
}




const startTime = new Date();
const getLogFile = () => {`../logs/log_${startTime.getMonth()+1}_${startTime.getDate()}_${startTime.getHours()}_${startTime.getMinutes()}.txt`}
const Log = new Logger(`../logs/log_${startTime.getMonth()+1}_${startTime.getDate()}_${startTime.getHours()}_${startTime.getMinutes()}.txt`);

module.exports = {
    res_obj: res_obj,
    food_card: food_card,
    validate: validate,
    sign: signtoken,
    verify: verifytoken,
    getKm: getKM,
    getM: getM,
    getDistance: getDistance,
    Logger: Log,
    logFile: getLogFile,
    createOptions: createOptions,
    genToken: genToken,
    bHash: bHash,
    bCompare: bCompare,
    signUpEmail: signUpEmail,
    fgpssEmail: fgpssEmail


}

