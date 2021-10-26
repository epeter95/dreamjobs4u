const express = require('express');
const router = express.Router();
const { Job, JobTranslation, Language } = require('../db/models');
const JWTManager = require('../middlewares/jwt_manager');

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

router.get('/',JWTManager.verifyAdminUser, async (req, res) => {
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

router.get('/:id',JWTManager.verifyAdminUser, async (req, res) => {
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

router.post('/',JWTManager.verifyAdminUser, async (req, res) => {
    try {
        const {
            userId, companyName, logoUrl, jobLocation,title,
            taskList, aboutUs, expectationList, offerList,
            requiredExperience, requiredQualification, requiredLanguage,
            employmentType
        } = req.body;
        const data = await Job.create({ userId, companyName, logoUrl, jobLocation });
        const hunLanguage = await Language.findOne({ where: { key: process.env.DEFAULT_LANGUAGE_KEY } });
        const translationData = await JobTranslation.create({
            jobId: data.id, languageId: hunLanguage.id,title,
            taskList, aboutUs, expectationList, offerList,
            requiredExperience, requiredQualification, requiredLanguage,
            employmentType
        });
        return res.send({ ok: 'siker' });
    } catch (error) {
        console.log(error);
        return res.send({ error: error.name });
    }
});

router.put('/:id',JWTManager.verifyAdminUser, async (req, res) => {
    const paramId = req.params.id;
    try {
        const { userId, companyName, logoUrl, jobLocation } = req.body;
        const data = await Job.update({userId, companyName, logoUrl, jobLocation}, {
            where: { id: paramId },
        });

        return res.send({ ok: 'siker' });
    } catch (error) {
        console.log(error);
        return res.send({ error: error.name });
    }
});

router.delete('/:id',JWTManager.verifyAdminUser, async (req, res) => {
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
