const { getRandomValues } = require('crypto');

class writeToConfig {
    constructor() {
        this.fs = require('fs');
    }

    //Takes in a json object and overwrites the config file with that object
    writeFromJSON(json){
        this.fs.writeFile('config.txt', JSON.stringify(json), function(err, result) {
            if(err) console.log('error', err);
        });
    }

    //reads from the config file and prints it to the display
    displayConfig(){
        this.fs.readFile('config.txt',  (err, data) => {
            if (err) console.log('error', err);
            console.log(data.toString());
        });
    }

    //edit parameter, if the parameter exists
    //creates the parameter if it doesn't NOT YET
    //does nothing if it doesnt exist
    editValue(key, value){
        this.fs.readFile('config.txt',  (err, data) => {
            if (err) console.log('error', err);
            //var a = 0;
            let json = JSON.parse(data.toString());
            Object.keys(json).forEach(function(k) {
                //console.log(k);
                if (k == key) {
                    json[k] = value;
                    //a = 1;
                }
                /*let obj = {key: value}
                if (a == 0) this.setState(this.state.concat(obj));*/
            });
            this.writeFromJSON(json)
        });
    }

    //remove parameter, if it exists
    //do nothing if it doesnt

    //get parameter, if it exists
    //return some bs if it doesnt
    getValue(key){
        this.fs.readFile('config.txt', (err, data) => {
            if (err) console.log('error', err);
            let json = JSON.parse(data.toString());
            Object.keys(json).forEach(function(k) {
                if (k == key){ 
                    return json[k];
                }
            });
        });
    }
}

let butt = new writeToConfig();
butt.editValue("name", "WHOA PRObLEM");
let val = butt.getValue("name");
console.log(val);