// User Routes for the server (User actions)
// Get Foodlist : /foodlist
// Upload Card  : /postcard
// Confirm card : /confirm


const express = require('express')

const FakeStore = require('../tests/FakeUserStore.js');
const { res_obj } = require('../utility/serverutility.js');
const sutils    = require('../utility/serverutility.js')

const Store = new FakeStore.FfoodStore(); // create a fake foodstore


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

UserRouter.use('/', function(req, res, next) {
    const resbody =  new sutils.res_obj();
    req.setEncoding('utf-8')
    if(req.body){
        if(sutils.validate(['jwt'], req.body)){
            jwt.verify(req.body.jwt, jwt_secret, (err, results)=> {
                if(err){
                    resbody.setIssue(4, "Non-Valid JWT");
                    res.end(resbody.package());
                    return;
                }          
                next();    
            });
            
        }
        else {
            resbody.setIssue(2,'No JWT Field Found');
            res.end(resbody.package());
            return;
        }
    } 
    
})

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

UserRouter.post('/reserve', (req, res) => {
    let resbody = new res_obj();
    if(req.body){
        
    }
})

UserRouter.get('/list', (req, res) => {
    
    //decode jwt token
    if( vendor == 1) {
        //select from food_store where food_Card[i].vendor == this vendors name
        

    }
    else {
        //select from food_store where distance(userPos, food_Card[i].pos) < userPrefDistance && food_card[i].reserved == false
        
    }
    

})

// implement a JWT  check here by verifiying JWT header on UserRouter.use()
// the Device simulator cant do this yet so im not doing this yet (stink?)

function unpackFoodcard(food_card){
    out_str = "";
    out_str = "[ id: " + food_card.id +", item: " + food_card.item +"], ";
    return out_str;
}

function unpackFoodList(food_list){
    out_str = "";
    for(x in food_list){
        out_str += "[ id: " + food_list[x].id +", item: " + food_list[x].item +"], ";
    }
    return out_str;
}