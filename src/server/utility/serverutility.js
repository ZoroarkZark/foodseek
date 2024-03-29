const file       = require('fs');
const path       = require('path');
require('dotenv').config({path: path.resolve(__dirname, "../../../.env")});

var randtoken    = require('rand-token');
const bcrypt     = require('bcrypt');
const jwt        = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const https       = require('https');
const s3 = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');


// use s3.S3Client to get the S3Client class
const bucketName = process.env.BUCKET_NAME;
const bucketReg = process.env.BUCKET_REGION;
const bucketKey = process.env.BUCKET_KEY;
const bucketSecret= process.env.BUCKET_SECRET;

const S3 = new s3.S3Client({
    credentials: {
        accessKeyId: bucketKey,
        secretAccessKey: bucketSecret
    },
    region: bucketReg
})





const devJWT = process.env.JWT_SECRET;
console.log("JWT Secret",devJWT);
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

/* 
██████╗ ███████╗███████╗
██╔══██╗██╔════╝██╔════╝
██████╔╝█████╗  ███████╗
██╔══██╗██╔══╝  ╚════██║
██║  ██║███████╗███████║
╚═╝  ╚═╝╚══════╝╚══════╝
*/

class res_obj {
    // defualt constructor
    // all fields set to uninitilized
    constructor(){
        this.success = 0;
        this.logger = getLogFile();
    }


    // only call one of these

    /**
     * sets the returned data on succcess and sets issues to null
     * @param {object} data : takes any obect to be returned to front end
     */ 
    setData(data){
        this.success = 1;
        this.data = data;
        this.issues = null;
    }

    addData(key, value){
        this.data[key] = value;
    }

