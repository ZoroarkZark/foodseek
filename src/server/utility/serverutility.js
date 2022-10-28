// Response Object
/* 
{
    success = 1 or 0 
    data : { 
        object 
    } or null,
    issue: {
        object 
    } or null
}
*/

class res_obj {
    // defualt constructor
    // all fields set to uninitilized

    constructor(){
        this.success = 0;
        this.data = null;
        this.issues = null;
    }


    // only call one of these

    // on success 
    // set the returned data 
    setData(data){
        this.success = 1;
        this.data = data;
    }

    // on failure of operation
    // set the returned issue
    setIssues(issues){
        this.success = 0;
        this.issues = issues;
    }

    setIssue(code, msg){
        this.success = 0;
        this.issues = {
            error: code,
            message: msg
        }
    }

    // just return the string version of this object
    package(){
        return JSON.stringify(this);
    }
    
}

class food_card{
    constructor(foodData){
        this.id = foodData.id; // probably will change to be generated as a rand key or that rand key is set here
        this.image = foodData.image;
        this.vendor = foodData.vendor;
        this.favorite = foodData.favorite;
        this.cuisine = foodData.cuisine;
        this.item = foodData.item;
        this.travel = foodData.travel;  
        this.reserved = foodData.reserved;
    }
}

function validate(fields, object){
    for(x in fields){
        if(fields[x] in object){
            continue
        }else{
            return false;
        }
    }
    return true;
}

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
        if(validate(['email','pass'],credentials)){

            if(credentials.email in this.user_data){
                return callback({error: 3, message:`user ${credentials.email} already exists`});
            }

            let vend = ("vendor" in credentials) ? credentials.vendor : 0;

            this.user_data[credentials.email] = {
                pass: credentials.pass,
                vendor: vend
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

        const upload = new food_card(fooddata);
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

    getCards(pos , [filters]){
        //for(i = 0; i < this.foodlist.length(); i++){
            //if(foodlist item in range)
            //return list of all items in range       
        //}
    }



}



module.exports = {
    res_obj: res_obj,
    food_card: food_card,
    validate: validate,
    UserStore: UserStore,
    FoodStore: FoodStore

}


