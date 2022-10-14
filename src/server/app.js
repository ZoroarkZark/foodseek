// Required Packages
const express = require('express');
const database = require('mysql');
//const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const MyStore = require('./memstore.js');
const DBHandler = require('./sqlhandler.js');
const { isNull } = require('underscore');


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

// Options object for DBHandler
var db_handler_object = {
	pool: db_pool,
	user_table: "user_data",
	email_col: "user_email",
	pass_col: "password"

}

// Instance of MyStore
const Store = new MyStore(db_pool);
const DB    = new DBHandler(db_handler_object);

/*	 CAPTAINS LOG 10/11/2022
	It's cold outside. The fog has rolled in. 

	I want to rewrite all of the SQL queries in here and take out all usage of the db_pool.escape function
	We can rewrite all of em either with 
	var sql_code = "INSERT INTO ?? ?? ..."
	and then db_pool.format(sql_code, [values..])

	or even just
	db_pool.query(sql_code, [values..], callback)

*/ 


// Basic test
// responds with a json of the passed query items
app.post('/test_post', (req,res) => {
	res.statuscode = 200;
	res.setHeader('Content-Type','application/json');
	res.end(
		JSON.stringify({
			msg: 'Test Post Working!',
			passed_items: req.body,
		})
	);
});

// test get from server
app.get('/test_get', (req,res) => {
	res.statuscode = 200;
	res.setHeader('Content-Type','application/json');
	res.end(
		JSON.stringify({
			msg: 'Successful test get',
			response: "responde goes here"
		})
	);
});




app.use(cookieParser()); // app.use is called on any method to any url : basically a update on any request method
app.use(session({
	store: Store,
	secret: "testsecret", // session secret between client and server 
	saveUninitialized: false, // these last two work on a store that we do not have set up / I don't wanna deal with it 
	resave: false//  wanna see if I can make my own store 
})); // call the session in each method 
	


// Create new user
// Changing this to '/signup'
app.post('/signup', (req,res) => { 
	res.setHeader('Content-Type', 'application/json'); // set response to be a json 
	
	if(req.body.email && req.body.pass){ // check for the required headers 
		let isVend = false;

		if(req.body.isVendor){
			isVend = (req.body.isVendor == "true") ? true : false;
		}
		console.log(`Attempting to insert ${req.body.email} ${req.body.pass} into db`)
		// The pool code made this part like 1 line which is really nice
		DB.insertUser(req.body.email, req.body.pass, (err) => {
			if(err){
				res.end("Error on insertion");
				throw err;
				// handle dup entry for user has an account 
			}

			res.end(
				JSON.stringify(
					{
						status: "Successful Insertion",
						user_email: req.body.email,
						user_pass: req.body.pass,
						isVendor: isVend
					})
			);
		});

	}
	else{
		res.end("Bad input args")
	}
	
});

// Code to get user information here
//app.get('/login', (req,res) => {
app.post('/login', (req, res) => {	

	if(req.body.email && req.body.pass){
		var check_sql = "SELECT * FROM $ WHERE $ = $$";
		var parameters = 
		[
			"user_data",
			"user_email",
			req.body.email
		]
		DB.getUser(req.body.email , (err, pass) => {
					console.log("Valid user login!");
					req.session.regenerate(function (err) {
						if (err) throw err;
						req.session.user = req.body.email // store user info in session
						//saveSession(req.sessionID, req.session.user) // save session in database not sure if we want this going forward
						req.session.save(function (err) {
							if (err) throw err;
							res.end(`signed in ${req.body.email} with sessionid: ${req.sessionID} `);
						})
						
					})
				
		});
	} 
	else{

		res.statuscode = 400;
		res.setHeader("Content-Type", 'application/json');
		res.end(
			JSON.stringify({
				msg: "Faulty Parameters!"
			})
			);
	}
	
});

// logs out the user by destroying the session
app.get('/logout', (req, res) => {
	// once store class in made add logic to remove session id from database
	var out_user = req.session.user;
	req.session.user = null
	req.session.save( (err) => {
		if (err) throw err;
			req.session.destroy((err) => {
				if (err) throw err;
			})
	})
	
	
	res.end(
		JSON.stringify({
			msg: `Signed out ${out_user}`
		})
	);
	
})

// ____________________
// | Food For Thought |
// |__________________|
/*
	Food posting soon to come
*/
// Not the actual thing just yet but gonna use this to test signed in users
app.post('/foodlist', (req, res) => {
	if(req.session.user){ // user has a session
		// food list 
		res.end("Signed in user action!");
	}
	else{
		res.end("Not signed in user!");
	}

})


// keeps this app open on the specifed port
app.listen(port,hostname, () => {
	console.log(db_pool.prototype);
	console.log(`SQL running on ${process.env.DB_HOST} port: ${process.env.DB_PORT}`);
	console.log(`listening to ${hostname} on port: ${port}`);
	
});