const express = require('express')
const sutil = require('../utility/serverutility.js');
const sql = require('../utility/sqlhandler.js')
const AuthRouter = express.Router();
var randtoken = require('rand-token');
//const Store =  sutil.UserStore;
const Store = sql.UserStore;

module.exports = {AuthRouter}


AuthRouter.use('', (req,res, next) => {
    console.log("Auth Router");
    //potential header use 
    let jwt = "";
    if(req.get('Custom-Json')){
        let head_data = JSON.parse(req.get('Custom-Json'));
        if(head_data.jwt){
            jwt = head_data.jwt
        }
    }

    if(req.body.jwt){
        jwt = req.body.jwt;
    }

    sutil.verify(jwt, (err, results) => { // jwt check
        if(err || !results || !results.user){
            return next(2); // bad jwt
        }
        


        res.locals.useremail = results.user;
        
        next(); // if we made it here we passed all above cases
    });
})


// Required Keys : ["jwt", "data"]
AuthRouter.post('/editData', (req,res,next) => {
    Store.updateUserData(res.locals.useremail,req.body.data, (err, result) => {
        if(err){
            console.log(err);
            next(err);
        }
        console.log(result);
        
        res.locals.resbody.setData({msg: "updated item", result: result});
        next();
    })
})


// Refresh a users avatar by gettting a url for their image in the database
// these urls are set to 6 days of live time
AuthRouter.post('/refreshAvatar', (req,res,next) => {
    Store.getUserfield(res.locals.useremail, "avatar", async (err, filename) => {
        if(err) return next(7);
        console.log(filename[0].Avatar);
        filename = filename[0].Avatar;
        let link = await sutil.getImgUrl(filename);

        res.locals.resbody.setData({msg:"refreshing avatar", img_url:link});
        return next();
    })
})

