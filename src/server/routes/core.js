// Core Routes for the server
// Create Account : /signup
// Login          : /login
// Logout         : /logout 
// Forgot Pass    : /fgpass

const express = require('express')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const jwt_secret = "tempSecretDoNotUseForProduction";

const sutil = require('../utility/serverutility.js');
//const DBHandler = require('../utility/sqlhandler.js')

const CoreRouter = express.Router()
//const DB = new DBHandler()


const Store = new sutil.UserStore();

module.exports = {CoreRouter}


CoreRouter.use('/test', (req,res)=>{
    if(req.method != "GET"){
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
    if(req.body) // body data present
    {
        // all valid fields are email, pass, vendor
        if(req.body.email && req.body.pass && req.body.vendor)
        {
            console.log("body__got");
            
            bcrypt.hash(req.body.pass, 10, (err, hash)=>{
                if(err){
                    resbody.setIssue(999,"Problem hashing pass");
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
            resbody.setIssues({
                error: 2,
                msg: "invalid fields"
            });
            res.end(resbody.package());
            return;
        }
         
    }
    else{

        req.on('data', (chunk) =>{
            console.log("Got data hella late");
        })
        // no body data = error 1 cause its the first one we got
        resbody.setIssues(1, "No Body data");

        res.end(resbody.package()); // send back
    }

});


// handle logins
CoreRouter.post('/login', (req, res, next) => {
    const resbody = new sutil.res_obj();

    req.setEncoding('utf8');

    if(req.body) // body data
    {
        if(req.body.email && req.body.pass) // correct fields
        {
            Store.getUser(req.body.email, (err, result) => { // get the user 
                if(err){
                    console.error(err);
                    resbody.setIssues(err);
                    res.end(resbody.package());
                    return;
                }

                if(result){
                    bcrypt.compare(req.body.pass, result.pass, (error, hash) => {
                        if(error){
                            resbody.setIssue(999,"problem de-hashing pass");
                            res.end(resbody.package());
                            return;
                        }

                        if(hash){
                            const token = jwt.sign({
                                user: req.body.email,
                                vendor: result.vendor
    
                            }, jwt_secret, {
                                expiresIn: 8000000
                            });
    
                            data = {
                                user: req.body.email,
                                jwt: token,
                                message: "user signed in!"
                            }
    
                            resbody.setData(data);
                            res.end(resbody.package());
                            return;
                        }
                        else{
                            resbody.setIssue(4, "Passwords did not match!");
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
    }
    else{
        resbody.setIssue(1, "no body");
        res.end(resbody.package());
        return;
    }


});

// send an email to a user to let them reset their pass word
CoreRouter.post('/fgpss', (req, res,next) => {
    next();
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