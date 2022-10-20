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

//Server Interface class
// This represents the device essentially
// It will be responsible for performing requests for the user
class ServerInterface{
    // default constructor has no options and should be set at somepoint
    constructor(options = {}){
        this.state = "stateful";
        this.host = "localhost";
        this.port = 3000;
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
    async fetchTest(){
        let resource = new URL("http://108.90.204.32:80/test_get") // URL
        console.log(resource);
        //Options for request (sends the body as well)
        let options  = { 
                method: 'GET',
                headers: {
                    'Content-Type': `application/json`
                },
        }

        console.log("pre request");
        
        fetch(resource,options)
        .then((response) => response.json())
        .then( (json) => {
            console.log('succ:',json);
        })
        .catch( (err) => {
            console.debug(err);
        });

        console.log("after request");
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


export const SI = new ServerInterface(default_options);