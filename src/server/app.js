// Required Packages
const express = require('express');
const database = require('mysql');
//const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const MyStore = require('./memstore.js');
const DBHandler = require('./sqlhandler.js');


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
	user_tabl: "user_data",
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


// call when terminating to ensure db pool is closed 
// can also just be used to call things on termination in general hopefully
function terminate(err){
	
	// Pools closed bitch
	db_pool.end(function (err) {
		if (err) throw err;
	});
	
	throw err; // throw the error to console and halt program

}


// Basic test
// responds with a json of the passed query items
app.post('/test_post', (req,res) => {
	res.statuscode = 200;
	res.setHeader('Content-Type','application/json');
	res.end(
		JSON.stringify({
			msg: 'Test Post Working!',
			passed_items: req.query,
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
	
	if(req.query.email && req.query.pass){ // check for the required headers 
		


		
		console.log(`Attempting to insert ${req.query.email} ${req.query.pass} into db`)
		// The pool code made this part like 1 line which is really nice
		DB.insertUser(req.query.email, req.query.pass, (err) => {
			if(err){
				res.end("Error on insertion");
				throw err;
			}
			res.end("User Inserted");
		});

	}
	else{
		res.end("Bad input args")
	}
	
});

// Code to get user information here
//app.get('/login', (req,res) => {
app.post('/login', (req, res) => {	
	if(req.query.email && req.query.pass){
		var check_sql = "SELECT * FROM $ WHERE $ = $$";
		var parameters = 
		[
			"user_data",
			"user_email",
			req.query.email
		]
		db_pool.query(check_sql, parameters, (err, result) => {
			if (err) throw err;
			
			if(result[0]){
				if(result[0].password == req.query.pass){
					req.session.logged_in = true
					req.session.user = req.query.email // store user info in session
					console.log("Valid user login!");
					req.session.regenerate(function (err) {
						if (err) throw err;
						
						//saveSession(req.sessionID, req.session.user) // save session in database not sure if we want this going forward
						req.session.save(function (err) {
							if (err) throw err;
							//res.redirect('/')
						})
						
					})
				}
			}
			else {
				// could not find user in database code goes here
				console.log("invaild pass word, try signing in again!");
				//res.redirect('/');										// going to want to redirect somewhere maybe back to login but not sure
			}
		
		});
		
		res.statuscode = 200;
		res.setHeader("Content-Type", 'application/json');
		res.end(
			JSON.stringify({
				msg: "found user!",
				//logged_in: isUser
			})
			);
		
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
	req.session.destroy( (err) => {
		if(err){
			console.log(`Couldnt destroy session: ${req.sessionID}`);
			res.end(
				JSON.stringify({
					msg: "Error signing out"
				})
			)
			throw err;
		}
		console.log(`Session: ${req.sessionID} destroyed from database`);
	});

	res.end(
		JSON.stringify({
			msg: "Signed out"
		})
	);
	
})

// Basically I learned using cookies is super unsafe for tracking a user session. People can edit their cookies and could send 
// another users login token. To avoid that Im gonna implement sessions and some randomization when it comes to generating session keys 


// keeps this app open on the specifed port
app.listen(port,hostname, () => {
	console.log(db_pool.prototype);
	console.log(`SQL running on ${process.env.DB_HOST} port: ${process.env.DB_PORT}`);
	console.log(`listening to ${hostname} on port: ${port}`);
	
});