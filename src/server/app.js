// Required Packages
const express = require('express')
const database = require('mysql')
const bcrypt = require('bcrypt');

// Server Constants
const port = 3000;
const hostname = "localhost";

// Express app 
const app = express();

require('dotenv').config({path: __dirname +'/.env'}); // fix .env path 

// SQL connection structure
// Gets sql login info from the ./env file
// Switched to using a pool connection for mulitple uploads
// wont need the user to have a pool connection but our server can so it can upload to the database with out issue
var db_pool = database.createPool({
	connectionLimit: 10,
	host: process.env.DB_HOST,
	port: process.env.DB_PORT,
	user: process.env.DB_USER,
	password: process.env.DB_PASS,
	database: process.env.DB_ACTIVE_DB
});




// util function for error responses
// takes in the error object and checks if we have a method of handling
// takes in a response object to return if we do have a handler method, if not throws an exception and closes
// returns a err_response list [0:statuscode, 1:content, 2:fatal] fatal is 1 for fatal, 0 for non fatal
// remove this shit in the future its trash
function errRespond(err){
	let out = []
	switch(err.errno){
		case 1062: // Duplicate entry. The SQL server is set to only allow unique emails so it will throw an error for duplicates
			console.log("Duplicate Entry, Non-Fatal for us");
			out[0] = 400;
			out[1] = JSON.stringify({
				msg: "User Already has an account! try signing in."
				});
			out[2] = 0; // non fatal
			return out;
			break;
		default: // Add other errnos above 
			out[0] = 500;
			out[1] = JSON.stringify({
				msg: "FATAL ERROR!"
				});
			out[2] = 1;
			return out;
	}
}

// function to handle all errors not handled by errno
// if no user or password is given missing user : no_user , missing password : no_pass
function sysRespond(sysError){
	let out = []
	switch(sysError){
		case "no_user":
			console.log("No user name recieved");
			out[1] = JSON.stringify({
				msg: "No user name given, please add user name and try signing in again."
			});
		case "no_pass":
			console.log("No password recieved")
			out[1] = JSON.stringify({
				msg: "No password given, please add password and try signing in again. If you dont have an account , please make one."
			});

	}


}


// call when terminating to ensure db pool is closed 
// can also just be used to call things on termination in general hopefully
function terminate(err){
	
	// Pools closed bitch
	db_pool.end(function (err) {
		if (err) throw err;
	});
	
	throw err; // throw the error to console and halt program

}
// Basic input 
// Doesnt do anything but respond with a json
app.get('/test', (req,res) => {
	res.statuscode = 200;
	res.setHeader('Content-Type','application/json');
	res.end(
		JSON.stringify({
			test1: "true",
			words: "words words words"
		})
	);
});


// create an error handler response 
// pass in the given error from the function and then generate response

// "Create" a new user by calling a put with the specified parameters 
app.post('/newuser', (req,res) => { 
	res.setHeader('Content-Type', 'application/json'); // set response to be a json 
		
	if(req.query.email && req.query.pass){ // check for the required headers 
		var insert_user = 'INSERT INTO user_data (user_email, password) VALUES (' + db_pool.escape(req.query.email)+", "  + db_pool.escape(req.query.pass)+')';
		console.log(`Attempting to insert ${req.query.email} ${req.query.pass}`)
		// The pool code made this part like 1 line which is really nice
		db_pool.query(insert_user, function (err) {
			if (err){
				let err_response = errRespond(err);	// get error response info
				res.statuscode = err_response[0]; // place into the response
				res.end(err_response[1]);
				
				if(err_response[2] == 1){
					terminate(err);
				}
			}
			else{
				console.log("User added successfully");
			}
		});
	}
	else{
		if(!req.query.email){
			sysRespond("no_user")
		}
		else if(!req.query.pass){
			sysRespond("no_pass")
		}
	}
	
});

// Code to get user information here
app.get('/getuser', (req,res) => {
	
	if(req.query.email && req.query.pass){
		var check_user = "SELECT * FROM user_data WHERE user_email = " + db_pool.escape(req.query.email); // find the row of the specified user
		
		let isUser = false;
		db_pool.query(check_user, function(err, result) {
			if (err) throw err;
			
			if(result[0]){
				if(result[0].password == req.query.pass){
					isUser = true;
					console.log("Valid user login!");
				}
			}
		
		});
		
		res.statuscode = 200;
		res.setHeader("Content-Type", 'application/json');
		res.end(
			JSON.stringify({
				msg: "found user!",
				logged_in: isUser
			})
			);
		
	}
	else{
		res.statuscode = 200;
		res.setHeader("Content-Type", 'application/json');
		res.end(
			JSON.stringify({
				msg: "Could not find user!"
			})
			);
	}
	
});


// Close the connection pool started on initialization
app.get('/closecons', (req,res) => {
	res.statuscode = 200;
	res.end();
	console.log("Closing Pool");
	db_pool.end(function (err) {
		if (err) throw err;
	});
});

// keeps this app open on the specifed port
app.listen(port,hostname, () => {
	console.log(`SQL running on ${process.env.DB_HOST} port: ${process.env.DB_PORT}`);
	console.log(`listening to ${hostname} on port: ${port}`);
	
});