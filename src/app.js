const express = require('express')
const app = express();
const database = require('mysql')
const port = 3000;

require('dotenv').config({path: __dirname +'/.env'}); // fix .env path 

// SQL connection structure
// Gets sql login info from the ./env file
var db_connection = database.createConnection( {
	host: process.env.DB_HOST,
	port: process.env.DB_PORT,
	user: process.env.DB_USER,
	password: process.env.DB_PASS,
	database: process.env.DB_ACTIVE_DB
} );

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
	if(req.param("email") && req.param("pass")){ // check for the required headers 
		db_connection.connect(function(err) { // database connection using db_connect from above
			console.log("connection started");
			if(err) throw err;
			// SQL code is typed as a variable and then passed to a function
			var SQL_CODE = 'INSERT INTO user_data (user_email, password) VALUES (' + db_connection.escape(req.param("email"))+", "  + db_connection.escape(req.param("pass"))+')';
			db_connection.query(SQL_CODE, function(err, results,fields) {
				if (err) throw err;
				console.log("Added user!");
			});
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
		console.log("attempting to end connection");
		// End the connection (still strugling to get this to work and its generating errors when we don't end a connection)
		db_connection.end(function (err) {
			if(err) throw err;
		});
		console.log("Connection Ended");
	}
	else{
	res.statuscode = 400;}
	
});

// Code to get user information here
app.get('/getuser', (req,res) => {
	if(req.param("email") && req.param("pass")){}
});

// keeps this app open on the specifed port
app.listen(port, () => {
	console.log('listening on port ${port}');
});