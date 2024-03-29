import { Buffer } from 'buffer';

const endpoint = "http://ec2-54-193-142-247.us-west-1.compute.amazonaws.com:3000/"


/** 
 *  url: path on the server. So '/login', '/signup', '/user/list', .. etc what ever is in the readme
 *  method: 'get' or 'post'
 *  payload: null on a get, stringifies the  passed object on a post (must be a JSON or we will get errors in the request) 
 *  
 *  returns: a promise object representing our res_obj or a internal error
 *  .then( (body) => {// body.data can be found if body.success=1 otherwise body.issues can be found})
 *  .catch( (err) => {// it will only error on networking issues, or parsing. A bad login, or duplicate acc should still return a res_obj just with a non null issues field})
*/

// Add support for images
// Gonna do some testing 
export async function fetchRequest(url, method, payload){
    // get everything ready for the actual fetch call
    url = buildURL(endpoint,url);
    method = method.toUpperCase();
    payload = (method=="GET") ? null : JSON.stringify(payload); //If we have a GET send no body, if we have anything else stringify the body
    console.log(`${method} @ ${url} : payload ${JSON.stringify(payload)}`);

    // actual fetch call
    const resp = await fetch(url, {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        },
        body: payload
    })
    if ( !resp.ok ) { throw new Error(`HTTP error, status = ${resp.status}`) }  // throws an error if fetch call senses an error
    // json representation of fetch response

    if(!resp.ok){ throw new Error("bad network request");}
    return resp.json();
}


function buildURL(end,path){
    return `${end}${path}`;
}

// uploads post image
export async function img (jwt, card, image){
    let url = buildURL(endpoint, 'images/imgtest');
    //console.log(image);
    //let blob = new Blob(image,{type:"image/jpeg"})

    const formData = new FormData();
    formData.append('file',image);

    const response = await fetch(
        url,
        {
            method: "POST",
            headers : {
                'Custom-Json' : JSON.stringify({
                    jwt: jwt,
                    item: card.item,
                    vendor: card.vendor,
                    loc: card.loc,
                    tags: card.tags,
                    timestamp: card.timestamp
                })
            },
            body: formData
        }
    );

    let result = await response.json();
    console.log(result);
    return result;
}
