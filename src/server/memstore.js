// MEMORY STORE FOR OUR EXPRESS-SESSION
const mysql = require('mysql')
require('dotenv').config({path: __dirname +'/.env'}); // fix .env path and require env 



/*
	REQUIRED:
		- destroy(sid, callback)
			delete a session from the store given sid. The callback should be called as callback(err)
		- get(sid, callback)
			return a session from the store given sid, the callback should be callback(err, session) (where session is a session if found otherwise null)
		- set(sid, session, callback)
			Insert a session with sid into the store, callback(err)
		
	RECOMMENDED
		- touch(sid, session, callback)
			"touch" a session given a sessionID and session object (update the time), callback(err)
	
	OPTIONAL
		- all(callback)
			return all sessions in an array, callback(err,sessions)
		- clear(callback)
			delete all sessions from a store, callback(err)
		- length(callback)
			get the count of all sessions in the store, callback(err,len)
		

*/


// Memory store class 
// By Express-Session requirement must be an event emiiter 
module.exports = function (session) {
	const Store = session.Store // Get the store object from the session (I'm pretty sure this is done to extend the EventEmitter class
	
	const noop = () => {} // No operation, use in case call back isn't solid
	
	class MyStore extends Store {
		
		// Initialize the connection pool
		constructor(options = {} ){
			this.table = options.table_name;
			
			this.conn_pool = mysql.createPool({
				connectionLimit: 10,
				host: process.env.DB_HOST,
				port: process.env.DB_PORT,
				user: process.env.DB_USER,
				password: process.env.DB_PASS,
				database: process.env.DB_ACTIVE_DB
			});
		}
		
		//Required function
		// using a session id get an active session object
		//callback(err,session)
		get(sid, callback = noop){
			
			// Get all that match this session id 
			var get_query = `SELECT session_obj FROM ${this.table} WHERE session_id = ${sid}`;
			
			// call the query 
			this.conn_pool.query(get_query, (err, results) => {
				if (err) throw err;
				
				if(results[0]){ // found a result (hopefully just the one)
					callback(err, JSON.parse(result[0])); // call the callback with the parsed result as the session object (we stringify the session object on set
				}
				else{ // no result so pass back nothing
					callback(err, null);
				}
			});
			
		}
		
		//add a session to the datastore
		set(sid, session, callback = noop){
			// set items 
			var set_query = `INSERT INTO ${this.table} (session_id,last_touched,session_obj) VALUES ( ${sid}, ${Date.now()}, ${JSON.stringify(session)})`;
		
			this.conn_pool.query(set_query, (err) => {
				if (err) throw err;
				
				callback(err);
			});
			
		}
		
		//remove a session
		destroy(sid, callback){
			
			var del_query = `DELETE FROM ${this.table} WHERE session_id = ${sid}`;
			
			this.conn_pool.query(del_query, (err) => {
				if (err) throw err;
				callback(err);
			});
			
		}
	}
}
		
			
			