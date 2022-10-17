// Required Packages
const express = require('express');
const database = require('mysql');
//const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const session = require('express-session');

const MyStore = require('./memstore.js');
const DBHandler = require('./sqlhandler.js');
const { isNull } = require('underscore');

const bodyParser    = require('body-parser');
const { on } = require('./memstore.js');


// Server Constants
const port = 3000;
const hostname = "localhost";

// Express app 
const app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))


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

function testCall(obj){
	console.log(Object.keys(obj));
	console.log(Object.values(obj));
	return;
}

// Basic test
// responds with a json of the passed query items
app.post('/test_post', (req,res) => {
	//console.log(req);


	req.setEncoding('utf8'); // Set encoding on this side to match encoding on fakefront (soon to be called something else)
	req.on('data', (chunk) => { // When we recieve the chunk set the body
		testCall(JSON.parse(chunk)); // The chunk data comes in super late so it needs to get passed to a function, I think this can be handled pretty easily
		res.statuscode = 200;
		res.setHeader('Content-Type','application/json');
		res.end(
		JSON.stringify({
			msg: 'Test Post Working!',
		})
	);
	})

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
app.use(express.json());



// Create new user
// Changing this to '/signup'
app.post('/signup', (req,res) => { 
	res.setHeader('Content-Type', 'application/json'); // set response to be a json 

	// our response is just going to contain the issue field for signup
	var response_obj = {
		issue: 0 // no issue until we get one 
	}
	
	// Lets get the data out of the body
	req.setEncoding('utf8'); 
	req.on('data', (body) => { // need to get something in the body before we do anything
		body = JSON.parse(body); // parse the object as a json (we need to make sure this is enforced i don't wanna have to deal with non json lmao)
		console.log(body);

		if(body.email && body.pass){ // have the required arguments
			//var isVendor = (body.isVendor) ? body.isVendor : 0; // if we have the field make it the field else make it 0

			DB.insertUser(body.email, body.pass, (err) => { // attempt to insert the user into the database
				if(err){ // error on insertion
					if(err.errno == 1062){ // duplicate entry
						response_obj.issue =1;
					}
					else{
						response_obj.issue = 2;
						throw err; // unexpected err
					}
				}
				else{ // no error on insert
					response_obj.issue = 0;
				}
				res.end(JSON.stringify(response_obj)); // send the result back
			});
		}
		else{
			// did not get the right parameters on input
			response_obj.issue = 2;
			res.end(JSON.stringify(response_obj));

		}
	});
});

// Code to get user information here
//app.get('/login', (req,res) => {
app.post('/login', (req, res) => {	
	res.setHeader("Content-Type", 'application/json');
	var response_obj = { // response object
		issue: 0,
		user: "",
		pass: "",
		vend: 0
	}

	// get the body of the request
	req.setEncoding('utf8');
	req.on('data', (body) => {
		body = JSON.parse(body);
		console.log(body);

		if(body.email && body.pass){ // have required fields
			DB.getUser(body.email, (err, pass) => {
				console.log(pass);
				if(err){ // issue probably SQL related
					response_obj.issue = 3;
					throw err;
				}

				if(!pass){ // no result given back but no error indicates no user exists 
					response_obj.issue = 1; // no email found
					res.end(JSON.stringify(response_obj));
				}
				else{ // we got the password back
					if( body.pass == pass ){ // matched password to a user
						response_obj.issue = 0;
						response_obj.user = body.email;
						response_obj.pass = body.pass;
						// vendor is not really set up yet

						req.session.regenerate( (err) => { // session stuff
							if (err) throw err;
							req.session.user = body.email;

							req.session.save( (err) => {
								res.end(JSON.stringify(response_obj));
							});
						});
					}
					else{ // bad password
						response_obj.issue = 2; // email exists in db but pass is not a match
						response_obj.user = body.email;
						res.end(JSON.stringify(response_obj));
					}
				}
			})
		}
		else{
			response_obj.issue = 3; // no args 
			res.end(JSON.stringify(response_obj));
		}
	});
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
			issue: 0,
			user: out_user
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

	food_list = {
		populated: 0
	}

	if(req.session.user){ // user has a session
		console.log(`User has session!`);
		food_list.populated = 1;
	}
	else{
		console.log("session data not found");
		food_list.populated = 0;
	}

	res.end(JSON.stringify(food_list));

})


// keeps this app open on the specifed port
app.listen(port,hostname, () => {
	console.log(db_pool.prototype);
	console.log(`SQL running on ${process.env.DB_HOST} port: ${process.env.DB_PORT}`);
	console.log(`listening to ${hostname} on port: ${port}`);
	
});