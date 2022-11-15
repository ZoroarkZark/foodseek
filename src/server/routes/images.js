const express = require('express');
const fs = require('fs');
const path = require('path');


const sutils    = require('../utility/serverutility.js');
const sql       = require('../utility/sqlhandler.js');

const s3 = require('@aws-sdk/client-s3');
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
    let resbody = new sutils.res_obj();

    let header_data = (req.get('Custom-Json')) ? JSON.parse(req.get('Custom-Json')) : null;

    if(!sutils.validate(['jwt'], header_data)){ // Validate the body and jwt field, header for the image upload
        resbody.setIssue(1);
        res.end(resbody.package());
        return;
    }
    sutils.verify(header_data['jwt'], (err, result) => { // jwt check
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

});

ImageRouter.post('/imgtest', async (req,res) => {
    let resbody = new sutils.res_obj();
    req.setEncoding('base64');

    let file = req.query.file;
    
    let chunks = [];

    let in_data = req.get('Custom-Json');
    in_data = JSON.parse(in_data);

    req.on('data', (data) => {
        let buff =  Buffer.from(data,'base64');
        //console.log(buff);
        chunks.push(buff);
    });

    req.on('end', async ()=> {
        //console.log(chunks);
        let data = Buffer.concat(chunks);

        let data_str = ''+data;
        let mime = getMime(data_str.split(',')[0]);
        let fileName = `${sutils.genToken(20)}${getExt(mime)}`;
        // make da image locally 
        fs.writeFile(path.resolve(__dirname, fileName), data_str.split(',')[1], {encoding:'base64'}, (err) => {
            if(err) throw err;
            console.log("wrote to file");

            fs.readFile(path.resolve(__dirname, fileName), async (err,data) => {
                if (err) throw err;
                let com = new s3.PutObjectCommand({
                    Bucket: bucketName,
                    Key: fileName,
                    Body: data,
                    ContentType: in_data.mime,
                })
        
        
                await S3.send(com)
                .then( (data) => {console.log(data)})
                .catch( (err) => {console.log(err);}) 
                
                fs.unlink(path.resolve(__dirname, fileName), (err) => {
                    if(err) throw err;
                    
                    resbody.setData({msg:"uploaded image successfully"});
                    res.end(resbody.package());
                    return;

                });
    
            })

        }) 


    });

    req.on('error', (err)=> {
        resbody.setIssues(err);
        res.end(resbody.package());
        return;
    })
});


function getMime(string){
    let str = string.split(";");
    str = str[0];
    str = str.split(":")[1];
    //console.log(str);
    return str;
}

function getExt(mime){
    let str = mime.split('/')[1];

    return `.${str}`;
}