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
    
    let chunks = [];

    let in_data = req.get('Custom-Json');
    in_data = JSON.parse(in_data);
    console.log(Object.keys(in_data));
    if(!sutils.validate(['item','loc','tags','timestamp','vendor'],in_data)){
        resbody.setIssue(1);
        res.end(resbody.package());
        return;
    }

    // request is split into multiple iterations so collect all the passed data into the array chunks
    req.on('data', (data) => {
        let buff =  Buffer.from(data,'base64');
        chunks.push(buff);
    });

    // after recieving all the data concat all the chunks together
    req.on('end', async ()=> {
        //console.log(chunks);
        let data = Buffer.concat(chunks); // this is our base64 image string

        let data_str = ''+data; // actual string

        let mime = getMime(data_str.split(',')[0]); // get the mime / extension type

        let fileName = `${sutils.genToken(20)}${getExt(mime)}`; // create a file name

        // make da image locally to convert from base64 to binary
        fs.writeFile(path.resolve(__dirname, fileName), data_str.split(',')[1], {encoding:'base64'}, (err) => {
            if(err) throw err;
            console.log("wrote to file");

            // we wrote the local file so now we can send it to amazon
            // get the binary file contents
            fs.readFile(path.resolve(__dirname, fileName), async (err,data) => {
                if (err) throw err;
                // put the actual image in the bucket
                let com = new s3.PutObjectCommand({
                    Bucket: bucketName,
                    Key: fileName,
                    Body: data,
                    ContentType: in_data.mime,
                })
        
                // send the command
                await S3.send(com)
                .then( (data) => {console.log(data);})
                .catch( (err) => {console.log(err);}) 

                // get a link 
                let link = await getLiveURL(fileName);

                let food_card = {
                    item: in_data.item,
                    loc: in_data.loc,
                    tags: in_data.tags,
                    timestamp: in_data.timestamp,
                    img_url: link,
                    vendor: in_data.vendor
                }

                FoodStore.uploadMore(food_card, (err) => {
                    if(err){
                        resbody.setIssue(7);
                        res.end(resbody.package());
                        return;
                    }
                    
                    resbody.setData({msg:"uploaded image successfully", link:link});
                    res.end(resbody.package());

                    removeFile(fileName); // remove the local file from storage

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

function removeFile(fpath){
    fs.unlink(path.resolve(__dirname, fpath), (err) => {
        if(err) throw err;
    });
}

async function getLiveURL(fileName){
    let options = {
        Bucket: bucketName,
        Key: fileName,
    }
    let com = new s3.GetObjectCommand(options);
    let url = await getSignedUrl(S3, com, {expiresIn: 9600})
    return url;
}