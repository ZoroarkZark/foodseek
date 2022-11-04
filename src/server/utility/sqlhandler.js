// Handle the databse stuff on the server side to pull out of the routing logic
const database = require('mysql');
require('dotenv').config({path: __dirname +'../../.env'});

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

    getCardsById(id, callback){
        let SQL = 'SELECT FROM ?? where ?? = ?';
        let params = [
            this.table,
            this.col.id,
            id
        ];

        this.conn.query(SQL, params, (err, results) => {

        });
    }

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
            return callback(null, results);
        });

    }

    reserveCard(id, username, callback){
        //change the card with card.id = id in the database to set its reserved field = username
        // You were using a Insert here but we want to use Update
        let SQL = 'UPDATE ?? SET ?? = ? WHERE ?? = ?';
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

            var result = (results[0]) ? results[0] : null;
            if(!result){
                return callback(null, null); // no error but no result
            }
            return callback(null, result);
        });


      }


}


const US = new UserStore();
const FS = new FoodStore();

module.exports = {
    UserStore: US,
    FoodStore: FS
}
