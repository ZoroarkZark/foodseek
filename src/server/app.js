// Required Packages
const express = require('express');
const database = require('mysql');
//const bcrypt = require('bcrypt');
const cookieParser = require('cookie-parser');
const session = require('express-session');

//JWT
const jwt = require('jsonwebtoken');


const MyStore = require('./memstore.js');
const DBHandler = require('./sqlhandler.js');
const { isNull } = require('underscore');

const bodyParser    = require('body-parser');
const { on } = require('./memstore.js');
const e = require('express');


// Server Constants
const port = 80;
const hostname = "0.0.0.0";

// Express app 
const app = express();

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))


require('dotenv').config({path: __dirname +'/.env'}); // fix .env path 

const jwt_secret = process.env.JWT_SECRET; // store the secret

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
	pass_col: "password",
	vend_col: "vendor"

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

app.use(cookieParser()); // app.use is called on any method to any url : basically a update on any request method
app.use(session({
	store: Store,
	secret: "testsecret", // session secret between client and server 
	saveUninitialized: false, // these last two work on a store that we do not have set up / I don't wanna deal with it 
	resave: false//  wanna see if I can make my own store 
})); // call the session in each method 
app.use(express.json());

app.use( (req, res, next) => {
	console.log("req recieved");
	console.log(req.url);
	console.log(req.body);
	next();
})



// Basic test
// responds with a json of the passed query items
app.post('/test_post', (req,res) => {
	if(req.body){
		console.log(req.body);
		
		res.end( JSON.stringify({
			test: "Nico sucks dick"
		}));
	}
});

// XHR Sends the body immediatley before any response is sent so we are actually in the money
// We should be bale to add some extra clauses to ensure we get body data before moving forward even if they dont send the body data immedialy but turns out we were just overcomplicating it




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
		console.log('ACTION-------SIGNUP');

		if(body.email && body.pass){ // have the required arguments
			//var isVendor = (body.isVendor) ? body.isVendor : 0; // if we have the field make it the field else make it 0

			var vendStatus = (body.vendor) ? body.vedor : 0;
			DB.insertUser(body.email, body.pass, vendStatus, (err) => { // attempt to insert the user into the database
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

	if(req.body){
		//body = JSON.parse(req.body);
		// lol
		if(body.email && body.pass){ // have required fields
			DB.getUser(body.email, (err, result) => {
				console.log(result);
				if(err){ // issue probably SQL related
					response_obj.issue = 3;
					throw err;
				}

				if(!result["password"]){ // no result given back but no error indicates no user exists 
					response_obj.issue = 1; // no email found
					res.end(JSON.stringify(response_obj));
				}
				else{ // we got the password back
					if( body.pass == result["password"] ){ // matched password to a user
						response_obj.issue = 0;
						response_obj.user = body.email;
						
						//create token to send back to user
						const user = {id: body.email}
						const token = jwt.sign({
							user,
							vendor: result["vendor"]

						}, jwt_secret, {
							expiresIn: 8000000
						});

						console.log(`Token : ${token}`);
						// pass the jwt as a cookie to the user
						res.cookie("jwt", token, {
							httpOnly: true,
							maxAge: 8000000 *1000
						})

						res.end(JSON.stringify(response_obj));

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
	}
	else{
		req.on('data', (chunk)=>{
			console.log(`Recieved ${chunk} hella late`);
		})
	}

	
});

// logs out the user by destroying the session
app.get('/logout', (req, res) => {
	// once store class in made add logic to remove session id from database
	console.log('ACTION-------LOGOUT');
	
	res.cookie("jwt", "",{maxAge: "1"}); // null their cookie
	res.end(JSON.stringify({
		issue: 0
	}))
	
})

// ____________________
// | Food For Thought |
// |__________________|
/*
	Food posting soon to come
*/
// Not the actual thing just yet but gonna use this to test signed in users
app.post('/foodlist', (req, res) => {
	console.log('ACTION-------FOODLIST');
	//console.log(req.cookies);
	const resp_obj = {
		issues: 0,
		populated: 0
	};

	const jwt_token = req.cookies.jwt; // get the jwt token
	if(jwt_token){ // non-null token
		jwt.verify(jwt_token, jwt_secret, (err, decoded) => {
			if(err){ // jwt decode error 
				resp_obj.issues =2;
				res.end(JSON.stringify(resp_obj));
				throw err;
			}
			resp_obj.user = decoded.id;
			console.log(decoded);
			if(decoded.vendor == 1){ // decoded user is a vendor
				resp_obj.populated = 1;
				res.end(JSON.stringify(resp_obj));
			}
			else{ // decoded user is not a vendor
				resp_obj.populated = 1;
				res.end(JSON.stringify(resp_obj));
			}
		});
	}
	else{
		resp_obj.issues = 1;
		res.end(JSON.stringify(resp_obj));
	}

});






// keeps this app open on the specifed port
app.listen(port,hostname, () => {
	console.log(db_pool.prototype);
	console.log(`SQL running on ${process.env.DB_HOST} port: ${process.env.DB_PORT}`);
	console.log(`listening to ${hostname} on port: ${port}`);
	
});