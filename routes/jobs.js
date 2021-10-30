const express = require('express');
const router = express.Router();
const { Job, JobTranslation, Language, User } = require('../db/models');
const JWTManager = require('../middlewares/jwt_manager');
const FileManager = require('../middlewares/file_manager');

router.get('/public', async (req, res) => {
    try {
        const data = await Job.findAll({
            include: JobTranslation
        });
        return res.send(data);
    } catch (error) {
        console.log(error);
        return res.send({ error: error.name });
    }
});

router.get('/public/getJobsByToken', async (req, res) => {
    try {
        const email = JWTManager.getEmailByToken(req.headers['authorization']);
        if (email == 'forbidden') {
            return res.sendStatus(403);
        }
        const userData = await User.findOne({ where: { email: email } });
        const data = await Job.findAll({
            include: JobTranslation
        }, { where: { userId: userData.id } });
        return res.send(data);
    } catch (error) {
        console.log(error);
        return res.send({ error: error.name });
    }
});

router.get('/public/getJobByIdAndToken/:id', async (req, res) => {
    try {
        const email = JWTManager.getEmailByToken(req.headers['authorization']);
        if (email == 'forbidden') {
            return res.sendStatus(403);
        }
        const userData = await User.findOne({ where: { email: email } });
        const data = await Job.findOne({
            where: { userId: userData.id, id: req.params.id },
            include: JobTranslation
        });
        return res.send(data);
    } catch (error) {
        console.log(error);
        return res.send({ error: error.name });
    }
});

router.get('/public/getJobDropdwonDataByToken', async (req, res) => {
    try {
        const email = JWTManager.getEmailByToken(req.headers['authorization']);
        if (email == 'forbidden') {
            return res.sendStatus(403);
        }
        const userData = await User.findOne({ where: { email: email } });
        const data = await Job.findAll({
            where: { userId: userData.id },
            attributes: ['id', 'companyName']
        });
        return res.send(data);
    } catch (error) {
        console.log(error);
        return res.send({ error: error.name });
    }
});

router.post('/public/createJob', async (req, res) => {
    try {
        const email = JWTManager.getEmailByToken(req.headers['authorization']);
        if (email == 'forbidden') {
            return res.sendStatus(403);
        }
        const userData = await User.findOne({ where: { email: email } });
        const {
            companyName, companyWebsite, categoryId,
            jobLocation, hunTitle, hunAboutUs, hunJobDescription,
            enTitle, enAboutUs, enJobDescription
        } = req.body;
        const data = await Job.create({ userId: userData.id, categoryId, companyName, jobLocation, companyWebsite });
        const directoryName = userData.id + '/jobs/' + data.id;
        const directoryRoot = './public/users/' + directoryName;
        const imageUrlString = await FileManager.handleFileUpload(req, directoryRoot, directoryName, 'logoUrl');
        data.logoUrl = imageUrlString;
        data.save();
        const hunLanguage = await Language.findOne({ where: { key: process.env.DEFAULT_LANGUAGE_KEY } });
        const translationData = await JobTranslation.create({
            jobId: data.id, languageId: hunLanguage.id, title: hunTitle,
            aboutUs: hunAboutUs, jobDescription: hunJobDescription
        });
        if (enTitle || enAboutUs || enJobDescription) {
            const enLanguage = await Language.findOne({ where: { key: process.env.ENGLISH_LANGUAGE_KEY } });
            const enTranslationData = await JobTranslation.create({
                jobId: data.id, languageId: enLanguage.id, title: enTitle,
                aboutUs: enAboutUs, jobDescription: enJobDescription
            });
        }
        return res.send({ ok: 'siker' });
    } catch (error) {
        console.log(error);
        return res.send({ error: error.name });
    }
});

