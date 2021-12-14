const nodemailer = require('nodemailer');
const fs = require('fs');
//mail szerver adatainak megadása konfigurációs JSON objektumban
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
//transporter objektum létrehozása mail szerver konfigurációval
var transporter = nodemailer.createTransport(smtpConfig);

class Mailer {
    //email küldés paraméterben megkapott feladótól, címzettnek, tárggyal, leírással, esetleges fájl csatolással
    static async sendMail(replyTo,mailTo,subject,mailContent, attachments, filePath){
        let mailOptions = {
            from: 'Sweat Jobs <'+process.env.SMTP_USER+'>',
            to: mailTo,
            subject: subject,
            html: mailContent,
            replyTo: replyTo
        }
        console.log('no');
        if(attachments){
            if(attachments.length > 0){
                console.log('yea');
                mailOptions['attachments'] = attachments;
            }
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