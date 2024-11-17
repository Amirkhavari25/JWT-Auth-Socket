const nodemailer = require('nodemailer');
require('dotenv').config();


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: "khavariamir25@gmail.com",
        pass: "oidh swpw eqzg sakr"
    }
});


module.exports = transporter;