// User Routes for the server (User actions)
// Get Foodlist : /foodlist
// Upload Card  : /postcard
// Confirm card : /confirm


const express = require('express');
const sutils    = require('../utility/serverutility.js');
const sql       = require('../utility/sqlhandler.js');

//const Store = sutils.FoodStore; // call the food store instance from sutils for test, and sqlhandler for dev/live
const Store = sql.FoodStore;
const US    = sql.UserStore;

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
        
        //console.log(results);
        resbody.setData({msg: "Got List!", cards: results});
        return next();
    });
    
});
// list range
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
// reserve card
UserRouter.post('/reserve', (req,res,next)=>{
    let resbody = res.locals.resbody;
    
    Store.reserveCard(req.body.id, req.body.user, (err,reserved) => {
        if(err){
            if(errno = 1062){
                return next ({"error ": "user already reserved a card", "msg": `User(${req.body.user}) has a reservation`})
            }
            return next(7); // SQL error 
        }
        if(!reserved){
            return next ({"error ": "card already reserved", "msg": `Card(${req.body.id}) is already reserved`})
        }
        
        if(!reserved){
            return next({"error":"Card Already Reserved", "msg":`Card(${req.body.id}) is already reserved by another user`});
        }

        Store.getCard(req.body.id, (err, result) => {
            if(err){
                return next(7); 
            }
            if(!result){
                return next({msg:`No Card in database matching ${req.body.id}`});
            }
            let target = result.vendor;
            let itemname = JSON.parse(result.data)['item'];

            US.getPushToken(target, (err, token) => {
                if(err){
                    return next({err:"Push Could not get token"});
                }

                let push = {title:`${itemname} reserved!`, body:`User ${req.body.user} has reserved your post ${itemname}`};

                sutils.pushNotify(token, push, (err, sent) => {
                    if(err!=1){
                        return next(err);
                    }
                    if(sent){
                        resbody.setData("PushStatus", "Sent");
                        return next();
                    }
                    else{
                        resbody.setData("PushStatus", "Not Sent");
                        return next();
                    }
                })
            })
        })
    })
});
// get users reserved card
// keys required ["jwt", "email"]
UserRouter.post('/getUserReserved', (req, res, next) => {
    let resbody = res.locals.resbody;
    Store.getUserReserved(req.body.email, (err, result) => {
        if(err) return next(7);

        console.log(result.length);

        if(result.length <= 0){
            return next({code: 69 , msg: "User has no reservations"});
        }

        resbody.setData({cards: result});

        return next();
    })

})

UserRouter.post('/cancel', (req,res,next) => {
    let resbody = res.locals.resbody;
    Store.cancelReservation(req.body.email, (err, results) => {
        if(err){
            return next(err); // return error
        }
        
        resbody.setData({ msg: `cancel reservations for ${req.body.email}`});
        return next();
    })
})
