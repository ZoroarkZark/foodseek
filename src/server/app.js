// Core Modules 
const express = require('express');

// http helpers
const bodyParser   = require('body-parser');
const cors         = require('cors');

//dot.env
require('dotenv').config({path: __dirname +'../.env'}); // fix .env path 

//our database talker (gonna honestly remove all db calls from here in a second)
// routers
const coreRouter = require('./routes/core.js').CoreRouter;
const userRouter = require('./routes/user.js').UserRouter;
const vendorRouter = require('./routes/vendor.js').VendorRouter;

// Server Constants
const port = process.env.PORT || 3000;
const hostname = "0.0.0.0";

// Express app 
const app = express();

//utils for parsing the body into a json we can interact with
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

// CORS : Cross Origins request something (not actaully something i just forgot)
// this is needed to allow devices to connect to our server
app.use(cors());

app.use(express.json());

app.use( (req, res, next) => { // Using this as a general request logger 
	req.setEncoding('utf8');
	console.log(`${req.method} to path: ${req.path} @ ${Date.now()}`);
	req.on('data', (data) => { 
		console.log("late");
		console.log(data);
		//console.log(Object.keys(data));
	});
	next();
})


app.use('/' ,coreRouter); // mount core routes
app.use('/user/', userRouter); // mount user routes
app.use('/vendor/', vendorRouter); // mount vendor routes

// keeps this app open on the specifed port
app.listen(port,hostname, () => {
	console.log(`SQL running on ${process.env.DB_HOST} port: ${process.env.DB_PORT}`);
	console.log(`listening to ${hostname} on port: ${port}`);
	
});
