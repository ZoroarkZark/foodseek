const { getRandomValues } = require('crypto');

class writeToConfig {
    constructor() {
        this.fs = require('fs');
    }

    //Takes in a json object and overwrites the config file with that object
    writeFromJSON(json){
        try {
        this.fs.writeFileSync('config.txt', JSON.stringify(json));
        } catch (err) {
            console.error(err);
        }
    }

    //reads from the config file and prints it to the display
    displayConfig(){
        try {
            let data = this.fs.readFileSync('config.txt');
            let json = JSON.parse(data.toString());
            console.log(json);
        } catch (err) {
            console.error(err);
        }
    }

    //edit parameter, if the parameter exists
    //creates the parameter if it doesn't NOT YET
    //does nothing if it doesnt exist
    editValue(key, value){
        try {
            let data = this.fs.readFileSync('config.txt');
            let json = JSON.parse(data.toString());
            json[key] = value;
            this.writeFromJSON(json);
        } catch (err) {
            console.error(err);
        }
    }

    //remove parameter, if it exists
    //do nothing if it doesnt

    //get parameter, if it exists
    getValue(key){
        try {
            let data = this.fs.readFileSync('config.txt');
            let json = JSON.parse(data.toString());
            return json[key];
        } catch (err) {
            console.error(err);
        }
    }
}