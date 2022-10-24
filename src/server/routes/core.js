// Core Routes for the server
// Create Account : /signup
// Login          : /login
// Logout         : /logout 
// Forgot Pass    : /fgpass

const express = require('express')

const sutil = require('../utility/serverutility.js')
//const DBHandler = require('../utility/sqlhandler.js')

const CoreRouter = express.Router()
//const DB = new DBHandler()
const FakeUserData = require('../tests/FakeUserStore.js')

const Store = FakeUserData.Store;

module.exports = {CoreRouter}


CoreRouter.use('/test', (req,res)=>{
    res.end("Done!");
});

// handle signups
// Checking for fields in the body { email, pass, vendor}
// returns a response_object 
CoreRouter.post('/signup', (req, res) => 
{
    // this is our standard response object being sent to the client in the res.body
    const resbody = new sutil.res_obj();

    console.log('signup!');
    req.setEncoding('utf8');
    if(req.body) // body data present
    {
        // all valid fields are email, pass, vendor
        if(req.body.email && req.body.pass && req.body.vendor)
        {
            console.log("body__got");
            /* Commented out for FakeStore Testing 
            DB.insertUser(req.body.email, req.body.pass, (err) => {
                if(err){ // issue on sign up
                    issues = {
                        error: err.name,
                        msg: err.message
                    };
                    resbody.setIssues(issues);
                    res.end(resbody.package());
                    return;
                }
                
                // successful signup 
                data = {
                    new_user: req.body.email,
                    msg: "successfully created a new account"
                }
                resbody.setData(data);
                res.end(resbody.package());
            })*/
            let credentials = {
                email: req.body.email,
                pass: req.body.pass,
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
            });

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
                }

                if(result){
                    if(result.pass === req.body.pass){
                        data = {
                            user: req.body.email,
                            vendor: result.vendor,
                            jwt: "temptoken",
                            message: "user signed in!"
                        }

                        resbody.setData(data);
                        res.end(resbody.package());
                    }
                }
            })
        }
        else{
            resbody.setIssue(2,`${Object.keys(req.body)} passed : no email or pass found`);
            res.end(resbody.package());
        }
    }
    else{
        resbody.setIssue(1, "no body");
        res.end(resbody.package());
    }


});

//log user out (just set their token to null)
CoreRouter.get('/logout', (req, res,next) => {
    next();
});

// send an email to a user to let them reset their pass word
CoreRouter.post('/fgpss', (req, res,next) => {
    next();
});

// post data here to set a new password
CoreRouter.post('/newpass', (req, res,next)=> {
    next();
});
