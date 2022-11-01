// Handle the databse stuff on the server side to pull out of the routing logic
const database = require('mysql');
require('dotenv').config();
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
                host: process.env.DB_HOST,
                port: process.env.DB_PORT,
                user: process.env.DB_USER,
                password: process.env.DB_PASS,
                database: process.env.DB_ACTIVE_DB
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
            return cb(this.foodlist);
        }
    
        getCards(pos , maxdist_m, cb){
            // assuming we have pos.lat , pos.long
            var lat1 = pos.lat;
            var lon2 = pos.lon;
            //let in_range = []
                
                var lat2 = this.foodlist[x].travel[0];
                var lon2 = this.foodlist[x].travel[1];
                var miles = getDistance(lat1, lon1, lat2, lon2)
                if(miles <= maxdist_m){
                    in_range.push(x)
                    console.log("in range foodcard added to list")
                }
    
            //return in_range, cb(null);
        }
    
        getCardsVendor(vendor_id, cb){
           /*
            let vendor_cards = [];
            for(x in this.foodlist){
                if(this.foodlist[x].vendor == vendor_id){
                    vendor_cards.push(x);
                }
            }
            return vendor_cards;
            */
            const vendorFood = this.foodlist.filter( item => {item.vendor == vendor_id});
            return vendorFood, cb(null);
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