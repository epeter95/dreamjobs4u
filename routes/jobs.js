const express = require('express');
const router = express.Router();
const { Job, JobTranslation, Language, User, Category, CategoryTranslation,
    Profile, UserAppliedToJob, AppliedUserStatus, AppliedUserStatusTranslation } = require('../db/models');
const JWTManager = require('../middlewares/jwt_manager');
const FileManager = require('../middlewares/file_manager');
const Mailer = require('../classes/mailer');

router.get('/public/getJobsByCategoryId/:id', async (req, res) => {
    try {
        const categoryId = req.params.id;
        const data = await Job.findAll({
            include: [JobTranslation, { model: Category, where: { id: categoryId }, include: CategoryTranslation }]
        });
        return res.send(data);
    } catch (error) {
        console.log(error);
        return res.send({ error: error.name });
    }
});

router.get('/public', async (req, res) => {
    try {
        const data = await Job.findAll({
            include: [JobTranslation, { model: Category, include: CategoryTranslation }]
        });
        return res.send(data);
    } catch (error) {
        console.log(error);
        return res.send({ error: error.name });
    }
});

router.get('/public/getJobById/:id', async (req, res) => {
    try {
        let id = req.params.id;
        const data = await Job.findOne({
            include: [JobTranslation, { model: Category, include: CategoryTranslation }, { model: User, include: Profile }],
            where: { id: id }
        });
        return res.send(data);
    } catch (error) {
        console.log(error);
        return res.send({ error: error.name });
    }
});

