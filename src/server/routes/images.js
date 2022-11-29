const express = require('express');
const fs = require('fs');
const path = require('path');


const sutils    = require('../utility/serverutility.js');
const sql       = require('../utility/sqlhandler.js');


//const FoodStore = sutils.FoodStore;
const FoodStore   = sql.FoodStore;
const UserStore   = sql.UserStore;
const ImageRouter = express.Router();

module.exports = {
    ImageRouter: ImageRouter
};


ImageRouter.use('', (req,res, next) => {
    console.log('Images request');
    
    let header_data = (req.get('Custom-Json')) ? JSON.parse(req.get('Custom-Json')) : null;
    console.log(header_data);
    if(!sutils.validate(['jwt'], header_data)){ // Validate the body and jwt field, header for the image upload
        
        return next(1); // fields not passed
    }
    sutils.verify(header_data['jwt'], (err, result) => { // jwt check
        if(err){
            return next(2); // bad authorization 
        }
        
        res.locals.jwt_data = result;
        
        return next();
    });
    
});

ImageRouter.post('/imgtest', async (req,res,next) => {

    req.setEncoding('base64');
    
    //console.log('In Img test');
    let resbody = res.locals.resbody;
    let chunks = [];
    let in_data = req.get('Custom-Json');
    
    in_data = JSON.parse(in_data); // parse the input data
    
    if(!sutils.validate(['item','loc','tags','timestamp','vendor'],in_data)){
        return next(1); // missing upload keys
    }
    
    // request is split into multiple iterations so collect all the passed data into the array chunks
    req.on('data', (data) => {
        console.log('image chunk recieved recieved');
        let buff =  Buffer.from(data,'base64');
        chunks.push(buff);
    });
    
    req.on('end', async ()=> {
        let fname = sutils.genToken(20);
        fname = `${fname}.jpeg`;

        sutils.imgUpload(fname, chunks, (err, img_link) => {
            if(err){
                return next(err);
            }

            let food_card = {
                item: in_data.item,
                loc: in_data.loc,
                tags: in_data.tags,
                timestamp: in_data.timestamp,
                img_url: img_link,
                vendor: in_data.vendor
            }
            FoodStore.uploadMore(food_card, (err) => {
                if(err){
                    return next(err); // SQL error 
                }
                
                resbody.setData({msg:"Foodcard completed uploaded", link:img_link});
                //removeFile(fileName); // remove the local file from storage
                return next();
                
            });
        })
    });

    req.on('error', (err)=> {
        return next(err); 
    })
});

ImageRouter.post('/avatarUpload', async (req, res, next) => {
    let user = res.locals.jwt_data.user;
    req.setEncoding('base64');
    
    //console.log('In Img test');
    let resbody = res.locals.resbody;
    let chunks = [];
    
    // request is split into multiple iterations so collect all the passed data into the array chunks
    req.on('data', (data) => {
        console.log('image chunk recieved recieved');
        let buff =  Buffer.from(data,'base64');
        chunks.push(buff);
    });
    
    req.on('end', async ()=> {
        let fname = sutils.genToken(20);
        fname = `${fname}.jpeg`;

        sutils.imgUpload(fname, chunks, (err, img_link) => {
            if(err){
                return next(err);
            }

            UserStore.setAvatar(res.locals.jwt_data.user, fname, (err, res)=>{
                if(err) return next(7);
                resbody.setData({msg:`Set ${user} avatar to file : ${fname}`});
                return next();
            })
        })
    });

    req.on('error', (err)=> {
        return next(err); 
    })
})