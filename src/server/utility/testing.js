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
        
        let err = {
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
        this.ids = 0;
        this.foodlist = [];
        
    }
    
    getId = () => {
        let id = this.ids;
        this.ids +=1;
        return id;
    }

    // upload just with item name
    uploadItem(item, cb){

        const upload = new food_card({
            id: this.getId(),
            item: item,
            vendor: "cal",
            cuisine: "Tex Mex",
            pos: [0.0,0.0]
        });

        this.foodlist.push(upload);
        return cb(null);

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

    getCard(id, cb){
        for(x in this.foodlist){
            if(id === this.foodlist[x].id){
                return cb(null, this.foodlist[x]);
            }
        }

        return cb({code:1, msg: "no card with that id"}, null);
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

    deleteCard(id, cb){
        for(x in this.foodlist){
            if(id === this.foodlist[x].id){
                this.foodlist[x] = null;
                return cb(null);
            }
        }

        return cb({code: 1, msg: "couldnt delete"});
    }

    markCardReserved(id, user, cb){
        for(x in this.foodlist ){
            if(id === this.foodlist[x].id){
                this.foodlist[x].reserved = user;
                return cb(null);
            }
        }

        return cb({code: 1, msg:"Cant reserve / cant find card"});
    }


}
