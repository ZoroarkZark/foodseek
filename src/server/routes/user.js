// User Routes for the server (User actions)
// Get Foodlist : /foodlist
// Upload Card  : /postcard
// Confirm card : /confirm


const express = require('express')

const FakeStore = require('../tests/FakeUserStore.js')
const sutils    = require('../utility/serverutility.js')

const Store = new FakeStore.FoodStore(); // create a fake foodstore


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

//Upload food card to foodstore
UserRouter.post('/upl', (req,res) => {
    const resbody = new sutils.res_obj();

    req.setEncoding('utf-8')
    if(req.body)
    {
        if(sutils.validate(['id','item'], req.body)){
            
            Store.uploadCard(ezCard(req.body.id, req.body.item), (err) => {
                if(err){
                    resbody.setIssue(3, "Duplicate Entry");
                    res.end(resbody.package());
                    return;
                }
                
                resbody.setData({
                    msg: "Uploaded Card"
                });
                res.end(resbody.package());
                return;
            });

            //console.log(ezCard(req.body.id,req.body.item));
        }
        else{
            resbody.setIssue(2, "Fields id and item not found");
            res.end(resbody.package());
            return;
        }
    }
    else{
        resbody.setIssue(1,"No Body Data Found!");
        res.end(resbody.package());
        return;
    }
        
});

UserRouter.get('/list', (req, res)=>{
    const resbody = new sutils.res_obj();

    req.setEncoding('utf-8');

    Store.getCardsAll((results) => {
        let str = "";
        if(results){
            str = unpackFoodList(results);
        }

        resbody.setData({
            msg:"got foodcards",
            items: str
        });
        res.end(resbody.package());


    })

    
});

// implement a JWT  check here by verifiying JWT header on UserRouter.use()
// the Device simulator cant do this yet so im not doing this yet (stink?)

function unpackFoodList(food_list){
    out_str = "";
    for(x in food_list){
        out_str += "[ id: " + food_list[x].id +", item: " + food_list[x].item +"], ";
    }
    return out_str;
}