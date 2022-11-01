// Handle the databse stuff on the server side to pull out of the routing logic
const database = require('mysql');
require('dotenv').config();

const { getDistance } = require('../utility/serverutility.js');
const { getKm } = require('../utility/serverutility.js');
const { getM } = require('../utility/serverutility.js');


// DBHandler
// Going to be the class handling the sql database
// Want to come up with some reasonable functions to perform these queries
// Inserts look like : INSERT INTO <table_name> ([columns]) VALUES ([vals])
// Selects look like : SELECT [Fields] FROM <table> WHERE <column> = <value> 
// Deletes           : DELETE FROM <table> WHERE <column> = <value>

    class DBHandler {
        constructor(options){
            // set the connection pool object 
            this.conn = database.createPool({
                connectionLimit: 10,
                host: process.env.DB_HOST,
                port: process.env.DB_PORT,
                user: process.env.DB_USER,
                password: process.env.DB_PASS,
                database: process.env.DB_ACTIVE_DB
            });
            

            this.user_table = "user_data"
            this.email = "user_email";
            this.pass = "password";
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
            var sql = "INSERT INTO ?? (??, ??) VALUES (?, ?)"; // get the sql code
            var parameters = [
                this.user_table,
                this.email,
                this.pass,
                email,
                password
            ];
            
            this.conn.query(sql, parameters, (err) => {
                if(err){
                    console.log(`Error inserting user ${email} - sqlhandler`);
                    return callback(err);
                }
                console.log(`Successfully created user ${email} with password: ${password} - sqlhandler`);
                return callback(null); // no error
            });

        }

        // Get an existing user from the table
        // if the user is found it will return their password
        // if no user is found it will return a null
        // callback will be -> callback(err, result)
        getUser(email, callback){
            var sql = "SELECT * FROM ?? WHERE ?? = ?";
            var parameters = [
                this.user_table,
                this.email,
                email
            ];

            this.conn.query(sql, parameters, (err, results) => {
                if(err){
                    console.log(`Error finding user ${email} - sqlhandler`);
                    console.log(err);
                    return callback(err, null);
                }

                var result = (results[0]) ? results[0] : null;
                if(!result){
                    console.log("null result - sqlhandler");
                    return callback(null, null); // no error but no result
                }
                console.log("found - sqlhandler");
                return callback(null, result[this.pass]);
            });
        }

    }


    class FoodStore {
        constructor(options) {
            this.conn = database.createPool({
                connectionLimit: 10,
                host: "localhost",
                port: 3306,
                user: "newuser",
                password: "AiroldI.1998",
                database: "foodseek"
           });
           this.food_table = "food_cards";
           this.food_ID = "ID";
           this.food_Lat = "Lat";
           this.food_Lon = "Lon";
           this.food_Data = "Data";
           this.food_Reserved = "Reserved";
           this.food_vendor = "Vendor"
    
        }
        
        uploadCard(fooddata, callback){
            let SQL = "INSERT INTO ?? (?? , ?? , ??, ?? ) VALUES (?, ?, ?, ?)";
            let data = JSON.stringify({
                image : fooddata.image,
                favorite : fooddata.favorite,
                cuisine : fooddata.cuisine,
                item : fooddata.item,
                travel : fooddata.travel
            })
            var params = [
                this.food_table,
                //this.food_ID,
                this.food_Lat,
                this.food_Lon,
                this.food_Data,
                this.food_vendor,
                //fooddata.id,
                fooddata.lat,
                fooddata.lon,
                data, 
                fooddata.vendor,
            ]
            
            this.conn.query(SQL, params, (err) => {
                if(err){
                    console.log(`Error inserting foodcard ${fooddata.item} - sqlhandler`);
                    return callback(err);
                }
                console.log(`Successfully inserted foodcard ${fooddata.item} with lat,lon: ${fooddata.lat} ${fooddata.lon} and data - sqlhandler`);
                return callback(null); // no error
            });
    
        }
            
       
        
    
        getCardsAll(cb){
            
        }
    
        getCardsByRange(pos , maxdist_m, cb){
            // assuming we have pos.lat , pos.long
            let Km = getKm(maxdist_m);
            console.log(km);
            let rounded_km = Math.round(Km);
            console.log(rounded_km)
            
            lat_min = pos.lat - (rounded_km * 0.045);
            lat_max = pos.lat + (rounded_km * 0.045);
            lon_min = pos.lon - ((rounded_km * 0.045) / Math.cos(pos.lat * Math.PI/180))
            lon_max = pos.lon + ((rounded_km * 0.045) / Math.cos(pos.lat * Math.PI/180))
            
           
        }
    
        getCardsVendor(vendor_id, callback){
            let SQL = 'SELECT * FROM ?? WHERE ?? = ?'
            var params = [
                this.food_table,
                this.food_vendor,
                vendor_id
            ]

            this.conn.query(SQL, params, (err, results) => {
                if(err){
                    console.log(`Error finding foodcard ${vendor_id} - sqlhandler`);
                    console.log(err);
                    return callback(err, null);
                }

                var result = (results[0]) ? results[0] : null;
                if(!result){
                    console.log("null result - sqlhandler (foodcard)");
                    return callback(null, null); // no error but no result
                }
                console.log("found - sqlhandler (foodcard)");
                return callback(null, results);
            });

        }

        deleteCardsById(card_id, callback){
            let SQL = 'DELETE FROM ?? where ?? = ?';
            var params = [
                this.food_table,
                this.food_ID,
                card_id
            ]
            this.conn.query(SQL, params, (err, results) => {
                if(err){
                    console.log(`Error deleting foodcard id: ${card_id} - sqlhandler`);
                    console.log(err);
                    return callback(err, null);
                }
                
                var result = (results[0]) ? results[0] : null;
                if(!result){
                    console.log("null result - sqlhandler (foodcard)");
                    return callback(null, null); // no error but no result
                }
                console.log("found - sqlhandler (foodcard)");
                return callback(null, results);
            });

        }

        reserveCard(id, username, callback){
            //change the card with card.id = id in the database to set its reserved field = username
            let SQL = 'INSERT INTO ?? SELECT * FROM WHERE ?? = ? (??) VALUES (?)';
            var params = [
                this.food_table,
                this.food_ID,
                this.food_Reserved,
                id, 
                username,
            ]

            this.conn.query(SQL, params, (err, results) => {
                if(err){
                    console.log(`Error reserving foodcard for: ${username},  id: ${id} - sqlhandler`);
                    console.log(err);
                    return callback(err, null);
                }

                var result = (results[0]) ? results[0] : null;
                if(!result){
                    console.log("null result - sqlhandler (foodcard)");
                    return callback(null, null); // no error but no result
                }
                console.log("found - sqlhandler (foodcard)");
                return callback(null, results);
            });


          }


    }

    module.exports = {
        DBHandler: DBHandler,
        FoodStore: FoodStore
     };


     let food = {
        image : "some string" ,
        vendor : "Cals burweeedos", 
        favorite : "none",
        cuisine : "DANK",
        item : "Burritos, Tacos",
        travel : "",  
        reserved : "",
        lat : 36.974117,
        lon : -122.030792
    }
    
    let sc_pos = {
        lat: 36.910231,
        lon: -121.7568946
    }
    
    
    
    
    const store = new FoodStore();
    
    store.uploadCard(food, (err, res) => {
        if(err){
            console.log("issues");
            console.log(err);
        }
        else {
            console.log("working")
        }
    });

    let vendor = "Cals burweeedos";
    store.getCardsVendor(vendor, (err,res) => {
        if(err){
            console.log("issues");
            console.log(err);
        }
        else {
            console.log("working");
            console.log(res);
        }
    })

    let card_id = 6;
    store.deleteCardsById(card_id, (err,res) => {
        if(err){
            console.log("issues");
            console.log(err);
        }
        else {
            console.log("working");
            console.log(res);
        }
    })