    /**
     * sets the issue based on the corresponding number on opperation failuer
     * @param {int} issues : the issue number
     */
    setIssues(issues){
        this.success = 0;
        this.issues = issues;
        this.data = null;
    }
    /**
     * sets the issue object on opperation failure
     * @param {int} code : the error 
     * @param {string} msg : the message 
     */
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

    
    /**
     * 
     * @returns the string version of this object
     */
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


/* 
██╗   ██╗████████╗██╗██╗     
██║   ██║╚══██╔══╝██║██║     
██║   ██║   ██║   ██║██║     
██║   ██║   ██║   ██║██║     
╚██████╔╝   ██║   ██║███████╗
 ╚═════╝    ╚═╝   ╚═╝╚══════╝                             
*/
/*  Validate the incoming request for fields and now also for the body
    using this to cut down on the logic in all the requests and still have a way to check for what we need

    checks to make sure the object exists
    then check to make sure all keys in the fields array are present in the object

    returns false if either the object is null, or fields are not present
    returns true if all fields are present in a non-null object
*/
/**
 * searches the object for the fields 
 * @param {string} fields : the fields to search for in the object
 * @param {*} object : the object to be searched
 * @returns True if all feilds present in object, false otherwise
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

/**
 * generates a random token based on size
 * @param {int} size : the length of the token
 * @returns the token generated
 */
 function genToken(size){
    let token = randtoken.generate(size);
    return token;
}

/**
 * Convert Miles To KM
 * @param {number} miles : miles to convert to km 
 * @returns {number} milesInKM
 */
function getKM(miles){
    return miles * 1.609344;
}

/**
 * Convert KM to Miles
 * @param {number} Km 
 * @returns {number} kmToMiles
 */
function getM(Km){
    return Km * 0.62137119;
}


/* 
██████╗ ██╗   ██╗███████╗██╗  ██╗
██╔══██╗██║   ██║██╔════╝██║  ██║
██████╔╝██║   ██║███████╗███████║
██╔═══╝ ██║   ██║╚════██║██╔══██║
██║     ╚██████╔╝███████║██║  ██║
╚═╝      ╚═════╝ ╚══════╝╚═╝  ╚═╝
*/
/**
 * Make a push request for the target using expos API
 * @param {string} target : target push notification
 * @param {function} callback : callback function to handle the response of the request 
 */
function pushRequest(target, msg, callback){
    // the actual push notification we will be sending 
    const push = {
        to: target,
        title: msg.title,
        body: msg.body,
    };

    // request options required by Expo
    const outOptions = {
        method: "POST",
        headers: {
            'host': 'exp.host',
            'accept': 'application/json',
            'accept-encoding': 'gzip, deflate',
            'content-type': 'application/json' 
        }
    }
    // initiate request
    const outgoing = https.request('https://exp.host/--/api/v2/push/send', outOptions, (response) => {
        var str = '';
        response.on('data', (chunk) => {
            str+=chunk;
        })

        response.on('end', () => {
            let response = JSON.parse(str);
            if(!response || !response.data){
                return callback({msg: "Expo push notification request not able to be sent"}, null);
            }

            if(response.data.status === "error"){
                console.log('Could not send push notification');
                console.log(response.data.message);
                return callback(response.data, null);
            }
            else{
                console.log('Sent notification');
                return callback(null, true);
            }
        })

        response.on('error', (err) => {
            return(err,null);
        })
    });
    outgoing.write(JSON.stringify(push));
    outgoing.end();
}

/*
     ██╗██╗    ██╗████████╗
     ██║██║    ██║╚══██╔══╝
     ██║██║ █╗ ██║   ██║   
██   ██║██║███╗██║   ██║   
╚█████╔╝╚███╔███╔╝   ██║   
*/
// JWT sign and verifcation
/**
 * creates and signs the jason web token
 * @param {object} data : holds the user and vendor data 
 * @returns the signed jason web token 
 */
function signtoken(data){
    // create the token 
    const token = jwt.sign({ user: data.user, vendor: data.vendor},devJWT, {expiresIn: "10d"});

    return token;
}
/**
 * Verifies the jwt is valid
 * @param {object} token : the token to be verified 
 * @param {*} callback : err : return callback(err,null) bad jwt , user : return callback(null,0),  vendor : return callback(null,1)
 * @example : sutil.verify(in_token, (err, vendor) => { if err throw err; if vendor do vendor stuff, else is a user}
 */
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

/* 
██╗      ██████╗  ██████╗ 
██║     ██╔═══██╗██╔════╝ 
██║     ██║   ██║██║  ███╗
██║     ██║   ██║██║   ██║
███████╗╚██████╔╝╚██████╔╝
╚══════╝ ╚═════╝  ╚═════╝
*/
class Logger {
    constructor(file){
        //folder to place log file
        this.fpath = path.resolve(__dirname, file);
    }
    /**
     * adds string to another string with date and time and adds to file
     * @param {string} string : any
     */
    writeToLog(string){
        let date = new Date(); // get the time'
        let dateStr = `(${date.getMonth()+1}/${date.getDate()}):${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
        dateStr = dateStr.trimEnd();
        dateStr = dateStr.padEnd(20," ");
        string = `${dateStr}-   ${string}\n`;
        file.appendFile(this.fpath, string, (err) => {
            if(err) throw err;
            //console.log(`Logged ${string}`);
        })
    }
    /**
     *  reads the logs and returns the read data
     * @param {*} callback : err , data => returns error on issue, returns read data 
     */
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

/* 
███████╗███╗   ███╗ █████╗ ██╗██╗     
██╔════╝████╗ ████║██╔══██╗██║██║     
█████╗  ██╔████╔██║███████║██║██║     
██╔══╝  ██║╚██╔╝██║██╔══██║██║██║     
███████╗██║ ╚═╝ ██║██║  ██║██║███████╗
╚══════╝╚═╝     ╚═╝╚═╝  ╚═╝╚═╝╚══════╝                                    
*/
/**
 * creates the options for the sendEmail function 
 * @param {string} email : The email of the user we are emailing
 * @param {string} subject : The subject of the email
 * @param {string} html_str : The body of the email as an HTML string
 * @returns 
 */
function createOptions(email, subject , html_str){
    
    var mailOptions = {
        from: 'FoodSeek',
        to: email,
        subject: subject,
        html: html_str
    };
    return mailOptions;
}
/**
 * sends the sign up email to email
 * @param {string} email : the recipient of the email
 * @param {*} callback   : returns (null, sent), on error returns (error,null)
 */
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
/**
 * sends the forgot password email 
 * @param {string} email : the recipient of the email
 * @param {string} code  : the code to confirm the forgot password claim
 * @param {*} callback   : returns (null, sent), on error returns (error,null)
 */
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

/**
 * sends the email based on the mailoptions
 * @param {object} mailOptions : holds the data for the email process => from, to, subject, and body as html string
 * @param {*} callback         : returns (null, 1), on error returns (error,0)
 */
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

/* 
██████╗  ██████╗██████╗ ██╗   ██╗██████╗ ████████╗
██╔══██╗██╔════╝██╔══██╗╚██╗ ██╔╝██╔══██╗╚══██╔══╝
██████╔╝██║     ██████╔╝ ╚████╔╝ ██████╔╝   ██║   
██╔══██╗██║     ██╔══██╗  ╚██╔╝  ██╔═══╝    ██║   
██████╔╝╚██████╗██║  ██║   ██║   ██║        ██║   
╚═════╝  ╚═════╝╚═╝  ╚═╝   ╚═╝   ╚═╝        ╚═╝   
*/
// hash an input with bcrypt and return callback(null, hashed)
// on error callback(err,null)
/**
 * hash an input with bcrypt 
 * @param {string} input : the strign to be encryped 
 * @param {*} callback   : return callback(null, hashed) on error callback(err,null)
 * 
 */
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
/**
 * compare an input to something else (comparison) using bcrypt
 * @param {string} input        : string to be compared
 * @param {string} comparison   : string to be compared
 * @param {*} callback          : failure : callback(err,null), success : callback(null,true)
 */
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
    Logger: Log,
    logFile: getLogFile,
    createOptions: createOptions,
    genToken: genToken,
    bHash: bHash,
    bCompare: bCompare,
    signUpEmail: signUpEmail,
    fgpssEmail: fgpssEmail,
    pushNotify: pushRequest,
    imgUpload: B64ImageUpload,
    getImgUrl: getLiveURL


}

/*
██╗███╗   ███╗ ██████╗ 
██║████╗ ████║██╔════╝ 
██║██╔████╔██║██║  ███╗
██║██║╚██╔╝██║██║   ██║
██║██║ ╚═╝ ██║╚██████╔╝
╚═╝╚═╝     ╚═╝ ╚═════╝                
*/
/**
 * Upload an image to the S3 Bucket (Converts from Base64 to a JPEG)
 * @param {string} filename : name for the file
 * @param {buffer} data : Array of chunks of data
 * @param {function} callback : callback(err,link) to handle either the error or the image link
 */
function B64ImageUpload(filename, data, callback){

    let mime = 'image/jpeg'; // mime type supported
    
    data_str = ''+data; // data in string to get data portion
    data_str = data_str.split(',')[1];

    let dest = path.resolve(__dirname, filename)

    file.writeFile(dest, data_str, {encoding:'base64'},(err) => { // write to decode 
        if(err){
            return callback(err, null);
        }

        file.readFile(dest, async (err, data) => { // read back to get raw image
            if(err){
                removeFile(dest);
                return callback(err, null);
            }

            let com = new s3.PutObjectCommand({ // how to send image to amazon
                Bucket: bucketName,
                Key: filename,
                Body: data,
                ContentType: mime,
            })
    
            // send the command
            await S3.send(com) // send it 
            .then( (data) => {console.log("Uploaded to amazon successfully");})
            .catch( (err) => {
                removeFile(dest);
                return callback(err, null); 
            }) 

            
            // get a link 
            let link = await getLiveURL(filename); // get the url for the image for ui to use
            removeFile(dest); // get rid of it
            return callback(null, link);
            
        })

    }  )
}

function removeFile(fpath){
    file.unlink(fpath, (err) => {
        if(err) throw err;
    });
}


async function getLiveURL(fileName){
    let options = {
        Bucket: bucketName,
        Key: fileName,
    }
    let exp_time = 603936;
    let com = new s3.GetObjectCommand(options);
    let url = await getSignedUrl(S3, com, {expiresIn: exp_time})
    return url;
}