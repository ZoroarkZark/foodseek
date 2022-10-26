// Fake user Storage for testing 
const sutils = require('../utility/serverutility.js');

const validateFields = (obj) => {
    if(obj.email && obj.pass){
        return true;
    }
    return false;
};



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
class FoodStore {
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

    getCards(pos , maxdist_m){
        // assuming we have pos.lat , pos.long
        var lat1 = pos.lat;
        var lan2 = pos.long;
        let in_range = []
        for(x in this.foodlist){
            console.log(x);
            var lat2 = this.foodlist[x].travel[0];
            var lon2 = this.foodlist[x].travel[1];
            // distance between latitudes and longitudes
            let dLat = (lat2 - lat1) * Math.PI / 180.0;
            let dLon = (lon2 - lon1) * Math.PI / 180.0;
            // convert to radians
            lat1 = (lat1) * Math.PI / 180.0;
            lat2 = (lat2) * Math.PI / 180.0;
            // apply formula
            let a = Math.pow(Math.sin(dLat / 2), 2) + Math.pow(Math.sin(dLon / 2), 2) * Math.cos(lat1) * Math.cos(lat2);
            let rad = 6371;
            let dist_km = 2 * Math.asin(Math.sqrt(a));
            // conversion factor
            const factor = 0.621371
            const miles = dist_km * factor;
            if(miles <= maxdist_m){
                in_range.push(x)
                console.log("in range foodcard added to list")
            }
        }
    }



}




module.exports = {
   UserStore: UserStore,
   FoodStore: FoodStore
};