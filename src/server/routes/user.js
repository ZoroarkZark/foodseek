// User Routes for the server (User actions)
// Get Foodlist : /foodlist
// Upload Card  : /postcard
// Confirm card : /confirm


const express = require('express');
const sutils    = require('../utility/serverutility.js');
const sql       = require('../utility/sqlhandler.js');

//const Store = sutils.FoodStore; // call the food store instance from sutils for test, and sqlhandler for dev/live
const Store = sql.FoodStore;

const UserRouter = express.Router();

module.exports = {UserRouter}

UserRouter.use('', (req,res, next) => {
    sutils.verify(req.body.jwt, (err, results) => { // jwt check
        if(err){
            return next(2); // bad jwt
        }
        
        if(results.vendor != 0){
            return next(3); // wrong permissions
        }
        
        next(); // if we made it here we passed all above cases
    });
})


// load food cards
UserRouter.post('/list', (req, res, next)=>{
    let resbody = res.locals.resbody;
    
    Store.getCardsAll((err,results) => {
        if(err){
            return next(7); // SQL error
        }
        
        console.log(results);
        resbody.setData({msg: "Got List!", cards: results});
        return next();
    });
    
});

UserRouter.post('/lr', (req,res,next) => {
    let resbody = res.locals.resbody;
    
    let lat = parseFloat(req.body.lat);
    let lon = parseFloat(req.body.lon);
    let dist = parseInt(req.body.dist);
    
    Store.getCardsByRange({lat:lat, lon:lon}, dist, (err,results)=>{
        if(err){
            return next(7); // SQL error 
        }
        if(!results){
            resbody.setData({cards: null, msg: `no cards ${dist} away from lat:${lat}, lon:${long}`});
            return next();
        }
        
        resbody.setData({cards: results,msg: "cards found"});
        return next();
    });
});

UserRouter.post('/reserve', (req,res,next)=>{
    let resbody = res.locals.resbody;
    
    Store.reserveCard(req.body.id, req.body.user, (err) => {
        if(err){
            return next(7); // SQL error 
        }
        
        resbody.setData({msg: "Marked Card Reserved"});
        return next();
    })
});

UserRouter.post('/cancel', (req,res) => {
    let resbody = res.locals.resbody;
    Store.cancelReservation(req.body.user, (err, results) => {
        if(err){
            return next(err); // return error
        }
        
        resbody.setData({ msg: `cancel reservations for ${req.body.user}`});
        return next();
    })
})
