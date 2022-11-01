// User Routes for the server (User actions)
// Get Foodlist : /foodlist
// Upload Card  : /postcard
// Confirm card : /confirm


const express = require('express')
const jwt     = require('jsonwebtoken');
const { FoodStore } = require('../utility/serverutility.js');
const jwt_secret = "tempSecretDoNotUseForProduction";

const sutils    = require('../utility/serverutility.js')

const Store = sutils.FoodStore; // call the food store instance from sutils for test, and sqlhandler for dev/live


const UserRouter = express.Router();

module.exports = {UserRouter}

function ezCard(id,item){
    return {
        id: id,
        image: "fake.png",
        vendor: "ACME",
        favorite: "favorite",
        cuisine: "GMO Hot Cheetos",
        item: item,
        travel: "x,y",
        reserved: "f",
    }
}


UserRouter.use('', (req,res, next) => {
    let resbody = new sutils.res_obj();
    req.setEncoding('utf8');

    if( ! sutils.validate(['jwt'], req.body)){ // Validate the body and jwt field
        resbody.setIssue(1);
        res.end(resbody.package());
        return;
    }

    sutils.verify(req.body.jwt, (err, type) => { // jwt check
        if(err){
            resbody.setIssue(2); // bad jwt
            res.end(resbody.package());
            return;
        }

        if(type){
            resbody.setIssue(3); // not a vendor type 
            res.end(resbody.package());
            return;
        }

        next(); // if we made it here we passed all above cases
    });

     
})


// load food cards in area
UserRouter.post('/list', (req, res)=>{
    const resbody = new sutils.res_obj();

    Store.getCardsAll((results) => {
        console.log(results);
        let list = unpackFoodList(results);
        resbody.setData({
            msg: "Got List!",
            items: list
        })
        res.end(resbody.package());
        return;
    });

});

UserRouter.post('/reserve', (req,res)=>{
    const resbody = new sutils.res_obj();

    if(sutils.validate(['id','user'], req.body)){
        FoodStore.markCardReserved(req.body.id, req.body.user, (err) => {
            if(err){
                resbody.setIssue(11, "Error reserving card");
                res.end(resbody.package());
                return;
            }

            resbody.setData({msg: "Marked Card Reserved"});
            res.end(resbody.package());
            return;
        })
    }else{
        resbody.setIssue(1);
        res.end(resbody.package());
        return;
    }
});


// implement a JWT  check here by verifiying JWT header on UserRouter.use()
// the Device simulator cant do this yet so im not doing this yet (stink?)

function unpackFoodList(food_list){
    if(!food_list){ return "";}
    out_str = "";
    for(x in food_list){
        out_str += "[ id: " + food_list[x].id +", item: " + food_list[x].item +"], ";
    }
    return out_str;
}