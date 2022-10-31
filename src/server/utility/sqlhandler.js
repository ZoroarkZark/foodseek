// Handle the databse stuff on the server side to pull out of the routing logic
const database = require('mysql');
require('dotenv').config();


// Refactored from the DBHandler class
// Cleaned up some of the functions
// Added a deleteUser in case some one wants to remove their acc
class UserStore {
    constructor(){

        // Create Connection Pool
        this.conn = database.createPool( {
            connectionLimit: 10,
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_ACTIVE_DB
        });

        // Define table and column names
        this.table = "user_data";
        this.col = {
            email: "user_email",
            pass: "password",
            vend: "vendor",
            data: "Data"
        };
    }

    // pass credentials with keys [email, pass, vendor]
    createUser(credentials, callback){

        // SQL query
        let SQL = "INSERT INTO ?? (?? ?? ??) VALUES (? ? ?)";
        let parameters = [
            this.table,
            this.col.email,
            this.col.pass,
            this.col.vend,
            credentials.email,
            credentials.pass,
            credentials.vendor
        ]

        // query the database
        this.conn.query(SQL, parameters, (err) => {
            if(err){
                return callback(err); // we have an error return it to the callback
            }

            return callback(null); // no error 
        })
    }

    //pass credentials [email] to find a user with that associated email
    findUser(email, callback){

        //SQL query
        let SQL = "SELECT * FROM ?? WHERE ?? = ?";
        let parameters = [
            this.table,
            this.col.email,
            email
        ];

        this.conn.query(SQL, parameters, (err, results) => {
            if(err){
                return callback(err, null);
            }

            let result = (results[0]) ? results[0] : null; //if we have the one result return the one result
            if(!result){
                return callback(null, null); // no error but no result
            }
            return callback(null, result);
        });
    }

    deleteUser(email, callback){
        let SQL = "DELETE FROM ?? WHERE ?? = ?";
        let parameters = [
            this.table,
            this.col.email,
            email
        ];

        this.conn.query(SQL,parameters, (err,results) => {
            if(err){
                return callback(err,null); // could not delete
            }
            return callback(null,results.affectedRows); // return no error and the # of deleted rows should == 1
        });
    }


}


module.exports = {
    UserStore: UserStore
}