router.get('/public/getJobsByTokenWithAppliedUsers', async (req, res) => {
    try {
        const email = JWTManager.getEmailByToken(req.headers['authorization']);
        if (email == 'forbidden') {
            return res.sendStatus(403);
        }
        const userData = await User.findOne({ where: { email: email } });
        const data = await Job.findAll({
            include: [JobTranslation, { model: Category, include: CategoryTranslation }]
        }, { where: { userId: userData.id } });
        let result = [];
        for (let i = 0; i < data.length; ++i) {
            const appliedUsers = await UserAppliedToJob.findAll({
                where: { jobId: data[i].id },
                include: [
                    { model: User, attributes: ['id', 'firstName', 'lastName', 'email'], include: Profile },
                    { model: AppliedUserStatus, include: AppliedUserStatusTranslation}
                ]
            });
            let resultElement = { jobData: data[i], appliedUsers: appliedUsers };
            result.push(resultElement);
        }
        return res.send(result);
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

router.post('/public/userApplyToJob', async (req, res) => {
    try {
        const { jobId } = req.body;
        const email = JWTManager.getEmailByToken(req.headers['authorization']);
        if (email == 'forbidden') {
            return res.sendStatus(403);
        }
        const userRow = await User.findOne({ where: { email: email }, include: Profile });
        console.log(jobId + ' ' + userRow.id);
        let userAppliedJobRow = await UserAppliedToJob.findOne({ where: { userId: userRow.id, jobId: jobId } });
        if (userAppliedJobRow) {
            return res.send({ error: 'userAlreadyApplied' });
        } else {
            const defaultUserStatusRow = await AppliedUserStatus.findOne({ where: { key: process.env.DEFAULT_USER_STATUS_KEY } });
            await UserAppliedToJob.create({ userId: userRow.id, jobId, appliedUserStatusId: defaultUserStatusRow.id });
        }
        const jobRow = await Job.findOne({ where: { id: jobId }, include: [JobTranslation, User] });
        const huLanguage = await Language.findOne({ where: { key: process.env.DEFAULT_LANGUAGE_KEY } });
        let fileUrl;
        let fileName;
        if (userRow.Profile.cvPath) {
            fileName = userRow.Profile.cvPath.substr(userRow.Profile.cvPath.lastIndexOf("/") + 1);
            fileUrl = './public/users/' + userRow.Profile.cvPath.replace(process.env.DOMAIN_NAME, '');
        }
        const fromEmail = userRow.email;
        const toEmail = jobRow.User.email;
        const huTranslation = jobRow.JobTranslations.find(element => element.languageId == huLanguage.id);
        const mailSubject = 'Az ' + huTranslation.title + ' állásra ' + userRow.firstName + ' ' + userRow.lastName + ' nevű felhasználó jelentkezett';
        const mailMessage = 'Ha a felhasználónak van feltöltött önéletrajza, a csatlományok között megtalálja, ha nincs, vegye fel vele a kapcsolatot emailben, vagy nézze meg oldalunkon az adatait további információért.'
        await Mailer.sendMail(fromEmail, toEmail, mailSubject, mailMessage, [{ filename: fileName, path: fileUrl, contentType: 'application/pdf' }]);
        return res.send({ status: 'ok' });
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
            enTitle, enAboutUs, enJobDescription, hunPayment, hunJobType,
            hunExperience, hunQualification, hunLanguage, enPayment, enJobType,
            enExperience, enQualification, enLanguage
        } = req.body;
        const data = await Job.create({ userId: userData.id, categoryId, companyName, jobLocation, companyWebsite });
        const directoryName = userData.id + '/jobs/' + data.id;
        const directoryRoot = './public/users/' + directoryName;
        const imageUrlString = await FileManager.handleFileUpload(req, directoryRoot, directoryName, 'logoUrl');
        data.logoUrl = imageUrlString;
        data.save();
        const hunLanguageElement = await Language.findOne({ where: { key: process.env.DEFAULT_LANGUAGE_KEY } });
        const translationData = await JobTranslation.create({
            jobId: data.id, languageId: hunLanguageElement.id, title: hunTitle,
            aboutUs: hunAboutUs, jobDescription: hunJobDescription,
            payment: hunPayment, jobType: hunJobType,
            experience: hunExperience, qualification: hunQualification,
            language: hunLanguage
        });
        if (enTitle || enAboutUs || enJobDescription
            || enPayment || enJobType || enExperience ||
            enQualification || enLanguage) {
            const enLanguageElement = await Language.findOne({ where: { key: process.env.ENGLISH_LANGUAGE_KEY } });
            const enTranslationData = await JobTranslation.create({
                jobId: data.id, languageId: enLanguageElement.id, title: enTitle,
                aboutUs: enAboutUs, jobDescription: enJobDescription,
                payment: enPayment, jobType: enJobType,
                experience: enExperience, qualification: enQualification,
                language: enLanguage
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
            enTitle, enAboutUs, enJobDescription, hunPayment, hunJobType,
            hunExperience, hunQualification, hunLanguage, enPayment, enJobType,
            enExperience, enQualification, enLanguage
        } = req.body;

        if (imageChanging) {
            const directoryName = userData.id + '/jobs/' + req.params.id;
            const directoryRoot = './public/users/' + directoryName;
            const imageUrlString = await FileManager.handleFileUpload(req, directoryRoot, directoryName, 'logoUrl');
            if (imageUrlString) {
                await Job.update({ logoUrl: imageUrlString }, { where: { id: req.params.id } });
            }
        }
        const updatedJob = await Job.update({ companyName, categoryId, jobLocation, companyWebsite }, { where: { id: req.params.id } });
        const hunLanguageElement = await Language.findOne({ where: { key: process.env.DEFAULT_LANGUAGE_KEY } });
        await JobTranslation.update({
            title: hunTitle, aboutUs: hunAboutUs, jobDescription: hunJobDescription,
            payment: hunPayment, jobType: hunJobType,
            experience: hunExperience, qualification: hunQualification,
            language: hunLanguage
        }, { where: { jobId: req.params.id, languageId: hunLanguageElement.id } });
        const enLanguageElement = await Language.findOne({ where: { key: process.env.ENGLISH_LANGUAGE_KEY } });
        const enTranslation = await JobTranslation.findOne({ where: { jobId: req.params.id, languageId: enLanguageElement.id } });
        if (enTranslation) {
            await JobTranslation.update({
                title: enTitle, aboutUs: enAboutUs,
                jobDescription: enJobDescription,
                payment: enPayment, jobType: enJobType,
                experience: enExperience, qualification: enQualification,
                language: enLanguage
            }, { where: { id: enTranslation.id } });
        } else {
            await JobTranslation.create({
                jobId: req.params.id, languageId: enLanguageElement.id, title: enTitle,
                aboutUs: enAboutUs, jobDescription: enJobDescription,
                payment: enPayment, jobType: enJobType,
                experience: enExperience, qualification: enQualification,
                language: enLanguage
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
            jobLocation, title, aboutUs, jobDescription,
            payment, jobType, experience, qualification,
            language
        } = req.body;
        const data = await Job.create({ userId, companyName, logoUrl, jobLocation, companyWebsite });
        const hunLanguage = await Language.findOne({ where: { key: process.env.DEFAULT_LANGUAGE_KEY } });
        const translationData = await JobTranslation.create({
            jobId: data.id, languageId: hunLanguage.id, title,
            aboutUs, jobDescription, language,
            payment, jobType, experience, qualification,

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
