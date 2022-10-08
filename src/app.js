const express = require('express')
const app = express();
const database = require('mysql')
const port = 3000;

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
app.put('/newuser', (req,res) => { 
	console.log("made it here");
	if(req.param("email") && req.param("pass")){ // check for the required headers 
		var insert_user = 'INSERT INTO user_data (user_email, password) VALUES (' + db_pool.escape(req.param("email"))+", "  + db_pool.escape(req.param("pass"))+')';

		// The pool code made this part like 1 line which is really nice
		db_pool.query(insert_user, function (err) {
			if (err) throw err;
			console.log("added user to db");
		});
		//Response formation
		console.log("formulating response object");
		res.statuscode = 200;
		res.setHeader('Content-Type', 'application/json');
		res.end(
			JSON.stringify({
				new_user: req.param("email"),
				new_pass: req.param("pass")
			})
			);
		
	}
	else{
	res.statuscode = 400;}
	
});

// Code to get user information here
app.get('/getuser', (req,res) => {
	
	if(req.param("email")){
		var check_user = "SELECT * FROM user_data WHERE user_email = " + db_pool.escape(req.param("email")); // find the row of the specified user
		
		var results;
		db_pool.query(check_user, function(err, result) {
		if (err) throw err;
		results = result;
		});
		
		res.statuscode = 200;
		res.setHeader("Content-Type", 'application/json');
		res.end(
			JSON.stringify({
				results: results,
				msg: "found user!"
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
app.listen(port, () => {
	console.log('listening on port:');
	console.log(port);
	
});