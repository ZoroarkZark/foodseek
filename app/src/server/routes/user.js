// User Routes for the server (User actions)
// Get Foodlist : /foodlist
// Upload Card  : /postcard
// Confirm card : /confirm


const express = require('express')
const jwt     = require('jsonwebtoken');
const jwt_secret = "tempSecretDoNotUseForProduction";

const sutils    = require('../utility/serverutility.js')

const Store = new sutils.FoodStore(); // create a fake foodstore


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
        if(sutils.validate(['jwt','id','item'], req.body)){
            
            // verify user 
            jwt.verify(req.body.jwt, jwt_secret, (err, results)=> {
                if(err){
                    resbody.setIssue(4, "Non-Valid JWT");
                    res.end(resbody.package());
                    return;
                }
                // verify vendor status
                if(results.vendor == "1"){
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
                }
                else{
                    resbody.setIssue(5, "Non-Vendor performing Vendor Only Task");
                    res.end(resbody.package());
                }
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

UserRouter.post('/list', (req, res)=>{
    const resbody = new sutils.res_obj();

    req.setEncoding('utf-8');
    if(req.body){
        if(req.body.jwt){
            jwt.verify(req.body.jwt, jwt_secret, (err, response)=> {
                if(err){
                    console.log(err);
                    resbody.setIssue(4, "Non-Valid JWT");
                    res.end(resbody.package());
                    return;
                }

                console.log(response);
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
        }
        else{
            resbody.setIssue(2,'No JWT Field Found');
            res.end(resbody.package());
            return;
        }
    }
    else{
        resbody.setIssue(1, 'No Body Data');
        res.end(resbody.package());
        return;
    }

    
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