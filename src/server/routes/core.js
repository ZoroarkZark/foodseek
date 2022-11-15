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
const { sendEmail, createOptions, res_obj } = require('../utility/serverutility.js');
const CoreRouter = express.Router();
var randtoken = require('rand-token');
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
    let resbody = new sutil.res_obj();
    
    req.setEncoding('utf8');
    if(sutil.validate(['email','pass','vendor'], req.body)){
        
        sutil.bHash(req.body.pass, (err, hash)=>{
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
                    resbody.setIssue(10)
                    res.end(resbody.package());
                    return;
                }       
                res.end(resbody.package());
                return;
            });
            
            
        });
    }
    else{
        resbody.setIssue(1)
        res.end(resbody.package());
        return;
    }
    
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
        })

        let html_str = '<p>Use this code: ' + code + ' to proceed with updating your password</p>';
        let subject = 'Confirmation code, forgot password';
        let mailOptions = createOptions(req.body.email, subject, html_str);
        let sent = sendEmail(mailOptions);
        sendEmail(mailOptions, (err, didSend) => {
            if(err){
                resbody.setIssue(999,'Error sending email');
                res.end(resbody.package());
                return;
            }
            if(didSend){
                resbody.setData({msg: "sent forgot password email"});
                res.end(resbody.package());
                return;
            }
            else{
                resbody.setIssue(998, 'Some how no error on email send, but no results either');
                res.end(resbody.package());
                return;
            }
        });
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


