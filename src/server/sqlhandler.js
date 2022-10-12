// Handle the databse stuff on the server side to pull out of the routing logic

const mysql = require('mysql');
const { object } = require('underscore');



// DBHandler
// Going to be the class handling the sql database
// Want to come up with some reasonable functions to perform these queries
// Inserts look like : INSERT INTO <table_name> ([columns]) VALUES ([vals])
// Selects look like : SELECT [Fields] FROM <table> WHERE <column> = <value> 
// Deletes           : DELETE FROM <table> WHERE <column> = <value>
module.exports = 
    class DBHandler {
        constructor(options){
            // set the connection pool object 
            this.conn = options.pool;

            this.user_table = options.user_table;
            this.email = options.email_col;
            this.pass = options.pass_col;
        }

        /*
            Insertions:
                take in a table name, pass a dict {column: value} for the items to be inserted
                going to need to build the string
        */
       // Insert a new user into the database
       // given an email and passwword
       // The callback is to handle redirection in app.js (and errors)
       // callback should be callback(error)
        insertUser(email, password, callback){
            var sql = "INSERT INTO $ ($, $) VALUES ($$, $$)"; // get the sql code
            var parameters = [
                this.user_table,
                this.email,
                this.pass,
                email,
                password
            ];

            this.conn.query(sql, parameters, (err) => {
                if(err){
                    console.log(`Error inserting user ${email}`);
                    return callback(err);
                }
                console.log(`Successfully created user ${email} with password: ${password}`);
                return callback(null); // no error
            });

        }

        // Get an existing user from the table
        // if the user is found it will return their password
        // if no user is found it will return a null
        // callback will be -> callback(err, result)
        getUser(email, callback){
            var sql = "SELECT * FROM $ WHERE $ = $$";
            var parameters = [
                this.user_table,
                this.email,
                email
            ];

            this.conn.query(sql, parameters, (err, results) => {
                if(err){
                    console.log(`Error finding user ${email}`);
                    return callback(err, null);
                }

                var result = results[0] | null;
                if(!result){
                    return callback(null, null); // no error but no result
                }

                return callback(null, result[this.pass]);
            })
        }

    }