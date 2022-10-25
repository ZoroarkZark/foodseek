
function makeRequest(request, cb){
    const xhr = new XMLHttpRequest();

    xhr.open(request.method, `https://localhost:3000/${request.url}`);

    xhr.responseType = "json"; // what we expect to recieve
    xhr.setRequestHeader('Content-type', 'application/json; charset=utf-8'); // what we intend to send
    xhr.timeout = 3000;


    let darta = (request.data) ? JSON.stringify(request.data) : "";

    xhr.send(darta);

    xhr.onload = () => {
        console.log(`Loaded ${xhr.status}`);
        return cb(xhr.response);
    }  // load some itty bitty data

    xhr.onerror = () => {
        console.error(`Network err ${xhr.status}`);
        return cb({test: "error"});
    }
}

test = {
    method: "POST",
    url: "signup",
    data: {
        email: "calito123",
        pass: "1233",
        vendor: 0
    }
}

makeRequest(test, (val) => {
    console.log(val);
})