const express = require('express')
const app = express();
const database = require('mysql')
const port = 3000;

require('dotenv').config({path: __dirname +'/.env'}); // fix .env path 

var db_connection = database.createConnection( {
	host: process.env.DB_HOST,
	port: process.env.DB_PORT,
	user: process.env.DB_USER,
	password: process.env.DB_USER_PASSWORD,
	database: process.env.DB_ACTIVE_DB
} );
	
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

app.put('/pt', (req,res) => {
	console.log(req.params);
	res.statuscode = 200;
	if(req.param("test")){
		console.log("found param");
	}
	else{
		console.log("no param found"); 
	}
	res.end();
});

app.listen(port, () => {
	console.log('listening on port ${port}');
});