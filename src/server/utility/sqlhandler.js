// Handle the databse stuff on the server side to pull out of the routing logic
const database = require('mysql');
const path = require('path');
require('dotenv').config({path: path.resolve(__dirname, "../../../.env")});

const sutil = require('../utility/serverutility.js');

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

       this.table = "food_cards"
       this.col = {
        id: "id",
        lat: "lat",
        lon: "lon",
        data: "data",
        res: "res",
        vendor: "vendor"
       }

    }

    // changed the fields we are storing in the data object
    // removed favorite and travel bc those are meaningless
    // changing the object to have a field "pos" = [lat, long]
    
    //dev feature to uplaod a card easier
    uploadItem(item,vendor, callback){
        // random pos from list
        let rind = Math.round((Math.random()*100)) % TEST_POS.length;
        let pos = TEST_POS[rind];
        console.log(`uploaded card: lat ${pos[0]}, lon ${pos[1]}`);

        // meta data
        let data = JSON.stringify({
            image: "test",
            cuisine: "test",
            item: item,
            tags: "test"
        });

        
        let SQL = "INSERT INTO ?? (??, ??, ??, ??) VALUES (?, ?, ?, ?)";
        let params = [
            this.table,
            this.col.lat,
            this.col.lon,
            this.col.data,
            this.col.vendor,
            pos[0],
            pos[1],
            data,
            vendor
        ];

        this.conn.query(SQL,params, (err) => {
            if(err) {
                return callback(err);
            }

            return callback(null);
        });




    }

    // upload whole card
    uploadCard(fooddata, callback){
        let SQL = "INSERT INTO ?? (?? , ?? , ??, ?? ) VALUES (?, ?, ?, ?)";
        let data = JSON.stringify({
            image : fooddata.image,
            cuisine : fooddata.cuisine,
            item : fooddata.item,
        })
        var params = [
            this.table,
            //this.food_ID,
            this.col.lat,
            this.col.lon,
            this.col.data,
            this.col.vendor,
            //fooddata.id,
            fooddata.pos[0],
            fooddata.pos[1],
            data, 
            fooddata.vendor,
        ]
        
        this.conn.query(SQL, params, (err) => {
            if(err){
                return callback(err);
            }
            return callback(null); // no error
        });

    }
        
   
    
    // return all cards
    getCardsAll(callback){
        let SQL = "SELECT * FROM ??";
        let params = [this.table];

        this.conn.query(SQL,params, (err, results) => {
            if(err){
                return callback(err,null);
            }

            return callback(null, results);
        })
    }

    // get all cards maxdist_m from pos
    getCardsByRange(pos , maxdist_m, callback){
            let Km = sutil.getKm(maxdist_m);
            console.log(Km);
            let rounded_km = Math.round(Km);
            console.log(rounded_km)
            
            let lat_min = pos.lat - (rounded_km * 0.045);
            let lat_max = pos.lat + (rounded_km * 0.045);
            let lon_min = pos.lon - ((rounded_km * 0.045) / Math.cos(pos.lat * Math.PI/180))
            let lon_max = pos.lon + ((rounded_km * 0.045) / Math.cos(pos.lat * Math.PI/180))
            
            let SQL = 'SELECT * FROM ?? WHERE ?? BETWEEN ? AND ? AND ?? BETWEEN ? AND ?'
            var params = [
                this.table,
                this.col.lat,
                lat_min,
                lat_max,
                this.col.lon,
                lon_min,
                lon_max
            ]

            this.conn.query(SQL, params, (err, results) => {
                if(err){
                    console.log(`Error getiing cards in range - getcardsbyrang`);
                    return callback(err, null);
                }
                console.log(`Successfully returned cards in range - getcardsbyrange`);
                if(!results){
                    // no cards in given range
                    return callback(null,null);
                }

                return callback(null, results); // no error and results 
            });
        
       
    }

    // return all cards uploaded by a vendor
    getCardsVendor(vendor_id, callback){
        let SQL = 'SELECT * FROM ?? WHERE ?? = ?'
        let params = [
            this.table,
            this.col.vendor,
            vendor_id
        ]

        this.conn.query(SQL, params, (err, results) => {
            if(err){
                return callback(err, null);
            }

            
            if(!results){
                return callback(null, null); // no error but no result
            }
            return callback(null, results);
        });

    }

    // return reserved cards for a vendor (so vendors can see if their cards have been reserved by users)
    getVendorReserved(vendor_id, callback){
        let SQL = "SELECT * FROM  ?? WHERE ?? = ? AND ?? IS NOT NULL";
        let params = [
            this.table,
            this.col.vendor = vendor_id,
            this.col.res
        ]

        this.conn.query(SQL, params, (err, results) => {
            if(err){
                return callback(err, null);
            }
            if(!results){
                return callback(null,null);
            }

            return callback(null,results);
        })
    }

    //return the card the user has
    getUserReserved(user_id, callback){
        let SQL = "SELECT * FROM ?? WHERE ?? = ?";
        let params = [
            this.table,
            this.col.res,
            user_id
        ]

        this.conn.query(SQL, params ,(err, results) => {
            if(err) return callback(err,null);
            if(!results) return callback(null,null);
            return callback(null, results); // we should only get one here so we might want to check that somewhere.
        });
    }

    // delete card by id 
    deleteCardsById(card_id, callback){
        let SQL = 'DELETE FROM ?? where ?? = ?';
        let params = [
            this.table,
            this.col.id,
            card_id
        ]
        this.conn.query(SQL, params, (err, results) => {
            if(err){
                return callback(err, null);
            }
            
            if(!results){
                return callback(null, null); // no error but no result
            }
            return callback(null, results.affectedRows);
        });

    }

    // reserve card by id and upload user email into reserved field
    reserveCard(id, username, callback){
        //change the card with card.id = id in the database to set its reserved field = username
        // You were using a Insert here but we want to use Update
        let SQL = 'UPDATE ?? SET ?? = ? WHERE ?? = ? AND ?? IS NULL';
        let params = [
            this.table,
            this.col.res,
            username,
            this.col.id,
            id,
            this.col.res,
            ""
        ];

        this.conn.query(SQL, params, (err, results) => {
            if(err){
                return callback(err, null);
            }

            if(!results){
                return callback(null,null);
            }
            return callback(null, results.affectedRows);
        });


    }

    // remove the user from the card
    cancelReservation(username, callback){
        let SQL = "UPDATE ?? SET ?? = ? WHERE ?? = ?";
        let params = [
            this.table,
            this.col.res,
            null,
            this.col.res,
            username
        ]

        this.conn.query(SQL,params, (err, results) => {
            if(err){
                return callback(err,null);
            }

            return callback(null, results);
        })

    }


}


const US = new UserStore();
const FS = new FoodStore();

module.exports = {
    UserStore: US,
    FoodStore: FS
}

