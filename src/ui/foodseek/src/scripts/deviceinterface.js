
class res_obj {
    // defualt constructor
    // all fields set to uninitilized

    constructor(){
        this.success = 0;
        this.data = null;
        this.issues = null;
    }


    // only call one of these

    // on success 
    // set the returned data 
    setData(data){
        this.success = 1;
        this.data = data;
    }

    // on failure of operation
    // set the returned issue
    setIssues(issues){
        this.success = 0;
        this.issues = issues;
    }

    setIssue(code, msg){
        this.success = 0;
        this.issue = {
            error: code,
            message: msg
        }
    }

    // just return the string version of this object
    package(){
        return JSON.stringify(this);
    }
    
}


function xhrRequest(url, method, payload, cb){
    //ignore payload on get requests
    payload = (method==="GET") ? null : payload;

    let xhr = new XMLHttpRequest();
    xhr.open(method,url);
    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8'); // what we intend to send
    xhr.responseType = "json";
    
    xhr.send(JSON.stringify(payload));

    xhr.onload = () => {
        //console.log('loaded!');
        return cb(null, xhr.response);
    }

    xhr.onerror = () => {
        console.log("error");
        let err_res = new res_obj();
        err_res.setIssue(xhr.status,"HTTP request error");
        return cb(err_res,null);
    }

}

function buildURL(root,path){
    
    return `http://${root}/${path}`;
}

class Device {
    constructor(host,port){
        this.token = "";
        this.root = `${host}:${port}`;
    }


    test(meth,payload, callback){
        let path = buildURL(this.root,"test");

        xhrRequest(path, meth, payload, (err, response) => {
            if(err){
                return callback(err,null);
            }

            return callback(null,response);
        } )
    }

    signup(payload, callback ){
        let path = buildURL(this.root,'signup');

        xhrRequest(path,"POST", payload, (err, response) => {
            if(err){
                return callback(err,null);
            }

            return callback(null,response);
        })
    }

    login(payload, callback){
        let path = buildURL(this.root, 'login');

        xhrRequest(path, "POST", payload ,(err, response) => {
            if(err){
                return callback(err,null);
            }

            this.token = response.data.jwt; // get the token

            return callback(null, response);
        })
    }
    
    // set token to nothing to invalidate any requests until token is reset
    logout(){
        this.token = "";
    }

    uploadCard(card_data, callback){
        let path = buildURL(this.root,'food/upl');

        payload = card_data;
        payload.jwt = this.token;

        xhrRequest(path,"POST", payload, (err, response) => {
            if(err){
                return callback(err,null);
            }

            return callback(null,response);
        });
    }


    getCards(payload, callback){
        let path = buildURL(this.root,'food/list');

        payload.jwt = this.token;

        xhrRequest(path,"POST",payload, (err,response) => {
            if(err){
                return callback(err,null);
            }

            return callback(null,response);
        })
        
    }

}

export const DeviceInstance = new Device("108.90.204.32", "80");