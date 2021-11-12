const nodemailer = require('nodemailer');
const fs = require('fs');

const smtpConfig = {
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secureConnection: false, // TLS requires secureConnection to be false
    logger: true,
    debug: true,
    secure: false,
    requireTLS: true,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    },
    tls: { rejectUnauthorized: false }
};

var transporter = nodemailer.createTransport(smtpConfig);

class Mailer {
    static async sendMail(replyTo,mailTo,subject,mailContent, attachments, filePath){
        let mailOptions = {
            from: 'Sweat Jobs <'+process.env.SMTP_USER+'>',
            to: mailTo,
            subject: subject,
            html: mailContent,
            replyTo: replyTo
        }
        console.log('no');
        if(attachments.length > 0){
            console.log('yea');
            mailOptions['attachments'] = attachments;
        }
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
            if(filePath){
                fs.unlinkSync(filePath);
            }
        });
    }

}

module.exports = Mailer;