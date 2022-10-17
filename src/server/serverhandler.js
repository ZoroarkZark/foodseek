const http = require('node:http'); // http library from Node.js
const { reduce } = require('underscore');

// Standard Signup/Login Flow response/request object
/*
    request signup: You send this to the createAccount function
    obj {
        user_email: input_email,
        user_pass: input_pass,
        isVendor: input_isVendor
    } -> POST to server/signup

    What you will get in the callback of createAccount
    obj: {
        issue: [0: none, 1: email already exists in database, 2: some other err ]
    }
    auto redirect to login on sucess


    request login : loginUser input arguments
    obj {
        user_email: in_email,
        user_pass: in_pass,
    }

    response login : loginUser return to callback
    obj: {
        issue: [0: none, 1: no email found, 2: incorrect pass, 3: some other err]
        user_email: email,
        user_pass: pass,
        isVendor: isVendor,
    }

    request logout : logoutUser no args
    {}

    response logout: callback to args
    {
        issue [0: signed out, 1: not signed out]
    }
*/

// http.request(url, options, callback)
// URL : defines the action to request from the server ( a string to a resource)
// Options: is an object with some options for the connection:
//  important options: method, host, port, timeout

// Optional overload http.request(options, callback) and specify the url as the path option



class ServerInterface{
    constructor(base ={}){ // default options for our request (server should be the same across all calls)
        this.req = {
            host: base.host,
            port: base.port
        }

        this.agent = new http.Agent({
            keepAlive: true,
            timeout: 3000
        })

        this.user_token = ""; // default token is nothing
    }



    /** createAccount(credentials, callback)
     * 
     * @param {JSON} credentials
     *  REQUIRED FIELDS:
     *  - email,
     *  - pass,
     *  - isVendor,
     * 
     * @param {Function} callback 
     *  takes a result parameter 
     *  this is how the response will get handled 
     *  
     * @usage 
     *  ServerInterface.createAccount(user_info, (results) => {
     *      if(results.issue == 0){ // sucessful sign up logic}
     *      if(results.issue == 1){ // take to login bc they have an email }
     *      else { // something outside of the scope of this class happened and needs to be dealt with somewhere else}
     * })
     */

        // Potentially there is a huge error here, In between the request.on('error') and call of the callback function. Idk if we could get an error after recieving all of the info but who knows
    createAccount(credentials, callback){
       
        credentials = JSON.stringify(credentials); // create it as a string to pass to the server 
        
        var options = {
            host: this.req.host,
            port: this.req.port,
            agent: this.agent,
            path: "/signup",
            method: "POST",
            Headers: {
                'Content-Type'  : 'application/json',
                'Content-Length': Buffer.byteLength(credentials)
            }
            
        }; // Form the request object from our default host and port, with path,method and body 

        var request = http.request(options, (res) => { // make the actual request 
            res.setEncoding('utf8');
            res.on('data', (chunk) => {
                console.log(res.headers);
                callback(chunk); // callback on the recieved data : this is the result
            });
           
        });

        request.on('error', (err) => { throw err;}) // this might mean some internal issue with the request idk we might need an error to happen here to know more

        request.write(credentials); // write the credentials to the request body
        request.end(); // end the request

    }




    /**
     * Login User
     * @param {JSON} credentials : user credentials for signing in
     * @param {function} callback : callback function to handle the response body of our server
     */
    loginUser(credentials, callback){
        credentials = JSON.stringify(credentials); // turn it into a string for the request

        var options = {
            host: this.req.host,
            port: this.req.port,
            agent: this.agent,
            path: "/login",
            method: "POST",
            Headers: {
                'Content-Type' : 'application/json',
                'Content-Length': Buffer.byteLength(credentials)
            }
        }

        var request = http.request(options, (res) =>{
            res.setEncoding('utf8');
            res.on('data', (chunk) => {
                var recieved_cookie = res.headers['set-cookie'][0]; // get the jwt token (prolly unsafe cause its just index access and if jwt ended up being cookie #2 wed be fucked)
                var token = recieved_cookie.split(";",1); // get the actaul value portion
                token = token[0].split("=",2)[1]; // get the value
                this.user_token = token; // set the user token
                callback(chunk); // callback on the result
            })
        });

        request.on('error', (err) => { throw err;});
        
        request.write(credentials);
        request.end();
    }

    /**
     * logoutUser
     * @param {function} callback : handle body data from server response
     */
    logoutUser(callback){
        this.user_token = "";
        var options = {
            host: this.req.host,
            port: this.req.port,
            agent: this.agent,
            path: "/logout",
            method: "GET",
            
        }

        var request = http.request(options, (res) => {


            res.setEncoding('utf8')
            res.on('data', (chunk) =>{
                console.log(res.headers);
                callback(chunk);
            });
        });
        
        
        request.on('error', (err) => {throw err;})
        request.end();
    }


    /**
     * test_user: testing to see if we have user sessions still working
     * @param {function} callback: callback to handle body data
     */
    test_user(callback){
        var options = {
            host: this.req.host,
            port: this.req.port,
            agent: this.agent,
            path: "/foodlist",
            method: "POST",
            headers: {
                'Cookie': `jwt=${this.user_token}; expires=${new Date(new Date().getTime() + 86409000)};`
            }
            
        }
        
        var request = http.request(options, (res) => {
            res.setEncoding('utf8');
            res.on('data', (chunk) => {
                console.log(res.headers);
                callback(chunk);
            })
        });

        request.on('error', (err) => {throw err;})
        request.end();
    }
}

module.exports = ServerInterface;