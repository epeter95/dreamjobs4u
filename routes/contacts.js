const express = require('express');
const Mailer = require('../classes/mailer');
const router = express.Router();
const { PublicContent, PublicContentTranslation ,Language } = require('../db/models');
//publikus felületről email küldése lábjegyzetből kinyert email címre, fájl csatolás nincs
router.post('/sendMailFromContact', async (req, res) => {
    try {
        const { firstName, lastName, email, subject, message } = req.body;
        let mailSubject = 'Visszajelzés a sweetjobs oldal felhasználójától, tárgy: '+subject;
        let mailMessage = '';
        if(firstName || lastName){
            mailMessage = firstName+ ' ' + lastName+' a következőt üzente: '+message;
        }else{
            mailMessage = 'Anonym felhasználótól a következőt üzenet érkezett: '+message;
        }
        let fromEmail = '';
        if(email){
            fromEmail = email;
        }else{
            fromEmail = 'anonymus@sweetjobstest.com';
        }
        const huLanguage = await Language.findOne({where: {key: process.env.DEFAULT_LANGUAGE_KEY}});
        let toEmailElement = await PublicContent.findOne({where: {key: 'footerCompanyEmail'}, include: PublicContentTranslation});
        console.log(huLanguage.id);
        let toEmail = toEmailElement.PublicContentTranslations.find(element=>element.languageId = huLanguage.id).title;
        console.log(toEmail+" "+fromEmail+" "+mailSubject+" "+mailMessage);
        await Mailer.sendMail(fromEmail, toEmail, mailSubject, mailMessage);
        return res.send({ ok: 'siker' });
    } catch (error) {
        console.log(error);
        return res.send({ error: error.name });
    }
});

module.exports = router;