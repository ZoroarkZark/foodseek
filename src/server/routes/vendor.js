const express = require('express');


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
    //let resbody = res.locals.resbody;
    
    sutils.verify(req.body.jwt, (err, result) => { // jwt check
        //console.log("back in vendor.js");
        if(err){
            return next(2); //  bad jwt
        }
        
        if(result.vendor != 1){
            return next(3); // bad permissions
        }
        
        next(); // move along
    });
    
})


// upload a food card to the FoodStore
VendorRouter.post('/upl', (req,res,next) => {
    let resbody = res.locals.resbody;
    
    // our app.use should have hopefully done all the error checking and verifying
    FoodStore.uploadItem(req.body.item, req.body.vendor, (err) => {
        if(err){ // didnt upload successfully
            return next(7); // SQL error 
        }
        
        resbody.setData({
            msg: "upladed card!"
        });
        return next(); // success
    });
    
});

VendorRouter.post('/upl2', (req,res,next) => {
    let resbody = res.locals.resbody;
    //console.log(req.body.timestamp)
    let pkg = {
        item: req.body.item,
        loc: req.body.loc,
        tags: req.body.tags,
        timestamp: req.body.timestamp,
        img_url: "empty",
        vendor: req.body.vendor
    }
    
    FoodStore.uploadMore(pkg, (err) => {
        if(err){
            console.debug(err);
            return next(7);
        }
        
        resbody.setData({msg: "uploaded card"});
        return next();
    })
});

// edit the data of a foodcard object
VendorRouter.post('/updateData', (req,res,next) => {
    FoodStore.editCardData(req.body.id, req.body.data, (err, result) => {
        if(err){
            console.log(err);
            return next(err);
        }

        res.locals.resbody.setData({msg: `Updated card(${req.body.id}) with new data`});
        return next();
    })
});

// edit the timestamp field of a foodcard object
VendorRouter.post('/updateTime', (req,res,next) => {
    FoodStore.editCardTimestamp(req.body.id, req.body.timestamp, (err, result) => {
        if(err){
            console.log(err);
            return next(err);
        }

        res.locals.resbody.setData({msg: `Updated timestamp of card(${req.body.id}) to ${req.body.timestamp}`});
        return next();
    })
});
 
// delete a card from the foodstore
VendorRouter.post('/del', (req,res,next) => {
    let resbody = res.locals.resbody;
    
    FoodStore.deleteCardsById(Number(req.body.id), (err) => {
        if(err){
            return next(7); // SQL error 
        }
        
        
        resbody.setData({
            msg: "deleted object"
        });
        return next(); // success
    });
});

// confirm a pickup with a user and foodcard id
VendorRouter.post('/conf', (req,res,next) => {
    let resbody = res.locals.resbody;
    console.log(req.body);
    
    FoodStore.getCard(req.body.id, (err, result) => {
        if(err){
            return next(7); // SQL error 
        }
        if(!result){
            return next({"error":`No card found with ID:${req.body.id}`});
        }
        
        console.log(result.id == req.body.id);
        if(result.id == req.body.id){
            console.log(result.res,req.body.email);
            if(result.res === req.body.email){
                // want to remove the card after a successful confirmation
                FoodStore.deleteCardsById(result.id, (err, res)=>{
                    if(err){
                        return next(err);
                    }
                    resbody.setData({msg: "confirmed pickup!"});
                    return next();
                })
            }
        }
        else{
            return next({"error": `Bad Confirmation for ${req.body.email} and card ${req.body.id}`});
        }
        
        
    })
});

VendorRouter.post('/checkres', (req,res,next) => {
    let resbody = res.locals.resbody;
    
    FoodStore.getVendorReserved(req.body.vendor, (err, results) => {
        if(err){
            return next(7); // sql error 
        }
        
        resbody.setData({ msg:"Get reserved cards",cards: results});
        return next();
    })
})

VendorRouter.post('/list', (req,res,next) => {
    let resbody = res.locals.resbody;
    
    FoodStore.getCardsVendor(req.body.vendor, (err, results) => {
        if(err){
            return next(7); // SQL error 
        }
        
        if(results){
            resbody.setData({msg: "got vendor cards", cards: results});
            return next();
        }
        
        resbody.setData({msg: "no cards for this vendor",cards: null}); 
        return next();   
    });

});