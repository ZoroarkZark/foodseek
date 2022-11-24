// Core Routes for the server
// Create Account : /signup
// Login          : /login
// Logout         : /logout 
// Forgot Pass    : /fgpass

const express = require('express')
const sutil = require('../utility/serverutility.js');
const sql = require('../utility/sqlhandler.js')
const { sendEmail, createOptions, res_obj } = require('../utility/serverutility.js');
const CoreRouter = express.Router();
var randtoken = require('rand-token');
//const Store =  sutil.UserStore;
const Store = sql.UserStore;

module.exports = {CoreRouter}



CoreRouter.use('/wipecards', (req,res,next) => {
    let resbody = res.locals.resbody;
    sql.FoodStore.deleteAll((err, deleted) => {
        if(err){
            return next(err);
        }
        
        resbody.setData({"deleted_rows":deleted});
        return res.end(resbody.package());
    })
})



CoreRouter.use('/test', (req,res)=>{
    if(req.method != "GET"){
        if(!req.body){
            console.log("Event body!");
            req.on('data', (chunk)=>{
                res.end(JSON.stringify(chunk));
            })
        }
        console.log("immediate body");
        res.end(JSON.stringify(req.body));
    }
    else{
        res.end(JSON.stringify({msg:"Get success"}));
    }
});



// handle signups
// Checking for fields in the body { email, pass, vendor}
// returns a response_object 
CoreRouter.post('/signup', async (req, res, next) => 
{
    let resbody = res.locals.resbody; // Get the response object, and the credentials from the request 
    let credentials = {
        email: req.body.email,
        vendor: req.body.vendor,
        pass: "",
    }
    
    sutil.bHash(req.body.pass, (err, hash)=>{  // Hash the input password to store in the database
        if(err){
            return next(4);
        }
        
        credentials.pass = hash; // store the hash in credentials
        
        Store.insertUser(credentials, (err) => { // Insert the user into the database
            if(err) {
                return next(err);
            }
            
            if(credentials.email.indexOf("@") >=0){ // send validation email to email addresses
                sutil.signUpEmail(credentials.email, (err, sent) => { // send the user an email for validation
                    if(err){
                        return next(err);
                    }
                    
                    resbody.setData({msg:"Signup successful, check email for validation email"});
                    return next();
                });
            }else{ 
                resbody.setData({msg:"Signup complete, no email provided"});
                return next();
            }
        });
    });
});


// handle logins
CoreRouter.post('/login', (req, res, next) => {
    let resbody = res.locals.resbody;
    
    
    Store.getUser(req.body.email, (err, result) => { // get the user 
        if(err){
            return next(err);
        }
        if(result){
            sutil.bCompare(req.body.pass, result.password, (error, hash) => {
                if(error){
                    return next(error);
                }
                
                if(hash){
                    const token = sutil.sign({user: req.body.email, vendor: result.vendor});    
                    
                    data = {
                        user: req.body.email,
                        vendor: result.vendor,
                        jwt: token,
                        gplacesKey: process.env.GPLACEKEY,
                        message: "user signed in!"
                    }
                    
                    resbody.setData(data);
                    return next();
                }
                else{
                    return next(5);
                }
            });
        }
        else{
            return next(6);
        }
    })
    
    
});

// send an email to a user to let them reset their pass word
CoreRouter.post('/fgpss', (req, res,next) => {
    let resbody = res.locals.resbody;
    let code = randtoken.generate(8);
    
    Store.setForgotCode(req.body.email, code, (err) => {
        if(err){
            return next(7); // SQL error
        }
        
        sutil.fgpssEmail(req.body.email, code, (err, sent) => {
            if(err){
                return next(err); // internal error with nodemailer
            }
            // successful
            resbody.setData({msg:"Sent forgot pass email successfully"}); // set data
            return next(); // pass to next (will send data back)
        })
        
    })
});

CoreRouter.post('/validatecode', (req, res, next) => {
    let resbody = res.locals.resbody;
    
    Store.getForgotCode(req.body.code, (err, result) => {
        if(err){
            return next(7); // sql error
        }
        if(result.code === req.body.code){
            console.log(`code match`);
            Store.setTempPassword(req.body.email,(error, tempPass) => {
                if(error){
                    return next(7);// another potential sql error
                }
                if(tempPass){
                    console.log("set temp pass");
                    resbody.setData({msg: "correct code for fgpass", temp:tempPass});
                    return next();
                }
            });
            
        }
        else {
            return next({"error":"Code did not match"});
        }
    });
    
    
});

// post data here to set a update new password with link
/*
Take in the following values:
email : the users email who is attempting to update their pass,
old_pass: the old password for the account,
new_pass: the new password they just typed in somewhere


*/
CoreRouter.post('/updatepass', (req, res,next)=> {
    let resbody = res.locals.resbody;      
    Store.updatePassword(req.body.email,req.body.old_pass,req.body.new_pass, (err, result) => {
        if(err){
            return next(7); // sql error
        }
        
        resbody.setData({msg:"updated password"});
        return next(); // successful 
    });
});



CoreRouter.get('/confirmEmail', (req,res,next) => {
    let resbody = new sutil.res_obj();
    sutil.verify(req.query.token, (err, result) => { // jwt check
        if(err){
            return next(2); // JWT was not signed by us (bad verification)
        }
        
        let email = result.user;
        Store.setValid(email, (err) => {
            if(err){
                return next(7); // SQL error 
            }
            
            resbody.setData({msg:`Confirmed Email Successfully for ${email}`});
            return next(); // Success
        });
        
    });
    
});


// Set a users push token
CoreRouter.post('/setPushToken', (req, res,next) => {
    let resbody = res.locals.resbody;
    Store.updatePushToken(req.body.email, req.body.token, (err, result) => {
        if(err){
            return next(err);
        }

        if(result){
            resbody.setData({msg: `Updated user: ${req.body.email}'s token to ${req.body.token}`});
        }
        else{
            resbody.setData({msg: `Nothing updated, no errors encountered`});
        }
        return next();
    })
})

CoreRouter.post('/deletePushToken', (req, res, next) => {
    let resbody = res.locals.resbody;
    Store.updatePushToken(req.body.email, '', (err, result) => {
        if(err) return next(err);

        if(result){
            resbody.setData({msg: `Deleted push token for ${req.body.email}`});
        }
        else{
            resbody.setData({msg: `Nothing updated, no errors encountered`});
        }
        return next();
    })
})


CoreRouter.use('/rem', (req,res) => {
    Store.deleteAll();
    res.send(JSON.stringify({msg:"deleted all users"}));
});

CoreRouter.post('/ru', (req,res,next) => {
    let resbody = res.locals.resbody;
    Store.deleteUser(req.body.email, (err, result) => {
        if(err){
            return next(7); // SQL error 
        }
        
        if(result){
            resbody.setData({msg: `removed user  ${req.body.email} from db`});
            return next();
        }
        
        resbody.setData({msg: `op performed successfully, however no user found ${req.body.email}`});
        return next();
    });
});

