// Handle the databse stuff on the server side to pull out of the routing logic
const database = require('mysql');
const path = require('path');
require('dotenv').config({path: path.resolve(__dirname, "../../../.env")});

TEST_POS = [
    [37.002,-121.9282], //santa cruz
    [38.284,-122.6423], // Santa rosa basically
    [40.253,-111.6409], // Provo utah
    [44.814, 20.4368] // Serbia lmao
]


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
    insertUser(credentials, callback){

        // SQL query
        let SQL = "INSERT INTO ?? (??, ??, ??) VALUES (?, ?, ?)";
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
    getUser(email, callback){

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


const { getDistance } = require('../utility/serverutility.js');
const { getKm } = require('../utility/serverutility.js');
const { getM } = require('../utility/serverutility.js');




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
                    console.log(`Error inserting foodcard ${fooddata.item} - upload card`);
                    return callback(err);
                }
                console.log(`Successfully inserted foodcard ${fooddata.item} with lat,lon: ${fooddata.lat} ${fooddata.lon} and data - uploadcard`);
                return callback(null); // no error
            });
    
        }
            
       
        
    
        getCardsAll(cb){
            
        }
    
        getCardsByRange(pos , maxdist_m, callback){
            // assuming we have pos.lat , pos.long
            let Km = getKm(maxdist_m);
            console.log(Km);
            let rounded_km = Math.round(Km);
            console.log(rounded_km)
            
            let lat_min = pos.lat - (rounded_km * 0.045);
            let lat_max = pos.lat + (rounded_km * 0.045);
            let lon_min = pos.lon - ((rounded_km * 0.045) / Math.cos(pos.lat * Math.PI/180))
            let lon_max = pos.lon + ((rounded_km * 0.045) / Math.cos(pos.lat * Math.PI/180))
            
            let SQL = 'SELECT * FROM ?? WHERE ?? BETWEEN ? AND ? AND ?? BETWEEN ? AND ?'
            var params = [
                this.food_table,
                this.food_Lat,
                lat_min,
                lat_max,
                this.food_Lon,
                lon_min,
                lon_max
            ]

            this.conn.query(SQL, params, (err, results) => {
                if(err){
                    console.log(`Error getiing cards in range - getcardsbyrang`);
                    return callback(err, null);
                }
                console.log(`Successfully returned cards in range - getcardsbyrange`);
                return callback(null, results); // no error
            });
    
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
                    console.log(`Error finding foodcard ${vendor_id} - getCardsVendor`);
                    console.log(err);
                    return callback(err, null);
                }

                
                if(!results){
                    console.log("null result - getCardsVendor ");
                    return callback(null, null); // no error but no result
                }
                console.log("found - getCardsVendor ");
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
                    console.log(`Error deleting foodcard id: ${card_id} - deleteCardsById`);
                    console.log(err);
                    return callback(err, null);
                }
                
                //var result = (results[0]) ? results[0] : null;
                if(!results){
                    console.log("null result - deleteCardsById");
                    return callback(null, null); // no error but no result
                }
                console.log("found - deleteCardsById");
                return callback(null, results);
            });

        }

        reserveCard(id, username, callback){
            //change the card with card.id = id in the database to set its reserved field = username
            //let SQL = 'INSERT INTO ?? (??) SELECT FROM * WHERE ?? = ? VALUES (?)';
            let SQL = 'UPDATE ?? SET ?? = ? WHERE ?? = ?'
            var params = [
                this.food_table,
                this.food_Reserved,
                username,
                this.food_ID,
                id, 
            ]

            this.conn.query(SQL, params, (err, results) => {
                if(err){
                    console.log(`Error reserving foodcard for: ${username},  id: ${id} -  reserveCard`);
                    console.log(err);
                    return callback(err);
                }

                //var result = (results[0]) ? results[0] : null;
                if(!results){
                    console.log("null result -  reserveCard");
                    return callback(null); // no error but no result
                }
                console.log("found -  reserveCard");
                return callback(null);
            });


          }


    }

    module.exports = {
        DBHandler: DBHandler,
        FoodStore: FoodStore
     };


     let food1 = {
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
    let food2 = {
        image : "some string" ,
        vendor : "Breaking Breakfast", 
        favorite : "none",
        cuisine : "Breakfast",
        item : "burritos , eggs, sausage , pancakes, cereal, hashbrowns",
        travel : "",  
        reserved : "",
        lat : 36.974117,
        lon : -122.030792
    }

    let food3 = {
        image : "some string" ,
        vendor : "Wennie hut junior", 
        favorite : "none",
        cuisine : "wennie food",
        item : "Hot dogs , Soda , Ice Cream",
        travel : "",  
        reserved : "",
        lat : 36.684527,
        lon : -122.536815
    }
    
    let sc_pos = {
        lat: 36.910231,
        lon: -121.7568946
    }
    
    
    
    /*
    const store = new FoodStore();
    
    store.uploadCard(food3, (err, res) => {
        if(err){
            console.log("issues upload");
            console.log(err);
        }
        else {
            console.log("working upload")
        }
    });

    let vendor = "Cals burweeedos";
    setTimeout(() => {
        store.getCardsVendor(vendor, (err,res) => {
            if(err){
                console.log("issues get fc by vendor");
                console.log(err);
            }
            else {
                console.log("working get fc by vendor");
                console.log(res);
            }
        })
    }, 1000)

    max_dist = 12;
    setTimeout(() => {
        store.getCardsByRange(sc_pos, max_dist,  (err,res) => {
            if(err){
                console.log("issues Range");
                console.log(err);
            }
            else {
                console.log("working Range");
                console.log(res);
            }
        })
    }, 2000 )
    
    let card_id = 0;
    setTimeout(() => {
        store.deleteCardsById(card_id, (err, res) => {
            if(err){
                console.log("issues delete");
                console.log(err);
            }
            else {
                console.log("working delete");
                //console.log(res);
            }
        })
    }, 3000)
    
    let res_id = 18; 
    let res_user = "hungry guy";
    setTimeout(() => {
        store.reserveCard(res_id, res_user, (err, res) => {
            if(err){
                console.log("issues reserve");
                console.log(err);
            }
            else {
                console.log("working reserve");
                //console.log(res);
            }
        })
    }, 3000)
    */