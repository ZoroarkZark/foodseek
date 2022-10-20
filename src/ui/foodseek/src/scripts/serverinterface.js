// Going to use fetch to make requests to our server

// default options to pass to server
// this will most likely end up in a .env somewhere
const default_options = {
    host: "localhost",
    port: 3000,
}

function getPath(host,port,path){
    return `http://${host}:${port}${path}`;
}

const xmlProm = (cb) => {
    let test = new XMLHttpRequest(); // request object 

    test.open("POST", "http://108.90.204.32:80/test_post",true); // create little baby connection
    test.responseType = "json"; // what we expect to recieve
    test.setRequestHeader('Content-type', 'application/json; charset=utf-8'); // what we intend to send

    test.send(
        JSON.stringify({
            bobby: "boslay"
        })
    ); // send itty bitty data

    console.log(test.readyState);

    test.onload = () => {
        console.log(`Loaded ${test.status}`);
        return cb(test.response);
    }  // load some itty bitty data

    console.log(test.readyState);

    test.onerror = () => {
        console.error(`Network err ${test.status}`);
        return cb({test: "error"});
    } // rock nation

    console.log(test.readyState);

    test.onprogress = (event) => {
        console.log(`Recieved Event: ${event.loaded} of ${event.total}`);
    }
    console.log(test.readyState);
}



//Server Interface class
// This represents the device essentially
// It will be responsible for performing requests for the user
class ServerInterface{
    // default constructor has no options and should be set at somepoint
    constructor(options = {}){
        this.state = "stateful"; // temp var just to show we have access to this instantiated class in multiple pages
        
        this.host = "localhost"; // these two should most likely become .env variables or what ever .env == in mobile app dev
        this.port = 3000;

        this.auth = ""; // auth cookie (initially null until a user signs in)

    }

    // set items
    setHost(host){
        this.opt.host = host;
    }
    setPot(port){
        this.opt.port = port;
    }

    // backwards compat for example
    getState(){
        console.log(this.state);
        return this.state
    }
    setState(iny){
        this.state = iny;
    }


    //Actual Fetch code
    // all of this needs to be Async bc its http requests
    /*
    async fetchTest(){
        let resource = new URL("http://108.90.204.32:80/test_post") // URL
        console.log(resource);
        //Options for request (sends the body as well)
        let options  = { 
                method: 'POST',
                headers: {
                    'Content-Type': `application/json`
                },
                body: JSON.stringify({
                    test: "1234caliscool1234"
                })
        }

        console.log("pre request");
        
        const req = await fetch(resource,options)
        req.then((response) => response.json())
        req.then( (json) => {
            console.log('succ:',json);
        })
        .catch( (err) => {
            console.debug(err);
        });

        console.log("after request");
    }
    */
   // possibly god tier other built in request module 

    xmlTest(cb){
        let test = new XMLHttpRequest(); // request object 

        test.open("POST", "http://108.90.204.32:80/test_post",true); // create little baby connection
        test.responseType = "json"; // what we expect to recieve
        test.setRequestHeader('Content-type', 'application/json; charset=utf-8'); // what we intend to send
        test.timeout = 3000;

        test.send(
            JSON.stringify({
                bobby: "boslay"
            })
        ); // send itty bitty data

        console.log(Object.keys(test));
        test.onload = () => {
            console.log(`Loaded ${test.status}`);
            return cb(test.response);
        }  // load some itty bitty data

        test.onerror = () => {
            console.error(`Network err ${test.status}`);
            return cb({test: "error"});
        } // rock nation

        test.onprogress = (event) => {
            console.log(`Recieved Event: ${event.loaded} of ${event.total}`);
        }

    }

    xmlT2(cb){
        return xmlProm(cb);
    }
    //create a new account given credentials
    signup(){}
    // login to an existing acc given credentials
    login(){}
    // logout of an existing acc
    logout(){}
    // display a food list : should only work for users or something
    foodlist(){}





}


export const SI = new ServerInterface();