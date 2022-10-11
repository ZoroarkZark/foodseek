
// MEMORY STORE FOR OUR EXPRESS-SESSION
const mysql = require('mysql')
const sess = require('express-session');
require('dotenv').config({path: __dirname +'/.env'}); // fix .env path and require env 
const events = require('events');

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
module.exports =
	class MyStore extends sess.MemoryStore {
		
		// Initialize the connection pool
		constructor(options = {} ){
			super(options);
			this.table = options.table_name;
			
			this.conn_pool = options.conn_pool;
		}
		
		//Required function
		// using a session id get an active session object
		//callback(err,session)
		get(sid, callback = noop){
			
			// Get all that match this session id 
			var get_query = `SELECT session_obj FROM ${this.table} WHERE session_id = '${sid}'`;
			
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
		
		//Set
		//add a session to the datastore
		// sid      : sessionID
		// session  : the session object 
		// callback : callback function for the  cb(err)
		set(sid, session, callback = noop){
			// set items 
			var set_query = `INSERT INTO ${this.table} (session_id,last_touched,session_obj) VALUES ( ${sid}, ${Date.now()}, ${JSON.stringify(session)})`;
		
			this.conn_pool.query(set_query, (err) => {
				if (err) throw err;
				
				callback(err);
			});
			
		}
		
		//remove a session
		// Curently this times out each time
		destroy(sid, callback){


			// Delete query code for SQL
			var del_query = `DELETE FROM ${this.table} WHERE session_id = '${sid}'`;
			//console.log(del_query); // print out 

			//switching over to the getConnection flow
			// This will split up the pool.query into steps so we can
			// see what part might be failing more clearly
			// might be good to implement this across the board
			this.conn_pool.getConnection( (err, conn) => {
				if (err) throw err;

				conn.query(del_query, (err, res, fields) => {
					conn.release(); // release connection bc we are done w it
					
					if (err) throw err;

					callback(err);
				});
			});
			
		}
}
		
			
			