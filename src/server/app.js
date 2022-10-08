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

// "Create" a new user by calling a put with the specified parameters 
app.post('/newuser', (req,res) => { 
	console.log(req.query);
	if(req.query.email && req.query.pass){ // check for the required headers 
		var insert_user = 'INSERT INTO user_data (user_email, password) VALUES (' + db_pool.escape(req.query.email)+", "  + db_pool.escape(req.query.pass)+')';
		console.log(`Attempting to insert ${req.query.email} ${req.query.pass}`)
		// The pool code made this part like 1 line which is really nice
		db_pool.query(insert_user, function (err) {
			if (err){
				console.log(`Pass : ${process.env.DB_PASS}`);
				throw err;
			}
			console.log("added user to db");
		});
		//Response formation
		
		res.statuscode = 200;
		res.setHeader('Content-Type', 'application/json');
		res.end(
			JSON.stringify({
				new_user: req.query.email,
				new_pass: req.query.pass
			})
			);
		
	}
	else{
		console.log("Couldn't find parameters");
		res.statuscode = 400;
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