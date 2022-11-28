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
    sutil.verify(req.body.jwt, (err, results) => { // jwt check
        if(err || !results || !results.user){
            return next(2); // bad jwt
        }
        


        res.locals.useremail = results.user;
        
        next(); // if we made it here we passed all above cases
    });
})


// Required Keys : ["jwt", "data"]
AuthRouter.use('/editData', (req,res,next) => {
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