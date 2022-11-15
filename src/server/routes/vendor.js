const express = require('express');
const { res_obj } = require('../utility/serverutility.js');


const sutils    = require('../utility/serverutility.js');
const sql       = require('../utility/sqlhandler.js');

//const FoodStore = sutils.FoodStore;
const FoodStore   = sql.FoodStore;

const VendorRouter = express.Router();

module.exports = {VendorRouter};

// Vendor Validation
// Check for body and JWT : return error 1 if neither present
// Check for valid jwt    : return error 2 if invalid jwt
// check for user type    : return error 3 if user is not a vendor
VendorRouter.use('', (req,res, next) => {
    let resbody = new sutils.res_obj();
    req.setEncoding('utf8');

    let custom_json = (req.get('Custom-Json')) ? JSON.parse(req.get('Custom-Json')) : null;

    if(!sutils.validate(['jwt'], req.body) && !sutils.validate(['jwt'], custom_json)){ // Validate the body and jwt field
        resbody.setIssue(1);
        res.end(resbody.package());
        return;
    }
    console.log("verify jwt")
    sutils.verify(req.body.jwt, (err, result) => { // jwt check
        console.log("back in vendor.js");
        if(err){
            console.log(err);
            resbody.setIssue(2); // bad jwt
            res.end(resbody.package());
            return;
        }

        if(result.vendor != 1){
            resbody.setIssue(3); // not a vendor type 
            res.end(resbody.package());
            return;
        }

        next();
    });

})


// upload a food card to the FoodStore
VendorRouter.post('/upl', (req,res) => {
    let resbody = new sutils.res_obj();
    
    // our app.use should have hopefully done all the error checking and verifying
    if(sutils.validate(['item'], req.body)){
        FoodStore.uploadItem(req.body.item, req.body.vendor, (err) => {
            if(err){ // didnt upload successfully
                console.log("Err");
                resbody.setIssue(7);
                res.end(resbody.package());
                return;
            }

            resbody.setData({
                msg: "upladed card!"
            });
            res.end(resbody.package());
            return;
        });

    }
    else{
        resbody.setIssue(1);
        res.end(resbody.package());
        return;
    }

});

VendorRouter.post('/upl2', (req,res) => {
    let resbody = new sutils.res_obj();
    
    if(sutils.validate(['item','loc','tags','timestamp'], req.body)){
        let pkg = {
            item: req.body.item,
            loc: req.body.loc,
            tags: req.body.tags,
            timestamp: req.body.timestamp
        }

        FoodStore.uploadMore(pkg, (err) => {
            if(err){
                console.debug(err);
                resbody.setIssue(7);
                res.end(resbody.package());
                return;
            }

            resbody.setData({msg: "uploaded card"});
            res.end(resbody.package());
            return;
        })
    }
    else{
        resbody.setIssue(1);
        res.end(resbody.package());
        return;
    }
});

VendorRouter.post('/imgtest',(req,res) => {
    let resbody = new res_obj();
    req.setEncoding('base64');

    let file = req.query.file;
    
    let chunks = [];

    let in_data = req.get('Custom-Json');
    req.locals.card_data = JSON.parse(in_data);

    req.on('data', (data) => {
        let buff =  Buffer.from(data, 'base64');
        chunks.push(buff);
    });

    req.on('end', ()=> {
        let data = Buffer.concat(chunks);
        let str = ''+data;
        let img_str = str.split(',');
        console.log(req.locals.card_data);
        fs.writeFile(path.resolve(__dirname, file), img_str[1], {encoding: 'base64'}, (err) => {
            if(err) throw err;
            console.log("wrote to file");
        })
        resbody.setData({"msg":"uploaded img"});

    });

    /* console.log(req.body);
    let buff = Buffer.from(req.body, 'base64');

    fs.writeFile('test.png', buff, (err) => {
        if (err) throw err;
        console.log("saved file");
    })

    res.end(JSON.stringify({"msg":"got img"}));
    return; */
})


// delete a card from the foodstore
VendorRouter.post('/del', (req,res) => {
    let resbody = new sutils.res_obj();

    if(sutils.validate(['id'], req.body)){
        FoodStore.deleteCard(Number(req.body.id), (err) => {
            if(err){
                resbody.setIssue(7);
                res.end(resbody.package());
                return;
            }
            

            resbody.setData({
                msg: "deleted object"
            });
            res.end(resbody.package());
            return;
        });
    }
    else{
        resbody.setIssue(1);
        res.end(resbody.package());
        return;
    }
});

// confirm a pickup with a user and foodcard id
VendorRouter.post('/conf', (req,res) => {
    let resbody = new sutils.res_obj();

    if(sutils.validate(['user','id'], req.body)){
        FoodStore.getCard(req.body.id, (err, result) => {
            if(err || !result){
                resbody.setIssue(7);
                res.end(resbody.package);
                return;
            }


            if(result.id == req.body.id){
                if(result.reserved == req.body.user){

                    // want to remove the card after a successful confirmation
                    resbody.setData({
                        msg: "confirmed pickup!"
                    });
                    res.end(resbody.package());
                    return;
                }
            }
            else{
                resbody.setIssue(7);
                res.end(resbody.package());
                return;
            }


        })
    }
});

VendorRouter.post('/checkres', (req,res) => {
    let resbody = new sutils.res_obj();

    if(sutils.validate(['vendor'], req.body)){
        FoodStore.getVendorReserved(req.body.vendor, (err, results) => {
            if(err){
                resbody.setIssue(7);
                res.end(resbody.package());
                return;
            }

            resbody.setData({
                msg:"Get reserved cards",
                cards: results
            });
            res.end(resbody.package());
            return;
        })
    }
    else{
        resbody.setIssue(1);
        res.end(resbody.package());
        return;
    }
})

VendorRouter.post('/list', (req,res) => {
    let resbody = new res_obj();

    if(sutils.validate(['vendor'])){
        FoodStore.getCardsVendor(req.body.vendor, (err, results) => {
            if(err){
                resbody.setIssue(7);
                res.end(resbody.package());
                return;
            }

            if(results){
                resbody.setData({
                    msg: "got vendor cards",
                    cards: results
                });
                res.end(resbody.package());
                return;
            }

            resbody.setData({
                msg: "no cards for this vendor",
                cards: null
            });

            res.end(resbody.package());
            return;

        })
    }
});