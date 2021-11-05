const nodemailer = require('nodemailer');

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
    static async sendMail(replyTo,mailTo,subject,mailContent){
        const mailOptions = {
            from: process.env.SMTP_USER,
            to: mailTo,
            subject: subject,
            html: mailContent,
            replyTo: replyTo
        }
        transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log(error);
            } else {
              console.log('Email sent: ' + info.response);
            }
        });
    }

}

module.exports = Mailer;