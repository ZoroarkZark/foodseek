const express = require('express')


const sutils    = require('../utility/serverutility.js');
const sql       = require('../utility/sqlhandler.js');

//const FoodStore = sutils.FoodStore;
const FoodStore   = sql.FoodStore;

const VendorRouter = express.Router();

module.exports = {VendorRouter};

// Vendor Validation
// Check for body and JWT : return error 1 if neither present
// Check for valid jwt    : return error 2 if invalid jwt
// check for user type    : return error 3 if user is not a vendor
VendorRouter.use('', (req,res, next) => {
    let resbody = new sutils.res_obj();
    req.setEncoding('utf8');

    if(sutils.validate(['jwt'], req.body) == false){ // Validate the body and jwt field
        resbody.setIssue(1);
        res.end(resbody.package());
        return;
    }
    console.log("verify jwt")
    sutils.verify(req.body.jwt, (err, type) => { // jwt check
        console.log("back in vendor.js");
        if(err){
            console.log(err);
            resbody.setIssue(2); // bad jwt
            res.end(resbody.package());
            return;
        }

        if(!type){
            resbody.setIssue(3); // not a vendor type 
            res.end(resbody.package());
            return;
        }

        next();
    });

})


// upload a food card to the FoodStore
VendorRouter.post('/upl', (req,res) => {
    const resbody = new sutils.res_obj();
    
    // our app.use should have hopefully done all the error checking and verifying
    if(sutils.validate(['item'], req.body)){
        FoodStore.uploadItem(req.body.item, req.body.vendor, (err) => {
            if(err){ // didnt upload successfully
                console.log("Err");
                resbody.setIssue(11, "Bad upload");
                res.end(resbody.package());
                return;
            }

            resbody.setData({
                msg: "upladed card!"
            });
            res.end(resbody.package());
            return;
        });

    }
    else{
        resbody.setIssue(1);
        res.end(resbody.package());
        return;
    }

});

// delete a card from the foodstore
VendorRouter.post('/del', (req,res) => {
    const resbody = new sutils.res_obj();

    if(sutils.validate(['id'], req.body)){
        FoodStore.deleteCard(Number(req.body.id), (err) => {
            if(err){
                resbody.setIssue(11, "Issue deleting");
                res.end(resbody.package());
                return;
            }
            

            resbody.setData({
                msg: "deleted object"
            });
            res.end(resbody.package());
            return;
        });
    }
    else{
        resbody.setIssue(1);
        res.end(resbody.package());
        return;
    }
});

// confirm a pickup with a user and foodcard id
VendorRouter.post('/conf', (req,res) => {
    const resbody = new sutils.res_obj();

    if(sutils.validate(['user','id'], req.body)){
        FoodStore.getCard(req.body.id, (err, result) => {
            if(err || !result){
                resbody.setIssue(11, "invalid food card id");
                res.end(resbody.package);
                return;
            }


            if(result.id == req.body.id){
                if(result.reserved == req.body.user){

                    // want to remove the card after a successful confirmation
                    resbody.setData({
                        msg: "confirmed pickup!"
                    });
                    res.end(resbody.package());
                    return;
                }
            }
            else{
                resbody.setIssue(11, "Bad match on confirmation");
                res.end(resbody.package());
                return;
            }


        })
    }
});

