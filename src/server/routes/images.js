const express = require('express');
const fs = require('fs');
const path = require('path');


const sutils    = require('../utility/serverutility.js');
const sql       = require('../utility/sqlhandler.js');

const s3 = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');


// use s3.S3Client to get the S3Client class
const bucketName = process.env.BUCKET_NAME;
const bucketReg = process.env.BUCKET_REGION;
const bucketKey = process.env.BUCKET_KEY;
const bucketSecret= process.env.BUCKET_SECRET;

const S3 = new s3.S3Client({
    credentials: {
        accessKeyId: bucketKey,
        secretAccessKey: bucketSecret
    },
    region: bucketReg
})



//const FoodStore = sutils.FoodStore;
const FoodStore   = sql.FoodStore;

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
        
        if(result.vendor != 1){
            return next(3); // bad perms
        }
        
        next();
    });
    
});

ImageRouter.post('/cardUpload', async (req,res,next) => {
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
