// Core Modules 
const express = require('express');
const path    = require('path');

// http helpers
const bodyParser   = require('body-parser');
const cors         = require('cors');

//dot.env
require('dotenv').config({path: path.resolve(__dirname, "../../.env")}); // fix .env path 

//our database talker (gonna honestly remove all db calls from here in a second)
// routers
const coreRouter = require('./routes/core.js').CoreRouter;
const userRouter = require('./routes/user.js').UserRouter;
const vendorRouter = require('./routes/vendor.js').VendorRouter;
const ImageRouter = require('./routes/images.js').ImageRouter;

const sutil = require('./utility/serverutility.js');
const { res_obj } = require('./utility/serverutility.js');

// Server Constants
const port = process.env.PORT || 3000;
const hostname = "0.0.0.0";

// Express app 
const app = express();
const startTime = new Date();
const Log = sutil.Logger;


const VALID_KEYS = {
    "/signup"       	: ["email","pass","vendor"],
    "/login"        	: ["email","pass"],
    "/fgpass"       	: ["email"],
    "/validatecode" 	: ["email","code"],
    "/updatepass"   	: ["email","old_pass","new_pass"],
    "/confirmEmail" 	: true,
    "/rem"          	: true,
    "/ru"           	: ["email"],
    "/test"         	: true,
	"/user/list"		: ["jwt"],
	"/user/lr"			: ["jwt","lat","lon","dist"],
	"/user/reserve" 	: ["jwt","id","user"],
	"/user/cancel"  	: ["jwt","user"],
	"/vendor/upl"		: ["jwt","item"],
	"/vendor/upl2"		: ["jwt","item","loc","tags","timestamp"],
	"/vendor/del"		: ["jwt", "id"],
	"/vendor/conf"		: ["jwt","user","id"],
	"/vendor/checkres"	: ["jwt","vendor"]
};



//utils for parsing the body into a json we can interact with
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.raw({extended:true}));

// CORS : Cross Origins request something (not actaully something i just forgot)
// this is needed to allow devices to connect to our server
app.use(cors());

app.use(express.json());


app.use('', (req, res, next) => { // Using this as a general request logger 
	//console.log(req.path);
	
		console.log('\n');
		req.setEncoding('utf8');
		let str = `${req.method} to path: ${req.path}`;
		console.log(str);
		Log.writeToLog(str);
	next();
});

// Attach a single resbody to be used across multiple middleware
// Removed need to create a new object each time, also lets us pass it out for handling
app.use('',(req,res,next) => {
    let resbody = new sutil.res_obj();
    res.locals.resbody = resbody;
    
    validateKeys(req,res,next);
});


app.use('/' ,coreRouter); // mount core routes
app.use('/user/', userRouter); // mount user routes
app.use('/vendor/', vendorRouter); // mount vendor routes
app.use('/images/', ImageRouter);

/**
 * Middle ware function to check for our valid keys in the bodies of requests
 * @param {*} req : request object 
 * @param {*} res : response object
 * @param {*} next : next middleware in the stack
 * @returns Goes to next middle ware if pass tests, go to error middleware if fail
 */
function validateKeys(req, res, next){
    console.log(`Keys for ${req.path} =`,VALID_KEYS[req.path]);
    if(req.path in Object.keys(VALID_KEYS)){ // path is in dict
        if(VALID_KEYS[req.path] != true){ // key is not default true case 
            if(!sutil.validate(VALID_KEYS[req.path],req.body)){ // keys are not present within the request body
                return next(1); // send error code 1: bad body (body shaming?)
            }
        }

    }
    next();
    
}

/**
 * Handle errors from express middleware
 * @param {*} err : error code or object
 * @param {*} req : request
 * @param {*} res : response
 * @param {*} next : next middleware object
 * @returns Responds with appropriate error code to request
 */
function errorHandle(err,req,res,next){
    let resbody = res.locals.resbody;
    if(typeof err === "number"){
        resbody.setIssue(err);
    }
    else if(typeof err === "object"){
        resbody.setIssues(err);
    }

	console.log(`Logging:`,res.locals.resbody.issues);
	let str = JSON.stringify(res.locals.resbody.issues);
	res.end(resbody.package());
	Log.writeToLog(str); // log 
	return;


}

// custom error handler
app.use((err,req,res,next)=>{
    res.status = 200;
    console.log("Error Handler Call");
    errorHandle(err,req,res,next);
})

// Final middleware to respond and log
app.use((req,res,next)=>{
	console.log(`Logging:`,res.locals.resbody.data);
	res.end(res.locals.resbody.package());
	let str = JSON.stringify(res.locals.resbody.data);
	Log.writeToLog(str);
	return;
})

// keeps this app open on the specifed port
app.listen(port, () => {
	console.log(`SQL running on ${process.env.DB_HOST} port: ${process.env.DB_PORT}`);
	console.log(`listening to on port: ${port}`);
	
});

