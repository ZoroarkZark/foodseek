// Core Routes for the server
// Create Account : /signup
// Login          : /login
// Logout         : /logout 
// Forgot Pass    : /fgpass

const express = require('express')

const res_obj = require('../utility/serverutility.js')
const DBHandler = require('../utility/sqlhandler.js')

const CoreRouter = express.Router()
const DB = new DBHandler()



// handle signups
CoreRouter.post('/signup', (req, res) => 
{
    // this is our standard response object being sent to the client in the res.body
    const resbody = new res_obj();

    if(req.body) // body data present
    {
        // all valid fields are email, pass, vendor
        if(req.body.email && req.body.pass && req.body.vendor)
        {
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
            })
        }
        else{
            issues = {
                error: 2,
                msg  : "incorrect parameters passed"
            }
            resbody.setIssues(issues);
            res.end(resbody.package());
        }

    }
    else{
        // no body data = error 1 cause its the first one we got
        issues = {
            error: 1,
            msg:  "no body data in request"
        }
        resbody.setIssues(issues);

        res.end(resbody.package()); // send back
    }

});

// handle logins
CoreRouter.post('/login', (req, res) => {});

//log user out (just set their token to null)
CoreRouter.get('/logout', (req, res) => {});

// send an email to a user to let them reset their pass word
CoreRouter.post('/fgpss', (req, res) => {});

// post data here to set a new password
CoreRouter.post('/newpass', (req, res)=> {});
