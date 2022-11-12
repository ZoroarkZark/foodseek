// Core Routes for the server
// Create Account : /signup
// Login          : /login
// Logout         : /logout 
// Forgot Pass    : /fgpass

const express = require('express')
const bcrypt = require('bcrypt');
const url = require('url');
const sutil = require('../utility/serverutility.js');
const sql = require('../utility/sqlhandler.js')
const { sendEmail, createOptions } = require('../utility/serverutility.js');
const CoreRouter = express.Router();
var randtoken = require('rand-token');
const jwt_decode = require('jwt-decode');
const e = require('express');

//const Store =  sutil.UserStore;
const Store = sql.UserStore;

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
                
                
                const token = sutil.sign({user: req.body.email});
                let html_str = '<p>Use this link to confirm email, kindly use this <a href="http://localhost:3000/confirmEmail?token=' + token + '">link</a> to reset your password</p>';
                let subject = 'Confirmation email';
                let mailOptions = createOptions(req.body.email, subject, html_str);
                let sent = sendEmail(mailOptions);
                if(sent == 1){
                    resbody.setIssues(10)
                    res.end(resbody.package());
                    return;
                }       
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
            //console.log(result);
            if(result){
                bcrypt.compare(req.body.pass, result.password, (error, hash) => {
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
    const resbody = new sutil.res_obj();
    if(sutil.validate(['email'], req.body)){
        let code = randtoken.generate(8);
        Store.setForgotCode(req.body.email, code, (err) => {
            if(err){
			    resbody.setIssue(7);
			    res.end(resbody.package());
			    return;
            }
        })

        let html_str = '<p>Use this code: ' + code + ' to proceed with updating your password</p>';
        let subject = 'Confirmation code, forgot password';
        let mailOptions = createOptions(req.body.email, subject, html_str);
        let sent = sendEmail(mailOptions);
        if(sent == 1){
            resbody.setIssues(10)
            res.end(resbody.package());
            return;
        }        
    }
    else{
        resbody.setIssues(1)
        res.end(resbody.package());
        return;
    }
});

CoreRouter.post('/validatecode', (req, res) => {
    const resbody = new sutil.res_obj();
    if(sutil.validate(['code'], req.body)){		
		Store.getCodeInfo(req.body.code, (err, result) => {
            if(err){
                resbody.setIssue(7);
                res.end(resbody.package());
                return;
            }
			if(result.code === req.body.code){
				// correct code was used
				resbody.setData({msg: "correct code for fgpass"});
				res.end(resbody.package());
				return;
			}
            else {
                resbody.setData({msg: "no code found, request new code"});
				res.end(resbody.package());
				return;
            }
		})
	}
	
});

// post data here to set a update new password with link
CoreRouter.get('/updatepass', (req, res,next)=> {
    //next();
    const resbody = new sutil.res_obj();
    sutil.verify(req.query.token, (err, type) => { // jwt check
        if(err){
            resbody.setIssue(2); // bad jwt
            res.end(resbody.package());
            return;
        }
    });
    //  code to set pass as token and email them their password
    let token = randtoken.generate(20);
    let decoded = jwt_decode(req.query.token);
    let email = decoded.user;
    let subject = 'Reset Password Token';
    let html_str = '<p>You requested for reset password, kindly use this ' + token + ' to sign in </p>';
    let mailOptions = createOptions(email, subject, html_str)
    let sent = sendEmail(mailOptions);
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
        
        if(hash) {
            Store.setPassword(email, hash, (err) => {
                if(err){
                resbody.setIssue(7);
                res.end(resbody.package());
                }
            });
        }
        else {
            resbody.setIssue(5);
            res.end(resbody.package());
            return;
        }
    });
});

// post data here to set a new password
CoreRouter.post('/newpass', (req, res,next)=> {
    //next();
    const resbody = new sutil.res_obj();
    if(sutil.validate(['email','old_pass','new_pass'], req.body)){
        Store.getUser(req.body.email, (err, result) => { // get the user 
            if(err){
                console.error(err);
                resbody.setIssues(err);
                res.end(resbody.package());
                return;
            }
            //console.log(result);
            if(result){
                bcrypt.compare(req.body.old_pass, result.password, (error, hash) => {
                    if(error){
                        resbody.setIssue(4,"problem de-hashing pass");
                        res.end(resbody.package());
                        return;
                    }
                        
                    if(hash){
                        bcrypt.hash(req.body.new_pass, 10, (err, hash)=>{
                            if(err){
                                resbody.setIssue(4);
                                res.end(resbody.package());
                                return;
                            }        
                           
                            Store.setPassword(req.body.email, hash, (err, results) => {
                                if(err){
                                    resbody.setIssue(7);
                                    res.end(resbody.package());
                                    return;
                                }
                                resbody.setData({msg: "password changed"});
                                res.end(resbody.package());
                                return;
                            });
                        });
                    }
                });
            }
        }); 
    }
    else {
        resbody.setIssues(1)
        res.end(resbody.package());
        return;
    }
});


CoreRouter.get('/confirmEmail', (req,res) => {
    const resbody = new sutil.res_obj();
    sutil.verify(req.query.token, (err, type) => { // jwt check
        if(err){
            resbody.setIssue(2); // bad jwt
            res.end(resbody.package());
            return;
        }
    });
    let decoded = jwt_decode(req.query.token);
    let email = decoded.user;
    Store.setValid(email, (err) => {
        if(err){
            resbody.setIssue(7);
            res.end(resbody.package());
            return;
        }
        
    })

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