/*
    Testing the sql calls in here
*/

const sql = require('../utility/sqlhandler.js');

const US = sql.UserStore;
const FS = sql.FoodStore;

const TIME = 2000;

const cb_err = (err) => {
    if(err){
        console.error(err);
        return;
    }
    console.log("no errors")
}

const cb_res = (err, res) => {
    if(err){
        console.error(err);
        return;
    }
    console.log('no errors')
    console.log(res);
}


function runUserTests(test_params, time){

    // US.deleteUser
    setTimeout(()=>{
        console.debug('deleting');
        US.deleteUser(test_params.email,cb_res)
    }, time*0);

    //US.insertUser
    setTimeout(()=>{
        console.debug('inserting');
        US.insertUser({email:test_params.email,pass:test_params.pass, vendor:test_params.vendor},cb_err)
    }, time*1);

    //US.getUser
    setTimeout(()=>{
        console.debug('getting')
        US.getUser(test_params.email,cb_res)
    }, time*2);

    //US.updatePushToken
    setTimeout(()=>{
        console.debug('set push token')
        US.updatePushToken(test_params.email,test_params.push,cb_res)
    }, time*3);

    //US.getPushToken
    setTimeout(()=>{
        console.debug('get push token')
        US.getPushToken(test_params.email,cb_res)
    }, time*4);


    // US.updateUserData
    setTimeout(()=>{
        console.log('Update user data')
        US.updateUserData(test_params.email, test_params.data, cb_res);
    }, time*6);

    //US.setAvatar
    setTimeout(()=>{
        console.log('Setting Avatar');
        US.setAvatar(test_params.email, test_params.avatar,cb_res);
    }, time*7)

    //US.getUser again for results
    setTimeout(() => {
        console.log("Getting one last time")
        US.getUser(test_params.email, cb_res);
    }, time*8)

}

function runFoodTests(test_params, time){
    setTimeout(()=>{
        console.log("Upload Card")
        FS.uploadMore(test_params.pack, cb_err); 
    },time*0)

    setTimeout(()=>{
        console.log("Get All Cards")
        FS.getCardsAll(cb_res); 
    },time*1)
    
    setTimeout(()=>{
        console.log("Get Cards in range")
        FS.getCardsByRange(test_params.pos, test_params.dist, cb_res); 
    },time*2)

    setTimeout(()=>{
        console.log("Cards by vendor")
        FS.getCardsVendor(test_params.pack.vendor, cb_res);
    },time*3)

    setTimeout(()=>{
        console.log("Reserve a card")
        FS.getCardsAll((err, res) => {
            if(err) throw err;
            if(res.length >0){
                console.log(res[0].id);
                FS.reserveCard(res[0].id, test_params.user, cb_res);
            }
            else{
                console.log("no cards");
            }
        })
    },time*4)

    setTimeout(()=>{
        console.log("Cancel reservation")
        FS.cancelReservation(test_params.user, cb_res); 
    },time*5)

    /*
    setTimeout(() => {
        console.log("delete a card");
        FS.getCardsAll((err, res) => {
            if(err) throw err;
            let id = res[0].id;
            FS.deleteCardsById(id,cb_res);
        })
    
    },time*6)
*/
    setTimeout(()=>{
        console.log("Edit")
        FS.getCardsAll((err, res) => {
            if(err) throw err;
            FS.editCardData(res[0].id, test_params.edit_data, cb_res);
        }) 
    },time*7)
}


let user_valid_test = {
    email: "zazaoeey",
    pass: "pass",
    vendor: 1,
    push: "zazapoooushy",
    data: {
        travel: "walk",
        allergies: ["cheese"]
    },
    avatar: "The Navi"
}

let user_invalid_test = {
    email: 123,
    vendor: true,
    push: "zazapoooushy",
    avatar: [1,2]
}



let food_valid_test = {
    pack: {
        item: "name",
        tags: ["tag"],
        loc: [1,2],
        vendor: "steve",
        timestamp: new Date().getTime() / (60000),
    },
    pos: {lat:1,lon:2},
    dist: 5,
    user: "scuba",
    edit_data: {
        item: "submarine",
        tags: ["metal"]
    }
}

let food_invalid_test = {
    pack: {
        item: "name",
        tags: ["tag"],
    },
    pos: [1,2],
    dist: null,
    user: 123,
    edit_data: 1
}




/* setTimeout(()=>{
    runUserTests(user_valid_test,2000);
},0)

setTimeout(()=>{
    runUserTests(user_invalid_test,2000)
},25000)

setTimeout(()=>{
    runFoodTests(food_valid_test,2000)
},50000) */

setTimeout(()=>{
    runFoodTests(food_invalid_test,2000)
},0)