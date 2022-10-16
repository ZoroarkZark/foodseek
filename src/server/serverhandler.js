const http = require('node:http'); // http library from Node.js

// http.request(url, options, callback)
// URL : defines the action to request from the server ( a string to a resource)
// Options: is an object with some options for the connection:
//  important options: method, host, port, timeout

// Optional overload http.request(options, callback) and specify the url as the path option


class ServerInterface{
    constructor(base){ // default options for our request (server should be the same across all calls)
        this.req.host = base.host;
        this.req.port = base.port;
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
     *  createAccount(user_info, (results) => {
     *      if(results.issue == 0){ // sucessful sign up logic}
     *      if(results.issue == 1){ // account already exists logic (take to login screen)}
     *      else{
     *          // something bad happened to get here so idk 
     *      }
     * })
     */
    createAccount(credentials, callback){
       
        credentials = JSON.stringify(credentials); // create it as a string
        
        var options = {
            host: this.req.host,
            port: this.req.port,
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
                callback(JSON.parse(chunk)); // callback on the recieved data
            });
           
        });

        request.on('error', (err) => { throw err;})

        request.write(credentials); // write the credentials to the request body
        request.end(); // end the request

    }
}

const SI = new ServerInterface({host: "localhost", port: 3000});

SI.createAccount(
    {
        email: "marzipan",
        pass: "lovely",
        isVendor: 1
    },

    (results) => {

    }
)
