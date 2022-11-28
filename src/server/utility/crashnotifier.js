const file       = require('fs');
const path       = require('path');
require('dotenv').config({path: path.resolve(__dirname, "../../../.env")});

const nodemailer = require('nodemailer');



/**
 * sends and to us to let us know the server has crashed
 * @param {*} callback         : returns (null, 1), on error returns (error,0)
 */
 function sendEmail(callback) {
    let html_str = '<p> The server crashed !!!! </p>';
    let subject = 'Server Down';
    let email = 'wcblanco@ucsc.edu'
    var mailOptions = {
        from: 'server',
        to: email,
        subject: subject,
        html: html_str
    };
 
    var transport = nodemailer.createTransport({
        service: "gmail",    
        auth: {
            user: 'foodseek2022.ucsc@gmail.com', // Your email id
            pass: 'qtazkxgenmugphsh' // Your password
        }
    });
 
    transport.sendMail(mailOptions, function(error, info) {
        if (error) {
            //console.log(1)
            return callback(error,0);
            
        } else {
            //console.log(0)
            return callback(null, 1);
        }
    });
}

sendEmail();