router.put('/public/modifyJob/:id', async (req, res) => {
    try {
        const email = JWTManager.getEmailByToken(req.headers['authorization']);
        if (email == 'forbidden') {
            return res.sendStatus(403);
        }
        const userData = await User.findOne({ where: { email: email } });
        const {
            companyName, companyWebsite, categoryId, imageChanging,
            jobLocation, hunTitle, hunAboutUs, hunJobDescription,
            enTitle, enAboutUs, enJobDescription
        } = req.body;
       
        if(imageChanging){
            const directoryName = userData.id + '/jobs/' + req.params.id;
            const directoryRoot = './public/users/' + directoryName;
            const imageUrlString = await FileManager.handleFileUpload(req, directoryRoot, directoryName, 'logoUrl');
            if(imageUrlString){
                await Job.update({ logoUrl: imageUrlString }, { where: { id: req.params.id } });
            }
        }
        const updatedJob = await Job.update({ companyName, categoryId, jobLocation, companyWebsite }, { where: { id: req.params.id } });
        const hunLanguage = await Language.findOne({ where: { key: process.env.DEFAULT_LANGUAGE_KEY } });
        await JobTranslation.update({
            title: hunTitle, aboutUs: hunAboutUs, jobDescription: hunJobDescription
        }, { where: { jobId: req.params.id, languageId: hunLanguage.id } });
        const enLanguage = await Language.findOne({ where: { key: process.env.ENGLISH_LANGUAGE_KEY } });
        const enTranslation = await JobTranslation.findOne({ where: { jobId: req.params.id, languageId: enLanguage.id } });
        if (enTranslation) {
            await JobTranslation.update({
                title: enTitle, aboutUs: enAboutUs, jobDescription: enJobDescription
            }, { where: { id: enTranslation.id } });
        } else {
            await JobTranslation.create({
                jobId: req.params.id, languageId: enLanguage.id, title: enTitle,
                aboutUs: enAboutUs, jobDescription: enJobDescription
            });
        }
        return res.send({ ok: 'siker' });
    } catch (error) {
        console.log(error);
        return res.send({ error: error.name });
    }
});

router.get('/', JWTManager.verifyAdminUser, async (req, res) => {
    try {
        const data = await Job.findAll({
            include: [JobTranslation, User]
        });
        return res.send(data);
    } catch (error) {
        console.log(error);
        return res.send({ error: error.name });
    }
});

router.get('/:id', JWTManager.verifyAdminUser, async (req, res) => {
    const paramId = req.params.id;
    try {
        let data;
        if (paramId) {
            data = await Job.findOne({
                where: { id: paramId },
            });
        }
        return res.send(data);
    } catch (error) {
        console.log(error);
        return res.send({ error: error.name });
    }
});

router.post('/', JWTManager.verifyAdminUser, async (req, res) => {
    try {
        const {
            userId, companyName, logoUrl, companyWebsite,
            jobLocation, title, aboutUs, jobDescription
        } = req.body;
        const data = await Job.create({ userId, companyName, logoUrl, jobLocation, companyWebsite });
        const hunLanguage = await Language.findOne({ where: { key: process.env.DEFAULT_LANGUAGE_KEY } });
        const translationData = await JobTranslation.create({
            jobId: data.id, languageId: hunLanguage.id, title,
            aboutUs, jobDescription
        });
        return res.send({ ok: 'siker' });
    } catch (error) {
        console.log(error);
        return res.send({ error: error.name });
    }
});

router.put('/:id', JWTManager.verifyAdminUser, async (req, res) => {
    const paramId = req.params.id;
    try {
        const { userId, companyName, companyWebsite, logoUrl, jobLocation } = req.body;
        const data = await Job.update({ userId, companyName, companyWebsite, logoUrl, jobLocation }, {
            where: { id: paramId },
        });

        return res.send({ ok: 'siker' });
    } catch (error) {
        console.log(error);
        return res.send({ error: error.name });
    }
});

router.delete('/:id', JWTManager.verifyAdminUser, async (req, res) => {
    const paramId = req.params.id;
    try {
        const data = await Job.destroy({
            where: { id: paramId }
        });
    } catch (error) {
        console.log(error);
        return res.send({ error: error.name });
    }
    return res.send({ ok: 'siker' });
});

module.exports = router;
