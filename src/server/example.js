const ServerInterface = require('./serverhandler.js'); // get the package

const SI = new ServerInterface({host: "localhost", port:3000});


// Create a random user
var rid = Math.random(); // generate random num
rid = Math.floor(rid*100000);
var userid = `user${rid}`;

var user_credentials = {
    email: userid,
    pass: "password",
    vendor: 0
}


// start by creating an account 
SI.createAccount(user_credentials, (body) => {
    body = JSON.parse(body);
    if(body.issue == 0){ // no issue 
        console.log(`Created user ${user_credentials.email} with pass ${user_credentials.pass}`);
        return;
    }
    if(body.issue == 1){ // duplicate entry
        console.log(`User ${user_credentials.email} already exists in DB`);
        return;
    }
    else{ // front end be afraid
        console.log('Bigger issue');
    }
})

// try to login after a little while
// this is because it will send multiple concurrent requests if not spaced apart
// simulate a user going through the flow taking time to make the requests
setTimeout(() => {
    SI.loginUser(user_credentials, (body) => {
        body = JSON.parse(body);
        if(body.issue == 0){ // valid login
            console.log(`User ${user_credentials.email} signed in!`)
            return;
        }
        if(body.issue == 1){
            console.log(`User ${user_credentials.email} does not exist`);
            return;
        }
        if(body.issue == 2){
            console.log(`Password : ${user_credentials.pass} did not match`);
            return;
        }
        else{
            console.log("bigger issue");
        }
        
    });
}, 2000);

// Do user only function
setTimeout(() => {
    SI.test_user( (body) => {
        body = JSON.parse(body);
        if(body.issues == 0){
            console.log("Signed in user action");
            return;
        }
        console.log("User not signed in!");
    });
}, 4000);

setTimeout(() => {
    SI.logoutUser( (body) => {
        body = JSON.parse(body);
        if(body.issue != 0){
            console.log("Error signing out user");
            return;
        }
        console.log("User signed out");

    });
}, 6000)

setTimeout(() => {
    SI.test_user( (body) => {
        body = JSON.parse(body);
        if(body.issues == 0){
            console.log("Signed in user action");
            return;
        }
        console.log("User not signed in!");
    });
}, 8000);
