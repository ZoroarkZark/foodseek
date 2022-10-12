// Required Packages
const express = require('express');
const database = require('mysql');
//const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const MyStore = require('./memstore.js');


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


// Instance of MyStore
const Store = new MyStore(db_pool);


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
		var insert_user = 'INSERT INTO user_data (user_email, password) VALUES (' + db_pool.escape(req.query.email)+", "  + db_pool.escape(req.query.pass)+')';
		var sign_sql = "INSERT INTO user_data ,user_email, password) VALUES $$"
		
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
				res.statuscode = 200;
				res.setHeader("Content-Type", 'application/json');
				res.end(
					JSON.stringify({
						msg: "account created!",
				
					})
				);
			}
		});
	}
	else{
		res.statuscode = 400; // Bad request no parameters given
		res.end(
			JSON.stringify({
				msg: (!req.query.email ? "No Email Provided!" : "No Password Provided!") // if no email, error is no email, if email then error must be password
		}
		)
		);
	}
	
});

// Code to get user information here
//app.get('/login', (req,res) => {
app.post('/login', (req, res) => {	
	if(req.query.email && req.query.pass){
		var check_user = "SELECT * FROM user_data WHERE user_email = " + db_pool.escape(req.query.email); // find the row of the specified user
		
		let isUser = false;
		db_pool.query(check_user, (err, result) => {
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
			throw err;
		}
		console.log(`Session: ${req.sessionID} destroyed from database`);
	});
	
})

// Basically I learned using cookies is super unsafe for tracking a user session. People can edit their cookies and could send 
// another users login token. To avoid that Im gonna implement sessions and some randomization when it comes to generating session keys 


// A temporary method to test giving cookies to users
// will check if cookie is already on a user before assigning
app.post('/getcookies', (req,res) => {
	// requiring parameter "email"
	if( db_pool.escape(req.query.email) ){
		
		if( req.cookies ){
			if( req.cookies.login_id){
				// this person already has a cookie
				console.log("Already logged in");
				res.status(200).end( JSON.stringify({
					login_id: req.cookies.login_id,
					msg: "you are already logged in"
				}));
				return; // this could fuck everything up idk
			}
		}
			
		var cookie_str = `${db_pool.escape(req.query.email)}123456`;
		res.cookie("login_id", cookie_str, {maxAge: 300000}); // give a cookie based on the provided email that lasts 5min(300k milliseconds)
		console.log("Gave user a cookie");
		res.status(200).end( JSON.stringify({
			login_id: cookie_str,
			msg: "successfully assigned login id",
		}));
		console.log(res);
	}
	else{
		res.status(400).end(JSON.stringify({
			msg: "give an email to login!"
		}));
	}
});

// Use cookies to perform some action
// This is gonna depreciate as soon as sessions is up
app.get('/cookieaction', (req,res) => {
	console.log(req.session);
	//console.log(req.cookies);
	if( req.cookies ){ // user has cookies
		
		if( req.cookies.login_id ){
			// a login_id cookie was found
			console.log("Logged in user doing something!");
			res.status(200).end(JSON.stringify( {
				login_id: req.cookies.login_id,
				msg: "A logged in user did something!"
			}));
		}
	}
	else{
		console.log("User is not logged in!");
		res.status(400).end(JSON.stringify({
			msg: "login before attempting that action!"
		}));
	}
		
	
});



// Session Test Post 
// Take in a parameter 'email' and assign it as the session variable `user`, and then upload both to the database
app.post('/ses_test', (req,res) => {
	console.log(req.sessionID); // print out the session id
	
	if( req.query.email ){
		req.session.user = req.query.email; // set the user in the session (I think this also sets the session)
	
		
		res.end('Done');
	}
	else{
		res.end('No Email Provided');
	}
	
});

// get session variables
app.get('/ses_test', (req,res) => {
	console.log(req.session);
	
	if (req.session.user){
		if (validateSession(req.sessionID, req.session.user)){
			res.end('Have a valid session');
		}
	}
	else{
		res.end('No Session');
	}
});

// keeps this app open on the specifed port
app.listen(port,hostname, () => {
	console.log(db_pool.prototype);
	console.log(`SQL running on ${process.env.DB_HOST} port: ${process.env.DB_PORT}`);
	console.log(`listening to ${hostname} on port: ${port}`);
	
});