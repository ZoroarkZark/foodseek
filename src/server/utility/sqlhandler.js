// Handle the databse stuff on the server side to pull out of the routing logic
const { time } = require('console');
const database = require('mysql');
const path = require('path');
const { TLSSocket } = require('tls');
require('dotenv').config({path: path.resolve(__dirname, "../../../.env")}); // fix dot env path

const sutil = require('../utility/serverutility.js');

const MINUTES_IN_MILI = 1000 * 60;

// Some random test postions 
TEST_POS = [
    [37.002,-121.9282], //santa cruz
    [38.284,-122.6423], // Santa rosa basically
    [40.253,-111.6409], // Provo utah
    [44.814, 20.4368] // Serbia lmao
]


/********************************************
 *  User Store
 *  @class Handles mySQL queries and information
 *  @methods :
 *    - insertUser(credentials, callback)
 *    - getUser(email, callback)
 *    - deleteUser(email, callback)
 *    - updatePassword(email,old_pass,new_pass)
 *    - setValid()
 *    - setForgotCode(email, code, callback)
 *    - getForgotCode(code, callback)
 *    - setTempPassword(email, callback)
*********************************************/

class UserStore {

    /**
     * @constructor
     *  Main constructor for the class. Establishes a connection to the database and configures structure of database
     */
    constructor(){
        
        // Create Connection Pool for mySQL
        this.conn = database.createPool( {
            connectionLimit: 10,
            host: process.env.DB_HOST,
            port: process.env.DB_PORT,
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_ACTIVE_DB
        });
        
        // Define table and column names
        // Change this if defining different or new columns in the table. 
        this.table = "user_data";
        this.col = {
            email: "user_email",
            pass: "password",
            vend: "vendor",
            data: "Data",
            travel: "travel",
            valid: "valid",
            code: "code",
            exp: "codeExpire",
            push: "PushToken",
            avatar: "Avatar"
        };
    }
    
