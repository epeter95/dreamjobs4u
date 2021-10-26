const express = require('express');
const router = express.Router();
const { JobTranslation, Job, Language } = require('../db/models');
const JWTManager = require('../middlewares/jwt_manager');

router.get('/', JWTManager.verifyAdminUser, async (req, res) => {
    try {
        const data = await JobTranslation.findAll({
            include: [Job, Language]
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
            data = await JobTranslation.findOne({
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
            jobId, languageId, title,
            taskList, aboutUs, expectationList, offerList,
            requiredExperience, requiredQualification, requiredLanguage,
            employmentType
        } = req.body;
        const data = await JobTranslation.create({
            jobId, languageId, title,
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

router.put('/:id', JWTManager.verifyAdminUser, async (req, res) => {
    const paramId = req.params.id;
    try {
        const {
            jobId, languageId, title,
            taskList, aboutUs, expectationList, offerList,
            requiredExperience, requiredQualification, requiredLanguage,
            employmentType
        } = req.body;
        const data = await JobTranslation.update({
            jobId, languageId, title,
            taskList, aboutUs, expectationList, offerList,
            requiredExperience, requiredQualification, requiredLanguage,
            employmentType
        }, {
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
        const data = await JobTranslation.destroy({
            where: { id: paramId }
        });
    } catch (error) {
        console.log(error);
        return res.send({ error: error.name });
    }
    return res.send({ ok: 'siker' });
});

module.exports = router;