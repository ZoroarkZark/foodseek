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
    req.setEncoding('utf8');
    
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
    let resbody = new sutil.res_obj();
    
    req.setEncoding('utf8');
    
    
    if(sutil.validate(['email','pass'], req.body)) // correct fields
    {
        Store.getUser(req.body.email, (err, result) => { // get the user 
            if(err){
                console.error(err);
                resbody.setIssues(err);
                res.end(resbody.package());
                return;
            }
            //console.log(result);
            if(result){
                sutil.bCompare(req.body.pass, result.password, (error, hash) => {
                    if(error){
                        resbody.setIssue(4,"problem de-hashing pass");
                        res.end(resbody.package());
                        return;
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
                        res.end(resbody.package());
                        return;
                    }
                    else{
                        resbody.setIssue(5);
                        res.end(resbody.package());
                        return;
                    }
                });
            }
            else{
                resbody.setIssue(6);
                res.end(resbody.package());
                return;
            }
        })
    }
    else{
        resbody.setIssue(1);
        res.end(resbody.package());
        return;
    }
    
    
    
});

// send an email to a user to let them reset their pass word
CoreRouter.post('/fgpss', (req, res,next) => {
    //next();
    let resbody = new sutil.res_obj();
    if(sutil.validate(['email'], req.body)){
        let code = randtoken.generate(8);
        Store.setForgotCode(req.body.email, code, (err) => {
            if(err){
                resbody.setIssue(7);
                res.end(resbody.package());
                return;
            }
            
            sutil.fgpssEmail(req.body.email, code, (err, sent) => {
                if(err){
                    resbody.setIssues(err);
                    res.end(resbody.package());
                    return;
                }
                
                resbody.setData({msg:"Sent forgot pass email successfully"});
                res.end(resbody.package());
                return;
            })
            
        })
    }
    else{
        resbody.setIssue(1)
        res.end(resbody.package());
        return;
    }
});

CoreRouter.post('/validatecode', (req, res) => {
    let resbody = new sutil.res_obj();
    if(sutil.validate(['code','email'], req.body)){		
        Store.getForgotCode(req.body.code, (err, result) => {
            console.log('checked forgot code');
            if(err){
                resbody.setIssue(7);
                res.end(resbody.package());
                return;
            }
            if(result.code === req.body.code){
                console.log(`code match`);
                Store.setTempPassword(req.body.email,(error, tempPass) => {
                    if(error){
                        resbody.setIssue(69,"Error generating temp pass");
                        res.end(resbody.package());
                        return;
                    }
                    if(tempPass){
                        console.log("set temp pass");
                        resbody.setData({msg: "correct code for fgpass", temp:tempPass});
                        res.end(resbody.package());
                        return;
                    }
                });
                
            }
            else {
                resbody.setIssue(70,"no code found");
                res.end(resbody.package());
                return;
            }
        });
    }
    else{
        resbody.setIssue(1);
        res.end(resbody.package());
        return;
    }
    
});

// post data here to set a update new password with link
/*
Take in the following values:
email : the users email who is attempting to update their pass,
old_pass: the old password for the account,
new_pass: the new password they just typed in somewhere


*/
CoreRouter.post('/updatepass', (req, res,next)=> {
    //next();
    let resbody = new sutil.res_obj();
    if(sutil.validate(['email','old_pass','new_pass'], req.body)){       
        Store.updatePassword(req.body.email,req.body.old_pass,req.body.new_pass, (err, result) => {
            if(err){
                resbody.setIssue(7);
                res.end(resbody.package());
                return;
            }
            
            resbody.setData({msg:"updated password"});
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



CoreRouter.get('/confirmEmail', (req,res) => {
    let resbody = new sutil.res_obj();
    sutil.verify(req.query.token, (err, result) => { // jwt check
        if(err){
            resbody.setIssue(2); // bad jwt
            res.end(resbody.package());
            return;
        }
        
        let email = result.user;
        Store.setValid(email, (err) => {
            if(err){
                resbody.setIssue(7);
                res.end(resbody.package());
                return;
            }
            
            resbody.setData({msg:`Confirmed Email Successfully for ${email}`});
            res.end(resbody.package());
            return;
        });
        
    });
    
});


CoreRouter.use('/rem', (req,res) => {
    Store.deleteAll();
    res.send(JSON.stringify({msg:"deleted all users"}));
});

CoreRouter.post('/ru', (req,res) => {
    let resbody = new res_obj();
    Store.deleteUser(req.body.email, (err, result) => {
        if(err){
            resbody.setIssue(7);
            res.end(resbody.package());
            return;
        }
        
        if(result){
            resbody.setData({msg: `removed user  ${req.body.email} from db`});
            res.end(resbody.package());
            return;
        }
        
        resbody.setData({msg: `op performed successfully, however no user found ${req.body.email}`});
        res.end(resbody.package());
        return;
    });
});

