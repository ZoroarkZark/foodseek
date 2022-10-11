
// MEMORY STORE FOR OUR EXPRESS-SESSION
<<<<<<< HEAD
const mysql   = require('mysql')
const session = require('express-session');
const _ = require('underscore');

=======
const mysql = require('mysql')
const sess = require('express-session');
>>>>>>> f95f9a6507f081a5aa271289e8bdc9782986a126
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
<<<<<<< HEAD
	class MyStore extends session.Store {
		
		// Initialize the connection pool
		// gonna hardcode in our default options here
		// if we need to tweak them just tweak them here
		// this store is our product specific and shouldnt need to be 
		// used be other people
		constructor(connection){
			super();
			// clearExpired   : remove xpired sessions?
			// expireInterval : time to check expired sessions
			// maxAge		  : default max age for each session
			// schema 		  : object notation representating helpful info about our database
			this.conn_pool = connection;
			this.options                = {}
			this.options.table_name     = "session_data";
			this.options.clearExpired   = true;
			this.options.expireInterval = 900000;
			this.options.maxAge         =86400000; 
			this.options.schema         = {
									table_name: 'session_data',
										columns: {
											id: 'session_id',
											data: 'session_obj',
											expr: 'expires'

										}
								};
			


			// if we are clearing expired items
			// set the interval to do so
			
			if (this.options.clearExpired) { // check if the option is true
				this.setExpirationInterval(); // call this function to start expiration 
			}
			
=======
	class MyStore extends sess.MemoryStore {
		
		// Initialize the connection pool
		constructor(options = {} ){
			super(options);
			this.table = options.table_name;
			
			this.conn_pool = options.conn_pool;
>>>>>>> f95f9a6507f081a5aa271289e8bdc9782986a126
		}
		
		
		//Required function
		// using a session id get an active session object
		//callback(err,session)
		get(sid, callback = noop){
			
			console.log(`Attempting to get session: ${sid}`);

			// Get all that match this session id 
<<<<<<< HEAD
			var get_sql = 'SELECT ?? AS data, ?? as expires FROM ?? WHERE ?? = ?';
			// going to replace ?? and ? with these values in order
			var parameters = [
				this.options.schema.columns.data,
				this.options.schema.columns.expr,
				this.options.schema.table_name,
				this.options.schema.id,
				sid
			]
=======
			var get_query = `SELECT session_obj FROM ${this.table} WHERE session_id = '${sid}'`;
>>>>>>> f95f9a6507f081a5aa271289e8bdc9782986a126
			
			var sql = mysql.format(get_sql, parameters); // format (replace ?? with parameters)
			// *format also escapes the values

			// call the query 
			this.conn_pool.query(sql, (err, results) => {
				if( err ){
					console.log(`Could not find session: ${sid}`);
					return callback(err,null);
				}
				
				var result = results[0] || null; // return the item or null

				if(!result) {
					return callback(null,null); // item not found, no error 
				}

				var data;
				// try to parse the string into a json object
				try{
					data = JSON.parse(result.session_obj); 
				}
				catch (err){
					console.log(`Trouble parsing session into object for ${sid}`);
					return callback(err);
				}

				callback(null,data); // sucessful return here 

			});
			
		}
		
		//Set
		//add a session to the datastore
		// sid      : sessionID
		// session  : the session object 
		// callback : callback function for the  cb(err)
		set(sid, session, callback = noop){
			
			// create an expiration time
			var expr_time = Date.now() + this.options.maxAge;
			session = JSON.stringify(session);
			
			// set items 
			var set_sql = "INSERT INTO ?? (??, ??, ??) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE ?? = VALUES(??), ?? = VALUES(??)";
			
			var parameters = [
				this.options.table_name,
				this.options.schema.id,
				this.options.schema.expr,
				this.options.schema.data,
				sid,
				expr_time,
				session,
				this.options.schema.expr,
				this.options.schema.expr,
				this.options.schema.data,
				this.options.schema.data


			]

			var sql = mysql.format(set_sql, parameters)
			this.conn_pool.query(sql, (err) => {
				if (err){ // error inserting data
					console.log(`Error setting ${sid} into DB!`);
					return callback(err);
				}
				
				callback();
			});
			
		}

		touch(sid, callback){
			console.log(`Touching session: ${sid}`);

			var expr_time = Date.now() + this.maxAge; // new expire time

			var touch_sql = "UPDATE ?? SET ?? = ? WHERE ?? = ?";
			var parameters = [
				this.options.table_name,
				this.options.schema.expr,
				expr_time,
				this.options.schema.id,
				sid
			];

			var sql = mysql.format(touch_sql,parameters);

			this.conn_pool.query(sql, (err) => {
				if(err){
					console.log(`Failed to touch session : ${sid}`);
					return callback(err)
				}

				return callback();
			});


		}
		
		//remove a session
		// Curently this times out each time
		destroy(sid, callback){

<<<<<<< HEAD
			console.log(`Destroying session: ${sid}`);
			
			var del_sql = "DELETE FROM ?? WHERE ?? = ?";
			
			var parameters = [
				this.options.table_name,
				this.options.schema.id
			];

			var sql = mysql.format(del_sql,parameters);

			this.conn_pool.query(sql, (err) => {
				if (err) {
					console.log(`Error deleting session: ${sid}`);
					return callback(err); // pass error to callback
				}

				callback(); // pass nothing to call back
			});
			
		}

		// clear expired items
		clearExpired(callback){
			console.log("Clearing expired items");

			var clear_sql = "DELETE FROM ?? WHERE ?? < ?";
			
			var parameter = [
				this.options.table_name,
				this.options.schema.expr,
				Date.now()
			]

			var sql = mysql.format(clear_sql,parameter);
			this.conn_pool.query(sql, (err) => {
				if (err){
					console.log("Failed to remove expired sessions");
					callback(err);
				}

				callback();
			});
		}

		// Create a interval to run clearExpired
		setExpirationInterval(interval){
			interval || (interval = this.options.expireInterval);
			console.log(`Setting expire clear interval to ${interval}`);

			this.endInterval();
			this._runningInterval = setInterval(this.clearExpired.bind(this), interval);
		}


		// clear said interval
		endInterval(){
			console.log("Clearing Expire Interval");

			clearInterval(this._runningInterval);
			this._runningInterval = null;
		}
	}

=======

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
>>>>>>> f95f9a6507f081a5aa271289e8bdc9782986a126
		
			