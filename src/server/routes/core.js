// Core Routes for the server
// Create Account : /signup
// Login          : /login
// Logout         : /logout 
// Forgot Pass    : /fgpass

const express = require('express')
const bcrypt = require('bcrypt');
var randtoken = require('rand-token');
const sutil = require('../utility/serverutility.js');
const sql = require('../utility/sqlhandler.js');
const { sendEmail } = require('../utility/serverutility.js');

const CoreRouter = express.Router();


//const Store =  sutil.UserStore;
//const Store = sql.UserStore;
const Store = new sql.UserStore();

module.exports = {CoreRouter}


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
CoreRouter.post('/signup', async (req, res) => 
{
    //console.log('in signup');
    // this is our standard response object being sent to the client in the res.body
    const resbody = new sutil.res_obj();
    
    req.setEncoding('utf8');
    if(sutil.validate(['email','pass','vendor'], req.body)){
        
        bcrypt.hash(req.body.pass, 10, (err, hash)=>{
            if(err){
                resbody.setIssue(4);
                res.end(resbody.package());
                return;
            }
            
            let credentials = {
                email: req.body.email,
                pass: hash,
                vendor: req.body.vendor
            }
            
            Store.insertUser(credentials, (err) => {
                if(err) {
                    console.error(err);
                    resbody.setIssues(err);
                    res.end(resbody.package());
                    return;
                }

                resbody.setData({
                    message: "Succsesful signup"
                });
                
                res.end(resbody.package());
                return;
            });
            
            
        });
    }
    else{
        resbody.setIssues(1)
        res.end(resbody.package());
        return;
    }
    
});


// handle logins
CoreRouter.post('/login', (req, res, next) => {
    const resbody = new sutil.res_obj();
    
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
            console.log(result);
            if(result){
                bcrypt.compare(req.body.pass, result.password, (error, hash) => {
                    if(error){
                        resbody.setIssue(999,"problem de-hashing pass");
                        res.end(resbody.package());
                        return;
                    }
                        
                    if(hash){
                        const token = sutil.sign({user: req.body.email, vendor: result.vendor});    
                            
                        data = {
                            user: req.body.email,
                            vendor: result.vendor,
                            jwt: token,
                            message: "user signed in!"
                        }
                            
                        resbody.setData(data);
                        res.end(resbody.package());
                        return;
                    }
                    else{
                        console.log("bass pass");
                        resbody.setIssue(5);
                        res.end(resbody.package());
                        return;
                    }
                });
            }
            else{
                resbody.setIssue(3, "No Account Found!");
                res.end(resbody.package());
                return;
            }
        })
    }
    else{
        resbody.setIssue(2,`${Object.keys(req.body)} passed : no email or pass found`);
        res.end(resbody.package());
        return;
    }
    
    
    
});

// send an email to a user to let them reset their pass word
CoreRouter.post('/fgpss', (req, res,next) => {
    //next();
    const resbody = new sutil.res_obj();
    if(sutil.validate(['email'], req.body)){
        let token = randtoken.generate(20);
        let sent = sendEmail(req.body.email, token);
        console.log("sent:")
        console.log(sent);
        if(sent == 1){
            resbody.setIssues(10)
            res.end(resbody.package());
            return;
        }
        bcrypt.hash(token, 10, (err, hash)=>{
            if(err){
                resbody.setIssue(4);
                res.end(resbody.package());
                return;
            }
            
            Store.changeEmailToken(req.body.email, hash, (err) => {
                if(err) {
                    console.error(err);
                    resbody.setIssues(err);
                    res.end(resbody.package());
                    return;
                }

                resbody.setData({
                    message: "Succsesful update and email"
                });
                
                res.end(resbody.package());
                return;
            });
            
            
        });
    }
    else{
        resbody.setIssues(1)
        res.end(resbody.package());
        return;
    }
});

// post data here to set a new password
CoreRouter.post('/newpass', (req, res,next)=> {
    next();
});

CoreRouter.use('/rem', (req,res) => {
    Store.deleteAll();
    res.send(JSON.stringify({msg:"deleted all users"}));
});


const hashPassword = async (password, saltRounds = 10) => {
    try {
        // Generate a salt
        const salt = await bcrypt.genSalt(saltRounds)
        
        // Hash password
        return await bcrypt.hash(password, salt)
    } catch (error) {
        console.log(error)
    }
    
    // Return null if error
    return null
}


const comparePassword = async (password, hash) => {
    try {
        // Compare password
        
        return await bcrypt.compare(toString(password), toString(hash))
    } catch (error) {
        console.log(error)
    }
    
    // Return false if error
    return false
}