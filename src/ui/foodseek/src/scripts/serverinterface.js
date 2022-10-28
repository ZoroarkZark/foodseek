// Going to use fetch to make requests to our server

// default options to pass to server
// this will most likely end up in a .env somewhere
const default_options = {
    host: 'localhost',
    port: 3000,
}

function getPath(host, port, path) {
    return `http://${host}:${port}${path}`
}

// Payload must be a JSON
function xhrRequest(url, method, payload, cb) {
    //ignore payload on get requests
    payload = method === 'GET' ? null : payload

    let xhr = new XMLHttpRequest()
    xhr.open(method, url)
    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8') // what we intend to send
    xhr.responseType = 'json'

    xhr.send(JSON.stringify(payload))

    xhr.onload = () => {
        //console.log('loaded!');
        return cb(null, xhr.response)
    }

    xhr.onerror = () => {
        console.log('error')
        return cb(xhr.status, null)
    }
}

//Server Interface class
// This represents the device essentially
// It will be responsible for performing requests for the user
class ServerInterface {
    // default constructor has no options and should be set at somepoint
    constructor(options = {}) {
        this.state = 'stateful' // temp var just to show we have access to this instantiated class in multiple pages

        this.host = 'http://localhost:3000' // these two should most likely become .env variables or what ever .env == in mobile app dev

        this.auth = '' // auth cookie (initially null until a user signs in)
    }

    // set items
    setHost(host) {
        this.opt.host = host
    }
    setPort(port) {
        this.opt.port = port
    }

    // backwards compat for example
    getState() {
        console.log(this.state)
        return this.state
    }
    setState(iny) {
        this.state = iny
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

    xmlTest(cb) {
        let request = new XMLHttpRequest() // request object

        request.open('POST', `${this.host}/test_post`, true) // create little baby connection
        request.responseType = 'json' // what we expect to recieve
        request.setRequestHeader(
            'Content-type',
            'application/json; charset=utf-8'
        ) // what we intend to send
        request.timeout = 3000

        request.send(
            JSON.stringify({
                bobby: 'boslay',
            })
        ) // send itty bitty data

        request.onload = () => {
            console.log(`Loaded ${request.status}`)
            return cb(request.response)
        } // load some itty bitty data

        request.onerror = () => {
            console.error(`Network err ${request.status}`)
            return cb({ test: 'error' })
        } // rock nation

        request.onprogress = (event) => {
            console.log(`Recieved Event: ${event.loaded} of ${event.total}`)
        }
    }

    //create a new account given credentials
    // callback (err, result)
    signup(credentials, cb) {
        let request = new XMLHttpRequest()

        request.open('POST', `${this.host}/signup`, true)
        request.responseType = 'json'
        request.settimeout = 3000

        request.send(JSON.stringify(credentials))

        request.onload = () => {
            console.log(`Loaded ${request.response}`)
            return cb(request.response)
        }

        // this is just bulky bc we cant import the res_obj here
        request.onerror = () => {
            console.log(`Error ${request.status}`)
            return cb(
                JSON.stringify({
                    success: 0,
                    data: null,
                    issues: {
                        error: request.status,
                        msg: 'network issue',
                    },
                })
            )
        }
    }

    // login to an existing acc given credentials
    // cb
    login(credentials, cb) {
        let request = new XMLHttpRequest()

        request.open('POST', `${this.host}/login`, true)
        request.responseType = 'json' // what we expect to recieve
        request.setRequestHeader(
            'Content-type',
            'application/json; charset=utf-8'
        ) // what we intend to send
        request.timeout = 3000

        request.send(JSON.stringify(credentials)) // send the users credentials to the server

        // Let UI handle getting the JWT token, we may want a convient way to package that for them here tho
        request.onload = () => {
            console.log(`Loaded ${request.status}`)
            return cb(request.response)
        } // load some itty bitty data

        request.onerror = () => {
            console.error(`Network err ${request.status}`)
            return cb(
                JSON.stringify({
                    success: 0,
                    data: null,
                    issues: {
                        error: request.status,
                        msg: 'network issue',
                    },
                })
            )
        } // rock nation
    }
    // logout of an existing acc
    // I don't even think we need this lol
    logout() {}
    // display a food list : should only work for users or something
    foodlist() {}
}

//export const SI = new ServerInterface();
