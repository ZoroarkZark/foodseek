class writeToConfig {
    constructor() {
        this.fs = require('fs');
    }

    writeFromJSON(json){
        this.fs.writeFile('config.txt', JSON.stringify(json), function(err, result) {
            if(err) console.log('error', err);
        });
    }

    writeFromFile(inFile){
        this.fs.readFile(inFile, function(err, d) {
            if(err) console.log('error', err);
            let data = "";
            data = d.toString();
            this.fs.writeFile('config.txt', data, function(err, result) {
                if(err) console.log('error', err);
            });
        });
    }
}

console.log("Test");
let bee = new writeToConfig();

const newJoke = {
    categories: ['dev'],
    value: "Chuck Norris's keyboard is mad keys because Chuck Norris is always in command."
  };

bee.writeFromJSON(newJoke);

bee.writeFromFile('c2.txt');