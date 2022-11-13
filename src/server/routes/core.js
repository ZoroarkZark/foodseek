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
const { sendEmail, createOptions, res_obj, signUpEmail } = require('../utility/serverutility.js');
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
                
                signUpEmail(req.body.email, (err,didSend) => {
                    if(err){
                        resbody.setIssue(999,'Error sending email');
                        res.end(resbody.package());
                        return;
                    }
                    if(didSend){
                        resbody.setData({msg: "sent confirmation email"});
                        res.end(resbody.package());
                        return;
                    }
                    else{
                        resbody.setIssue(998, 'Some how no error on email send, but no results either');
                        res.end(resbody.package());
                        return;
                    }
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

        fgpssEmail(mailOptions, (err, didSend) => {
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
CoreRouter.post('/updatepass', (req, res,next)=> {
    //next();
    const resbody = new sutil.res_obj();
    if(sutil.validate(['email','pass'], req.body)){       
        bcrypt.hash(req.body.pass, 10, (err, hash)=>{
            if(err){
                resbody.setIssue(4);
                res.end(resbody.package());
                return;
            }
        
            if(hash) {
                Store.setPassword(req.body.email, hash, (err) => {
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
    }
});



CoreRouter.get('/confirmEmail', (req,res) => {
    const resbody = new sutil.res_obj();
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