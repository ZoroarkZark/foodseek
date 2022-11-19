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

ImageRouter.post('/imgtest', async (req,res) => {
    req.setEncoding('base64');

    let resbody = new sutils.res_obj();
    let chunks = [];
    let in_data = req.get('Custom-Json');

    in_data = JSON.parse(in_data); // parse the input data

    if(!sutils.validate(['item','loc','tags','timestamp','vendor'],in_data)){
        return next(1); // missing upload keys
    }

    // request is split into multiple iterations so collect all the passed data into the array chunks
    req.on('data', (data) => {
        let buff =  Buffer.from(data,'base64');
        chunks.push(buff);
    });

    // Recieve a base64 url of the image
    // the base64 will contain the mime type and img data
    // convert the base64 to the actual image using the mimetype 
    // upload the actual img to amazon
    // get a link
    req.on('end', async ()=> {
        //console.log(chunks);
        let data = Buffer.concat(chunks); // this is our base64 image string

        let data_str = ''+data; // actual string

        let mime = getMime(data_str.split(',')[0]); // get the mime / extension type

        let fileName = `${sutils.genToken(20)}${getExt(mime)}`; // create a file name

        // make da image locally to convert from base64 to binary
        fs.writeFile(path.resolve(__dirname, fileName), data_str.split(',')[1], {encoding:'base64'}, (err) => {
            if(err) return next(err); // Image write error

            // we wrote the local file so now we can send it to amazon
            // get the binary file contents
            fs.readFile(path.resolve(__dirname, fileName), async (err,data) => {
                if (err) return next(err); // Image read error

                let com = new s3.PutObjectCommand({
                    Bucket: bucketName,
                    Key: fileName,
                    Body: data,
                    ContentType: in_data.mime,
                })
        
                // send the command
                await S3.send(com)
                .then( (data) => {console.log(data);})
                .catch( (err) => {return next(err); }) 

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
                        return next(7); // SQL error 
                    }
                    
                    resbody.setData({msg:"uploaded image successfully", link:link});
                    removeFile(fileName); // remove the local file from storage

                    return next();

                });
            })

        }) 


    });

    req.on('error', (err)=> {
        return next(err); 
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