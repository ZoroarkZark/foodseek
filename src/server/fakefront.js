const http = require('node:http'); // http library from Node.js


// http.request(url, options, callback)
// URL : defines the action to request from the server ( a string to a resource)
// Options: is an object with some options for the connection:
//  important options: method, host, port, timeout

// Optional overload http.request(options, callback) and specify the url as the path option


// Standard Signup/Login Flow response/request object
/*
    request signup
    obj {
        issue: [0:none, ]
        user_email: input_email,
        user_pass: input_pass,
        isVendor: input_isVendor
    } -> POST to server/signup

    response signup 
    obj: {
        issue: [0: none, 1: email already exists in database, 2: some other err ]
    }
    auto redirect to login on sucess


    request login
    obj {
        issue: [0:none,]
        user_email: in_email,
        user_pass: in_pass,
    }

    response login
    obj: {
        issue: [0: none, 1: no email found, 2: incorrect pass, 3: some other err]
        user_email: email,
        user_pass: pass,
        isVendor: isVendor,
    }
*/


// signup Request
// default object 
signup_object = {
    hostname: "localhost",
    port: 3000,
    path: '/signup',
    method: 'post',
    
}

function createAccount(req, in_email, in_pass, vendor){

    var userdata = JSON.stringify({
        email: in_email,
        pass: in_pass,
        isVendor: vendor
    });

    req.headers = {
        'Content-Type': 'application/json',
        'Content-Length' : Buffer.byteLength(userdata)
    }
    
    var request = http.request(req, (res) => {
        console.log(`Code ${res.statusCode}`);
        console.log(`Headers ${JSON.stringify(res.headers)}`);
        
        res.on('data', (chunk) =>{
            console.log(JSON.parse(chunk));
        });
    
        res.on("end", () => {
            console.log("finished request/response cylce");
        })
    }
    );

    request.write(userdata);
    request.end();
    
}


createAccount(signup_object, "adam1234", "pass1234");