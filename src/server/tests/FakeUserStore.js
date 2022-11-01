// Fake user Storage for testing 
const { getDistance } = require('../utility/serverutility.js');
const sutils = require('../utility/serverutility.js');

const validateFields = (obj) => {
    if(obj.email && obj.pass){
        return true;
    }
    return false;
};

const database = require('mysql');
require('dotenv').config();

class UserStore 
{
    // initialize empty data table
    constructor(){
        this.user_data = {};
    }

    // attemp to add a user based on credentials
    // callback(null) on successful add
    // callback(err) on error
    insertUser(credentials, callback){
        if(validateFields(credentials)){

            if(credentials.email in this.user_data){
                return callback({error: 3, message:`user ${credentials.email} already exists`});
            }

            let vend = ("vendor" in credentials) ? credentials.vendor : 0;

            this.user_data[credentials.email] = {
                pass: credentials.pass,
                vendor_status: vend
            };

            return callback(null);
        }

        return callback({error: 2, message: `Passed : ${Object.keys(credentials)}, expected .email, .pass, .vendor`});
    }

    // return callback(null, user_data) on success
    // return callback(err, null) on error or failure to find
    getUser(email, callback){
        if(email in this.user_data){
            return callback(null,this.user_data[email]);
        }
        
        err = {
            error: "failed to find user",
            message: `${email} not found in user data`
        }
        return callback(err, null);
    }

    deleteAll(){
        this.user_data = [];
    }

}

// implemented callbackss bc that is what we will most likely be using for the SQL stuff


        
   
class FakeFoodStore {
    constructor() {
        this.foodlist = [];
        
    }
    
    uploadCard(fooddata, cb){

        const upload = new sutils.food_card(fooddata);
        //check database for dup entry
        //const found = this.foodlist.find(FoodCard.id => FoodCard.id = )
        for(x in this.foodlist){
            console.log(x);
            if(upload.id === this.foodlist[x].id){
                console.log("FoodCard alread in LIST");
                return cb("Card in List");
            }
        }
        
        this.foodlist.push(upload);
        console.log("FoodCard added to list");
        return cb(null);
    }

    getCardsAll(cb){
        return cb(this.foodlist);
    }

    getCards(pos , maxdist_m, cb){
        // assuming we have pos.lat , pos.long
        var lat1 = pos.lat;
        var lon2 = pos.lon;
        let in_range = []
        for(x in this.foodlist){
            console.log(x);
            var lat2 = this.foodlist[x].travel[0];
            var lon2 = this.foodlist[x].travel[1];
            var miles = getDistance(lat1, lon1, lat2, lon2)
            if(miles <= maxdist_m){
                in_range.push(x)
                console.log("in range foodcard added to list")
            }
        }
        return in_range, cb(null);
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

let food = {
    image : "some string" ,
    vendor : "Pablos pizza", 
    favorite : "none",
    cuisine : "Italin",
    item : "Pizza",
    travel : "",  
    reserved : "rando@email.com",
    lat : 0.0,
    lon : 0.0
}




module.exports = {
   UserStore: UserStore,
   FakeFoodStore: FakeFoodStore
};