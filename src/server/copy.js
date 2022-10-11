'use strict';

// importing packages
var _ = require('underscore');
var mysql = require('mysql');
var path = require('path');
var util = require('util');


var debug = {
	log: require('debug')('express-mysql-session:log'),
	error: require('debug')('express-mysql-session:error')
};

// set up what this file will export
// a lambda function taking a session variable
module.exports = function(session) {

	var constructorArgs; // initialize a variable 

	// session.Store === undefined
	//  set session by requiring the package (we did not recieve it as a input arg so we have to force it for the inheritence)
	if (_.isUndefined(session.Store)) {
		session = require('express-session');
		constructorArgs = Array.prototype.slice.call(arguments); // arguements is like any extra args passed to a function so I think that this puts any extra things we got somewhere but idk
	}

	var Store = session.Store; // set this for inheritence later 

	// This is like the constructor sort of 
	var MySQLStore = function(options, connection, cb) { // more lamdba notation

		debug.log('Creating session store');

		//if  (connection instanceof Function) -> set the callback to the function and set connection to null
		// connections and pools are not an instanceof function
		if (_.isFunction(connection)) {
			cb = connection;
			connection = null;
		}

		this.connection = connection; // this class instances connection is equal to either input connection or null if it was a function 
		this.setOptions(options);

		if (!this.connection) { // create a connection pool based on the options
			this.connection = mysql.createPool(this.options);
		}

		// This sets up the auto clearing for the sessions
		var done = function() {

			if (this.options.clearExpired) { // check if the option is true
				this.setExpirationInterval(); // call this function to start expiration 
			}

			if (cb) { // if there is a callback call it with the args
				cb.apply(undefined, arguments);
			}

		}.bind(this); // gives this variable scope in the class or something idk fully

		/* pulled this from their schema.sql 
			table_name =  `sessions` (
  			`session_id` = varchar(128) COLLATE utf8mb4_bin NOT NULL,
  			`expires` = int(11) unsigned NOT NULL,
  			`data` = mediumtext COLLATE utf8mb4_bin,
  			PRIMARY KEY (`session_id`)
			
		*/

		if (this.options.createDatabaseTable) { // We can ignore this thing for our implementation but they have a function for creating the table in here if you dont have one 
			this.createDatabaseTable(done);
		} else {
			_.defer(done);
		}
	};

	util.inherits(MySQLStore, Store); // This is apparently a depreciated method of doing this anyways but this is where they inhereit

	// I did not add below comments, but I added all the ones above - Cal
	MySQLStore.prototype.defaultOptions = {
		// Whether or not to automatically check for and clear expired sessions:
		clearExpired: true,
		// How frequently expired sessions will be cleared; milliseconds:
		checkExpirationInterval: 900000,
		// The maximum age of a valid session; milliseconds:
		expiration: 86400000,
		// Whether or not to create the sessions database table, if one does not already exist:
		createDatabaseTable: true,
		// Number of connections when creating a connection pool:
		connectionLimit: 1,
		// Whether or not to end the database connection when the store is closed:
		endConnectionOnClose: true,
		charset: 'utf8mb4_bin',
		schema: {
			tableName: 'sessions',
			columnNames: {
				session_id: 'session_id',
				expires: 'expires',
				data: 'data'
			}
		}
	};

	// Back to my comments - Cal
	// Set the options as the input option object
	// Honestly probably a good idea for us to pass an options object and do some similar shit
	MySQLStore.prototype.setOptions = function(options) {

		this.options = _.defaults({}, options || {}, {
			// The default value of this option depends on whether or not a connection was passed to the constructor.
			// not mine ^ - Cal
			endConnectionOnClose: !this.connection,
		}, this.defaultOptions);

		this.options.schema = _.defaults({}, this.options.schema || {}, this.defaultOptions.schema);
		this.options.schema.columnNames = _.defaults({}, this.options.schema.columnNames || {}, this.defaultOptions.schema.columnNames);
		this.validateOptions(this.options);
	};

	// Ignore this 
	MySQLStore.prototype.validateOptions = function(options) {

		var allowedColumnNames = _.keys(this.defaultOptions.schema.columnNames);
		var userDefinedColumnNames = _.keys(options.schema.columnNames);
		_.each(userDefinedColumnNames, function(userDefinedColumnName) {
			if (!_.contains(allowedColumnNames, userDefinedColumnName)) {
				throw new Error('Unknown column specified ("' + userDefinedColumnName + '"). Only the following columns are configurable: "session_id", "expires", "data". Please review the documentation to understand how to correctly use this option.');
			}
		});
	};

	//// We can basically ignore this but they pull data from a file in a kind of cool way using a callback function
	// they also use the ?? operator and pass a list of values which is cool and we should look into
	MySQLStore.prototype.createDatabaseTable = function(cb) {

		debug.log('Creating sessions database table');

		var fs = require('fs');
		var schemaFilePath = path.join(__dirname, 'schema.sql');

		fs.readFile(schemaFilePath, 'utf-8', function(error, sql) {

			if (error) {
				debug.error('Failed to read schema file.');
				debug.error(error);
				return cb && cb(error);
			}

			sql = sql.replace(/`[^`]+`/g, '??'); // this looks kinda like regex pattern matching. I think its looking for `` to replace with ??
			// Seems like this is only a thing if you have different column names or something idk

			// This is the params they replace the ?? with 
			var params = [ 
				this.options.schema.tableName,
				this.options.schema.columnNames.session_id,
				this.options.schema.columnNames.expires,
				this.options.schema.columnNames.data,
				this.options.schema.columnNames.session_id
			];

			this.query(sql, params, function(error) {

				if (error) {
					debug.error('Failed to create sessions database table.');
					debug.error(error);
					return cb && cb(error);
				}

				cb && cb();
			});

		}.bind(this));
	};


	// required function
	MySQLStore.prototype.get = function(session_id, cb) {

		debug.log('Getting session:', session_id);

		// LIMIT not needed here because the WHERE clause is searching by the table's primary key.
		var sql = 'SELECT ?? AS data, ?? as expires FROM ?? WHERE ?? = ?';
		// Another good example of replacing ?? with the params, I think they have to be in order
		// ? -> use as placeholder
		// ?? -> escape what ever value is placed here (also a placeholder)
		// they escape all the actual sql portions and don't bother escaping the comparison value

		var params = [
			this.options.schema.columnNames.data,
			this.options.schema.columnNames.expires,
			this.options.schema.tableName,
			this.options.schema.columnNames.session_id,
			session_id
		];

		// start the query
		this.query(sql, params, function(error, rows) {

			if (error) {
				debug.error('Failed to get session:', session_id);
				debug.error(error);
				return cb(error, null); // they return the call back which we might want to do 
			}

			var row = rows[0] || null; // if there are no rows we return a null instead of undefined
			if (!row) { // if null this case is true
				return cb(null, null); // in express-session documentation they say this case happens  if the session was not found
			}

			// Check the expires time.
			var now = Math.round(Date.now() / 1000); // idk why they do this 
			if (row.expires < now) {
				// Session has expired.
				return cb(null, null);
			}

			// if we got to here then we have a row object which is the first result of the query
			var data = row.data;
			if (_.isString(data)) { // check if the data is a string : think this is for type safety and error prevention
				try {
					data = JSON.parse(data); // attempt to parse the string into a json object (the session object we are returning)
				} catch (error) {
					debug.error('Failed to parse data for session (' + session_id + ')');
					debug.error(error);
					return cb(error);
				}
			}

			cb(null, data); // no error, session found
		});
	};

	// another required function
	// data = session object passed from browser basically
	MySQLStore.prototype.set = function(session_id, data, cb) {

		debug.log('Setting session:', session_id);

		var expires;

		// check if we have an expire var somewhere
		if (data.cookie) {
			if (data.cookie.expires) {
				expires = data.cookie.expires;
			} else if (data.cookie._expires) {
				expires = data.cookie._expires;
			}
		}

		// if no expiration date on the cookie set the expiration to the current time plus default expiration time
		// I think we should do this and ignore the above logic about data.cookie
		if (!expires) {
			expires = Date.now() + this.options.expiration;
		}

		// type safety to make sure what ever they got was a date 
		if (!(expires instanceof Date)) {
			expires = new Date(expires);
		}

		// Use whole seconds here; not milliseconds.
		expires = Math.round(expires.getTime() / 1000);

		data = JSON.stringify(data); // turn the object into a string to upload to the database

		var sql = 'INSERT INTO ?? (??, ??, ??) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE ?? = VALUES(??), ?? = VALUES(??)';
		// more ?? usage 

		var params = [
			this.options.schema.tableName,
			this.options.schema.columnNames.session_id,
			this.options.schema.columnNames.expires,
			this.options.schema.columnNames.data,
			session_id,
			expires,
			data,
			this.options.schema.columnNames.expires,
			this.options.schema.columnNames.expires,
			this.options.schema.columnNames.data,
			this.options.schema.columnNames.data
		];

		this.query(sql, params, function(error) {

			if (error) {
				debug.error('Failed to insert session data.');
				debug.error(error);
				return cb && cb(error);
			}

			cb && cb(); // idk why they do this : means proper execution happened
		});
	};

	// recommended function
	// takes in session as data
	MySQLStore.prototype.touch = function(session_id, data, cb) {

		debug.log('Touching session:', session_id);

		var expires;

		//checking given cookie 
		// i think we can ignore this again
		if (data.cookie) {
			if (data.cookie.expires) {
				expires = data.cookie.expires;
			} else if (data.cookie._expires) {
				expires = data.cookie._expires;
			}
		}

		// do something like this
		if (!expires) {
			expires = Date.now() + this.options.expiration;
		}

		if (!(expires instanceof Date)) {
			expires = new Date(expires);
		}

		// Use whole seconds here; not milliseconds.
		expires = Math.round(expires.getTime() / 1000);

		// LIMIT not needed here because the WHERE clause is searching by the table's primary key.
		var sql = 'UPDATE ?? SET ?? = ? WHERE ?? = ?';

		var params = [
			this.options.schema.tableName,
			this.options.schema.columnNames.expires,
			expires,
			this.options.schema.columnNames.session_id,
			session_id
		];

		// They just update the expire column to be the new current time + expiration time 
		this.query(sql, params, function(error) {

			if (error) {
				debug.error('Failed to touch session (' + session_id + ')');
				debug.error(error);
				return cb && cb(error);
			}

			return cb && cb();
		});
	};

	// required function
	MySQLStore.prototype.destroy = function(session_id, cb) {

		debug.log('Destroying session:', session_id);

		// LIMIT not needed here because the WHERE clause is searching by the table's primary key.
		var sql = 'DELETE FROM ?? WHERE ?? = ?';

		var params = [
			this.options.schema.tableName,
			this.options.schema.columnNames.session_id,
			session_id
		];

		this.query(sql, params, function(error) {

			if (error) {
				debug.error('Failed to destroy session (' + session_id + ')');
				debug.error(error);
				return cb && cb(error);
			}

			cb && cb();
		});
	};

	// optional feature
	// good knowledge for how to implement it tho
	MySQLStore.prototype.length = function(cb) {

		debug.log('Getting number of sessions');

		var sql = 'SELECT COUNT(*) FROM ?? WHERE ?? >= ?';

		var params = [
			this.options.schema.tableName,
			this.options.schema.columnNames.expires,
			Math.round(Date.now() / 1000)
		];

		this.query(sql, params, function(error, rows) {

			if (error) {
				debug.error('Failed to get number of sessions.');
				debug.error(error);
				return cb && cb(error);
			}

			var count = rows[0] ? rows[0]['COUNT(*)'] : 0;

			cb(null, count);
		});
	};

	// gets all sessions that are not currently expired
	// tbh i don't fully understand their implementation
	MySQLStore.prototype.all = function(cb) {

		debug.log('Getting all sessions');

		var sql = 'SELECT * FROM ?? WHERE ?? >= ?';

		var params = [
			this.options.schema.tableName,
			this.options.schema.columnNames.expires,
			Math.round(Date.now() / 1000)
		];

		this.query(sql, params, function(error, rows) {

			if (error) {
				debug.error('Failed to get all sessions.');
				debug.error(error);
				return cb && cb(error);
			}

			var sessions = _.chain(rows).map(function(row) {
				var session_id = row.session_id;
				var data = row.data;
				if (_.isString(data)) {
					try {
						data = JSON.parse(data);
					} catch (error) {
						debug.error('Failed to parse data for session (' + session_id + ')');
						debug.error(error);
						return null;
					}
				}
				return [session_id, data];
			}).compact().object().value();

			cb && cb(null, sessions);
		});
	};

	// optional feature
	// just deletes all the sessions on the table
	MySQLStore.prototype.clear = function(cb) {

		debug.log('Clearing all sessions');

		var sql = 'DELETE FROM ??';

		var params = [
			this.options.schema.tableName
		];

		this.query(sql, params, function(error) {

			if (error) {
				debug.error('Failed to clear all sessions.');
				debug.error(error);
				return cb && cb(error);
			}

			cb && cb();
		});
	};

	// this is lit
	// they just delete all rows where the expiration time is less  than the current time
	// big brain 
	MySQLStore.prototype.clearExpiredSessions = function(cb) {

		debug.log('Clearing expired sessions');

		var sql = 'DELETE FROM ?? WHERE ?? < ?';

		var params = [
			this.options.schema.tableName,
			this.options.schema.columnNames.expires,
			Math.round(Date.now() / 1000)
		];

		this.query(sql, params, function(error) {

			if (error) {
				debug.error('Failed to clear expired sessions.');
				debug.error(error);
				return cb && cb(error);
			}

			cb && cb();
		});
	};

	// inner query function to bridge gap between this class and the connection.query
	// we can just call normal queries i think
	MySQLStore.prototype.query = function(sql, params, cb) {

		var done = _.once(cb);
		var promise = this.connection.query(sql, params, done);

		if (promise && _.isFunction(promise.then) && _.isFunction(promise.catch)) {
			// Probably a promise.
			promise.then(function(result) {
				var rows = result[0];
				var fields = result[1];
				done(null, rows, fields);
			}).catch(function(error) {
				done(error);
			});
		}
	};

	// initialize the clearinng of expired sessions
	MySQLStore.prototype.setExpirationInterval = function(interval) {

		// if interval is 0 make it the default expiration interval
		interval || (interval = this.options.checkExpirationInterval);

		debug.log('Setting expiration interval to', interval + 'ms');

		this.clearExpirationInterval(); // delete an interval if there is one
		this._expirationInterval = setInterval(this.clearExpiredSessions.bind(this), interval); // create a new interval to call function on, bind to this context
	};

	// just delete the interval if there is one
	MySQLStore.prototype.clearExpirationInterval = function() {

		debug.log('Clearing expiration interval');

		clearInterval(this._expirationInterval);
		this._expirationInterval = null;
	};

	// not listed feature of express-session
	// close the connection pool
	// general clean up
	MySQLStore.prototype.close = function(cb) {

		debug.log('Closing session store');

		this.clearExpirationInterval(); // end the interval

		var done = _.once(cb || _.noop);

		// if we have a connection we were asked to terminate on close
		if (this.connection && this.options.endConnectionOnClose) {
			var promise = this.connection.end(done);
			if (promise && _.isFunction(promise.then) && _.isFunction(promise.catch)) {
				// Probably a promise.
				promise.then(function() {
					done(null);
				}).catch(function(error) {
					done(error);
				});
			}
		} else {
			done(null);
		}
	};

	if (constructorArgs) {
		// For backwards compatibility.
		// Immediately call as a constructor.
		return new (MySQLStore.bind.apply(MySQLStore, [undefined/* context */].concat(constructorArgs)))();
	}

	return MySQLStore;
};