    /**
     * Given some input credentials insert a new user into the database 
     *  
     * 
     *  @param {{email:string,pass:string,vendor:int}} credentials : { "email" : `string`, "pass"  : `string`, "vendor": `int`}"
     * 
     *  @param {Function} callback : `(err)` => {} function to handle error from quiery
     * 
     *  @returns {Function} `callback(err)` : where `err` == a mySQL error if one occured, or `null` if no errors
     *  @example 
     *  let credentials = {"email":"scubasteve","pass":"123","vendor":1};
     *  UserStore.insertUser(credentials, (err) => {
     *      if(err) { throw err }
     *      // successful insertion
     *      console.log(`Inserted user ${credentials.email} into the database`)
     *  });
     */
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
                if(err.code === "ER_DUP_ENTRY"){
                    return callback(6); // duplicate entry code 
                }
                return callback(err); // we have an error return it to the callback
            }
            
            return callback(null); // no error 
        })
    }
    
    /**
     * Lookup a user, and get their information based on an email.
     * @param {string} email : Email to lookup user with
     * @param {Function} callback : function to handle errors and result
     * 
     * @returns {Function} `callback(err,result)` 
     * 
     * @example 
     * let email = 'scubasteve';
     * UserStore.getUser(email, (err, result) => {
     *  if(err) throw err;
     *  // found a user with the passed email
     *  console.log(`Found User ${email}`);
     *  // password can be found at result["password"]
     *  // other important fields : "vendor": user vendor status, "Data" :object that contains user meta data,  
     * });
     */
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

    
    /**
     * Delete a user from the database given an email.
     * @param {string} email : Email of user we want to remove from database.
     * @param {Function} callback : `(err,result)` =< {} function to handle errors and if a user was deleted
     * 
     * @returns {Function} `callback(err, result)` : where `err` is a mySQL error if one occured, or `null` if no errors, and result
     * 
     * @example 
     * let email = "scubasteve";
     * UserStore.deleteUser( email, (err, result) => {
     *  if(err) throw err;
     *  // no errors encountered
     *  console.log(`deleted ${result} accounts with name ${email}`);
     * })
     */
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

    /**
     * Add or update a ExpoPushToken for a user associated with `email` with the arg `token`
     * @param {string} email : email for user we want to store notifcations for
     * @param {string} token : Expo token we generated on the front end
     * @param {function} callback : handle error from update
     * 
     * @returns {function} callback(err,updatedBool)
     * 
     * @example
     * let token = "CoolEXPOTOKEN99";
     * let user  = "cal";
     * UserStore.updatePushToken(user,token, (err) => {
     *  if(err){ throw err;}
     *  console.log(`Registered ${user} for push notifications`);
     * })
     */
    updatePushToken(email, token, callback){
        this.setUserfield(email, "push", token, (err,result) => {
            if(err){
                console.log(`Trouble updating push token for ${email}`);
                return callback(err,null);
            }
            if(!result){
                console.log(`Nothing updated for ${email}`);
                return callback(err, false);
            }

            console.log(`Updated ${email}'s push token to ${token}`);
            return callback(err, true);

        });
    }
    
    /**
     * Get the stored push token for the user
     * @param {string} email : email to get push token for 
     * @param {function} callback : function to handle result
     * 
     * @returns {function} callback(err,token)
     */
    getPushToken(email, callback){
        this.getUserfield(email,"push", (err, result) => {
            if(err) { return callback(err,null)}
            //console.log(result);
            if(result.length > 0){
                return callback(null,result[0][this.col.push]);
            }
            else{
                return callback(null,null);
            }
        });
    }

    
    /**
     * Update a password for a given user given an email, old password, and desired new password
     * @param {string} email : email for account being updated
     * @param {string} old_pass : old password for the account
     * @param {string} new_pass : new password for the account
     * @param {function} callback : callback function to handle err and results
     * @returns {function} `callback(err,results)` : where `err` is a mySQL error if any, and `results` is the number of updated passwords (should be 1)
     * 
     * @example
     * let updateAcc = {"email":"scubasteve", "old_pass":"myOldPassword", "new_pass":"myNewPassword"}
     * UserStore.updatePassword(updateAcc.email,updateAcc.old_pass,updateAcc.new_pass, (err, result) => {
     *  if(err) throw err;
     *  if(result){
     *      console.log(`Updated ${updateAcc.email}s password to ${updateAcc.new_pass}`); 
     *  }
     *  
     *  console.log(`No error encountered but did not change database information`);
     * })
     */
    updatePassword(email, old_pass, new_pass, callback){
        let SQL = 'UPDATE ?? SET ?? = ? WHERE ?? = ? AND ?? = ?'
        var params = [
            this.table,
            this.col.pass,
            new_pass,
            this.col.email,
            email,
            this.col.pass,
            old_pass
        ];
        
        this.conn.query(SQL, params, (err, results) => {
            if(err){
                console.log(`Error updating pass for: ${email} - setPassword`);
                console.log(err);
                return callback(err, null);
            }
            
            if(!results){
                console.log("null result - setPassword");
                return callback(null,null); // no error but no result
            }
            console.log("password updated - setPassword");
            return callback(null, results.affectedRows);
        });
    }
    
    /**
     * Set a email as validated
     * @param {string} email : email we are setting validation for
     * @param {Function} callback : function to handle error and results
     * @returns {Function} `callback(err,result)` : where `err` is the mySQL error if any, and `result` is the number of codes placed in the db (should be 1)
     * 
     * @example
     * let email = "scubasteve";
     * UserStore.setValid(email, (err, result) => {
     *  if(err) throw err;
     *  if(result) return console.log(`Validated ${email}`);
     * 
     *  console.log(`No rows affected by change`);
     * })
     */
    setValid(email, callback){
        this.setUserfield(email, "valid", 1, (err, result) => {
            if(err) return callback(err, null);
            return callback(null, result);
        })
    }
    
    /**
     * Set a forgot password code
     * @param {string} email : email to set the code for
     * @param {string} code : code for comparison later
     * @param {Function} callback : function to handle errors and results
     * 
     * @returns {Function} `callback(err,result)` : where `err` is the mySQL error if any, and `result`is the number of affected rows (should be 1 on success)\
     * 
     * @example
     * let fgPass = {email:"scubasteve", code:"AR91023ZX"}
     * UserStore.setForgotCode(fgPass.email,fgPass.code, (err,result) => {
     *  if(err) throw err;
     *  if(result) return console.log(`Set forgot pass code in database for user ${fgPass.email}`)
     *  console.log(`No rows updated by change`);
     * })
     */
    setForgotCode(email, code, callback){
        let SQL = 'UPDATE ?? SET ?? NOW() + INTERVAL 15 MINUTE, ?? = ? WHERE ?? = ?';
        var params = [
            this.table,
            this.col.exp,
            this.col.code,
            code,
            this.col.email,
            email,
        ];
        
        this.conn.query(SQL, params, (err, results) => {
            if(err){
                console.log(`Error settign code for: ${email} - setForgotCode`);
                console.log(err);
                return callback(err, null);
            }
            
            //var result = (results[0]) ? results[0] : null;
            if(!results){
                console.log("null result - setForgotCode");
                return callback(null,null); // no error but no result
            }
            console.log("code set - setForgotCode");
            return callback(null, results.affectedRows);
        });
    }
    
    /**
     * Check if a given code is in the database.
     * @param {string} code : code to look for in the database
     * @param {Function} callback : function to handle the error or results
     * 
     * @returns {Function} `callback(err,result)` : where `err` is a mySQL error if any, and `result` is the forgot pass code set in the database
     * 
     * @example
     * let code = "AR91023ZX";
     * let email = "scubasteve"
     * UserStore.getForgotCode(code, (err, results) => {
     *  if(err) throw err;
     *  if(results){
     *      if(results.user_email === email){
     *          console.log(`Valid forgot passcode for ${email}`);
     *          return;
     *      }
     *  }
     * });
     */
    getForgotCode(code, callback){
        
        //SQL query
        let SQL = "SELECT ?? FROM ?? WHERE ?? = ?";
        let parameters = [
            this.col.code,
            this.table,
            this.col.code,
            code
        ];
        
        this.conn.query(SQL, parameters, (err, results) => {
            if(err){
                return callback(err, null);
            }
            
            
            
            if(!results){
                return callback(null, null); // no error but no result
            }
            return callback(null, results[0]);
        });
    }

    /**
     * Set a temporary password for a user
     * @param {string} email : email we are setting a temp password for 
     * @param {Function} callback : function to handle error and results
     * 
     * @returns {Function} `callback(err,temp_password)` : where `err` is a mySQL error if any occur, and `temp_password` is the newly generated tempoarary password for the user at `email`
     * 
     * @example
     * let email = "scubasteve";
     * UserStore.setTempPassword(email, (err, new_pass) => {
     *  if(err) throw err;
     *  
     *  console.log(`Set new temp pass for user ${email} as ${new_pass}`);
     * })
     * 
     */
    setTempPassword(email, callback){
        //generated pass
        let randPass = sutil.genToken(12);
        sutil.bHash(randPass, (err, hash) => { // hash to make login work with de-hash
            if(err){ // error hashing password 
                return callback(err,null); // bcrypt error
            }

            this.setUserfield(email, "pass", randPass, (err, result) => {
                if(err) return callback(err, null);
                return callback(null, result);
            })
           
        })
    }

    // update user information
    updateUserData(email, data,callback){
        this.getUser(email, (err, results) => {
            if(err) return callback(err,null);
            if(!results) return callback(new Error("No user found or something"), null);

            let current = JSON.parse(results[this.col.data]); // parse what ever we have stored
            let updated = updateObject(data,current);

            let updatedString = JSON.stringify(updated);

            let SQL = "UPDATE ?? SET ?? = ? WHERE ?? = ?";
            let params = [
                this.table,
                this.col.data,
                updatedString,
                this.col.email,
                email,
            ]

            this.conn.query(SQL,params, (err, results) => {
                if(err) return callback(err, null);

                return callback(null,updated)
            })
        })
    }

    //set a avatar in the bucket
    setAvatar(email, avatar, callback){
        this.setUserfield(email, "avatar", avatar, (err, result) => {
            return callback(err, result);
        })
    }


    //General set field
    //General get field

    // update a single field 
    /**
     * Set the field for a user in the database given an email, key, value, and callback
     * @param {string} email : user we are updating
     * @param {string} key   : key of field we are changing
     * @param {*} value      : value we want to set that field to
     * @param {function} callback  : handle errors and status
     * @returns 
     */
    setUserfield(email, key, value, callback){
        if(!sutil.validate([key],this.col)){
            return callback(new Error("This field is not present within the database, consider checking the UserStore class"), null);
        }

        let SQL = "UPDATE ?? SET ?? = ? WHERE ?? = ?";
        let params = [
            this.table,
            this.col[key],
            value,
            this.col.email,
            email
        ]

        this.conn.query(SQL, params, (err, result) => {
            if(err){
                return callback(err, null)
            }

            return callback(null, result);
        })
    }

    /**
     * Get a field for a given user providing a key
     * @param {string} email : email for the user we want data from
     * @param {string} key : key of the column we want data from 
     * @param {function} callback : handle the results
     * @returns 
     */
    getUserfield(email, key, callback){
        if(!sutil.validate([key],this.col)){
            return callback(new Error("This field is not present within the database, consider checking the UserStore class"), null);
        }

        let SQL = "SELECT ?? FROM ?? WHERE ?? = ?";
        let params = [
            this.col[key],
            this.table,
            this.col.email,
            email
        ]

        this.conn.query(SQL, params, (err,results) => {
            if(err){
                return callback(err,null)
            }

            return callback(null,results);
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
            vendor: "vendor",
            img_url: "img_url",
            timestamp: "timestamp"
        }
        this.startClear();
        
    }
    
    // changed the fields we are storing in the data object
    // removed favorite and travel bc those are meaningless
    // changing the object to have a field "pos" = [lat, long]
    
    //dev feature to uplaod a card easier
    /**
     * Development Method to easily upload a card just by item name
     * @param {string} item : name for item
     * @param {string} vendor : name for vendor 
     * @param {function} callback 
     * 
     * @returns {function} callback(err) or callback(null) if no error
     */
    uploadItem(item,vendor, callback){
        // random pos from list
        let rind = Math.round((Math.random()*100)) % TEST_POS.length;
        let pos = TEST_POS[rind];
        console.log(`uploaded card: lat ${pos[0]}, lon ${pos[1]}`);
        
        // meta data
        let data = {
            cuisine: "test",
            item: item,
            tags: "test"
        };
        
        
        let SQL = "INSERT INTO ?? (??, ??, ??, ??) VALUES (?, ?, ?, ?)";
        let params = [
            this.table,
            this.col.lat,
            this.col.lon,
            this.col.data,
            this.col.vendor,
            pos[0],
            pos[1],
            JSON.stringify(data),
            vendor
        ];
        
        this.conn.query(SQL,params, (err) => {
            if(err) {
                return callback(err);
            }
            
            return callback(null);
        });
        
        
        
        
    }
    
    /**
     * The real upload function. Needs a pack to upload the item by
     * @param {*} pack : represents the item we are uploading, required fields `tags`, `item`, `loc`, `vendor`, `img_url`, and `timestamp` 
     * @param {*} callback 
     * @returns {*} callback(err) if failure, callback(null) if no error
     */
    uploadMore(pack, callback){
        //console.log(pack);
        
        //Handle getting a timestamp as a date, or just the hour 

        console.log(pack.timestamp);
        let timeData = new Date(pack.timestamp);
        timeData = timeData.getTime() / MINUTES_IN_MILI;

        let SQL = "INSERT INTO ?? (??, ??, ??, ??, ??, ??) VALUES (?, ?, ?, ?, ?,?)";
        let data = {
            cuisine: "default",
            item: pack.item,
            tags: pack.tags
        }

        if(!pack || !pack.loc || !pack.loc[0] || !pack.loc[1]){
            return callback(new Error("Location was not an array"),null);
        }

        let params = [
            this.table,
            this.col.lat,
            this.col.lon,
            this.col.data,
            this.col.vendor,
            this.col.img_url,
            this.col.timestamp,
            pack.loc[0],
            pack.loc[1],
            JSON.stringify(data),
            pack.vendor,
            pack.img_url,
            timeData
        ];

        this.conn.query(SQL, params, (err) => {
            if(err) return callback(err);

            return callback(null);
        });
    }


    /**
     * Edit a given cards timestamp
     * @param {int} id : id for the card
     * @param {int} timestamp : hour that the item should be expired
     * @param {Function} callback 
     */
    editCardTimestamp(id, timestamp, callback){
        // Currently supported updates
        // data
        // timestamp

        if(typeof timestamp === "number"){
            timestamp = timestamp % 24; // get timestamp between 0 and 24
        }
        if(typeof timestamp === "string"){
            let date = new Date(timestamp);
            timestamp = date.getHours();
        }
        let SQL = "UPDATE ?? SET ?? = ? WHERE ?? = ?";
        let params = [
            this.table,
            this.col.timestamp,
            timestamp,
            this.col.id,
            id
        ]

        this.conn.query(SQL,params, (err, result) => {
            if(err) return callback(err, null);
            if(result){
                return callback(null, result.affectedRows);
            }

            return callback(null)
        })
        
    }

    /**
     * Edit a given cards data fields
     * @param {*} id : id for the card
     * @param {*} in_data : an object containing some or all of the fields in the data object
     * @param {*} callback 
     */
    editCardData(id, in_data, callback){
        // get the card data we want to modify
        this.getCard(id, (err, result) => {
            if(err){
                return callback(err, null); // error getting a current cards data
            }
            let old_data = JSON.parse(result[this.col.data]);
            console.log('Updating: ', old_data);
            let new_data = updateObject(in_data,old_data);
            console.log('To:', new_data);


            let SQL = "UPDATE ?? SET ?? = ? WHERE ?? = ?";
            let params = [
                this.table,
                this.col.data,
                JSON.stringify(new_data),
                this.col.id,
                id
            ]

            this.conn.query(SQL,params, (err,result) => {
                if(err) return callback(err, null);

                if(result){
                    return callback(null,result.affectedRows);
                }
            })
        })
    }


    /**
     * Get card data based on a cards id
     * @param {number} id : integer id for the card 
     * @param {function} callback
     * 
     * @returns {function} callback(err, null) if error, callback(null, results) on results
     */
    getCard(id, callback){
        let SQL = "SELECT * FROM ?? WHERE ?? = ?"
        let params = [
            this.table,
            this.col.id,
            id
        ]

        this.conn.query(SQL,params, (err, results) => {
            if(err) return callback(err,null);

            if(results.length > 0){
                let data = results[0];
                return callback(null, data);
            }
            else{
                return callback(null,null);
            }
        })
    }
    // 
    /**
     * Depreciated development function
     * @param {*} fooddata : represents card we are uploading 
     * @param {*} callback 
     * @returns {function} : callback(err) on error and callback(null) on no error
     */
    uploadCard(fooddata, callback){
        let SQL = "INSERT INTO ?? (?? , ?? , ??, ?? ) VALUES (?, ?, ?, ?)";
        let data = {
            image : fooddata.image,
            cuisine : fooddata.cuisine,
            item : fooddata.item,
        }
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
            JSON.stringify(data), 
            fooddata.vendor,
        ]
        
        this.conn.query(SQL, params, (err) => {
            if(err){
                return callback(err);
            }
            return callback(null); // no error
        });
        
    }
    
    
    
    /**
     * Return all cards currently stored on the database
     * @param {function} callback 
     * 
     * @returns {function} callback(err, null) on error, and callback(null, results) on no error
     * 
     * @example for a route that gets all cards
     * app.get('/getAllCards' ,(req,res,next) => {
     *  FoodStore.getCardsAll( (err, results) => {
     *    if(err) return next(err);
     *    res.end(JSON.stringify({cards: results}));
     *   })
     * })
     */
    getCardsAll(callback){
        let SQL = "SELECT * FROM ?? WHERE ?? IS NULL";
        let params = [
            this.table,
            this.col.res,
        ];
        
        this.conn.query(SQL,params, (err, results) => {
            if(err){
                return callback(err,null);
            }
            
            if(!results){
                return callback(null, null);
            }
            return callback(null,results);
        })
    }
    
    /**
     * Get cards within a certain range of a position (in lat and lon)
     * @param {*} pos : Object with fields `lat` and `lon` 
     * @param {number} maxdist_m : maximum distance in miles
     * @param {function} callback 
     * 
     * @returns {function} callback(err, null) on error and callback(null, results) where results is the list of cards within range
     */
    getCardsByRange(pos , maxdist_m, callback){
        let Km = sutil.getKm(maxdist_m);
        //console.log(Km);
        let rounded_km = Math.round(Km);
        //console.log(rounded_km)
        
        let lat_min = pos.lat - (rounded_km * 0.045);
        let lat_max = pos.lat + (rounded_km * 0.045);
        let lon_min = pos.lon - ((rounded_km * 0.045) / Math.cos(pos.lat * Math.PI/180))
        let lon_max = pos.lon + ((rounded_km * 0.045) / Math.cos(pos.lat * Math.PI/180))
        
        let SQL = 'SELECT * FROM ?? WHERE ?? BETWEEN ? AND ? AND ?? BETWEEN ? AND ? AND ?? IS NULL'
        var params = [
            this.table,
            this.col.lat,
            lat_min,
            lat_max,
            this.col.lon,
            lon_min,
            lon_max,
            this.col.res
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
    
    /**
     * Get all cards associated with a given vendor
     * @param {string} vendor_id : the vendors email
     * @param {function} callback 
     * 
     * @returns {function} callback(err, null) on error and callback(null, results) where results is a list of cards associated with the vendor
     */
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
    
    /**
     * Gets a list of cards that the user has reserved (should just be one)
     * @param {string} user_id : the users email 
     * @param {function} callback 
     * 
     * @returns {function} callback(err, null) on error and callback(null, results) where results is the list of cards the user has reserved
     */
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
    
    /**
     * Delete a card by its id 
     * @param {number} card_id 
     * @param {function} callback 
     */
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

    /**
     * Delete all cards stored in the table
     * @param {*} callback 
     */
    deleteAll(callback){
        let SQL = 'DELETE FROM ??';
        let params = [
            this.table,
        ]

        this.conn.query(SQL, params, (err, results) => {
            if(err){
                return callback(err,null);
            }

            if(!results){
                return callback(null,null);
            }

            return callback(null,results.affectedRows);
        })
    }
    
    /**
     * Reserve a card for a user
     * @param {number} id : number id for the card we are reserving
     * @param {string} username : email for the user reserving the card
     * @param {function} callback : function to handle 
     * 
     * @returns {function} callback(err,null) if an error happened and callback(null, 1) if it reserved a card
     */
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
        ];
        
        this.conn.query(SQL, params, (err, results) => {
            if(err){
                return callback(err, null);
            }
            console.log('err',err);
            console.log('results',results);
            if(!results){
                return callback(err,null);
            }
            return callback(null, results.affectedRows);
        });
        
        
    }
    
    /**
     * Cancel a users reservations
     * @param {string} username : email for the user 
     * @param {function} callback 
     * 
     * @returns {function} callback(err, null) if error, and callback(null, results) where results will be the query info
     */
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
    
    /**
     * Function that is used to check if cards in the database are expired
     */
    clearAllExpired(){
        let date = new Date();
        let min = date.getTime() / MINUTES_IN_MILI;

        let SQL = "DELETE FROM ?? WHERE ?? <= ? "
        let params = [
            this.table,
            this.col.timestamp,
            min
      ]
        
        this.conn.query(SQL,params, (err,results) => {
            if(err){ throw err; }
            if(results.affectedRows > 0){
                console.log(`Clearing ${results.affectedRows} expired cards`);
            }
      })
    }
    
    /**
     * Start the clearing interval
     */
    startClear(){
        this.clearExp = setInterval(()=> this.clearAllExpired(), 1000 * 60 * 10);
    }
    
    /**
     * Stop the clearing interval
     */
    endClear(){
        clearInterval(this.clearExp);
    }
    
   
}


// Update an object current with item
// Any fields that are shared between item and current, current will have its values replaced by items values for those fields
// if one or the other are null, the one that is not is returned as the final object 
//   so no update means current stays as the object
//   and no current means the output becomes item
// if both are null, null is returned
function updateObject(item, current){
    if(!item || !current){
        let t = (!item) ? (!current ? null : current) : item; // nested lmao
        return t;
    }

    for(let key in Object.keys(item)){
        let curKey = Object.keys(item)[key];
        console.log(`Evaluating keys[${key}] as item[${curKey}]=${item[curKey]} and current[${curKey}]=${current[curKey]}`);
        if(current[curKey]){
            current[curKey] = item[curKey];
        }
        continue
    }

    return current;
}



const US = new UserStore();
const FS = new FoodStore();

module.exports = {
    UserStore: US,
    FoodStore: FS
}


