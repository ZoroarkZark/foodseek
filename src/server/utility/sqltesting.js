const SQL = require('./sqlhandler.js');
let FoodStore = SQL.FoodStore;

const TESTS = {
    "upload":
        {
            "item1": {loc : [36.7211, -122.2221] , tags : "myitem", cusine : "italian", 
                item : "pizza" , vendor : "talk with my hands pizza" , img_url : "myurl"},
            "item2": {loc : [36.9420, -122.3000], tags : "myimage", cusine : "poopoo", 
                item : "toilet" , vendor : "talk with my ass delicacies", img_url : "myurl" }
            
        },
    "getcardsR": 
        {
            "item1": {pos : {lat : 36.2222, lon : -122.4233} , max_dist : 10} ,
            "item2": {pos : {lat : 36.2100, lon : -122.3000} , max_dist : 10}
            
        },
        "getcardsV":
        {
            "vend1": {vendor : "Wennie hut junior"} ,
            "vend2": {vendor : "Cals burweeedos"},
            "vend3": {vendor : "Breaking Breakfast"}
            
        }
        
}

function callUpload(items){
    for(let i in items){
        //console.log("in cU")
        //console.log(items[i])
        FoodStore.uploadMore(items[i], (err) => {
            if(err) {
                console.log(err);
            }
            else {
                console.log("success")
            }
        });
    }
}

function callrange(items){
    for(let i in items){
        //console.log("in range")
        //console.log(i)
        //console.log(items[i])
        FoodStore.getCardsByRange(items[i].pos, items[i].max_dist, (err, res) => {
            if(err) {
                console.log(err);
            }
            else {
                console.log("results:")
                console.log(res)
            } 
        })
    }
 }
for(let i in TESTS){
    console.log("for loop")
    console.log(i);
    console.log(TESTS[i]);

    if(i == "upload"){
       // callUpload(TESTS[i]);
    }
    if(i == "getcardsR"){
        //console.log(i);
        callrange(TESTS[i]);
    }

} 