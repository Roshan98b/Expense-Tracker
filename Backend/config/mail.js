const nodemailer = require('nodemailer');

// create reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
    host: process.env.NODEMAILER_HOST,
    port: 587,
    secure: false,
    auth: {
        user: process.env.NODEMAILER_EMAIL,
        pass: process.env.NODEMAILER_PASSWORD
    },
    tls: {
    	rejectUnauthorized:false
    }
});

module.exports.sendMail = (mailOptions, callback) => {
    transporter.sendMail(mailOptions, callback);	
}