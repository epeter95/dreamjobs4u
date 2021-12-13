const express = require('express');
const router = express.Router();
const { JobTranslation, Job, Language } = require('../db/models');
const JWTManager = require('../middlewares/jwt_manager');
//adminisztratív jogosultsággal adminisztratív felületre állás fordítások lekérdezése
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
//adminisztratív jogosultsággal adminisztratív felületre egy állás fordítás lekérdezése
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
//adminisztratív jogosultsággal adminisztratív felületre egy állás fordítás létrehozása
router.post('/', JWTManager.verifyAdminUser, async (req, res) => {
    try {
        const {
            jobId, languageId, title,
            aboutUs, jobDescription,payment,
            jobType, experience, qualification,
            language
        } = req.body;
        const data = await JobTranslation.create({
            jobId, languageId, title,
            aboutUs, jobDescription,payment,
            jobType, experience, qualification,
            language
        });
        return res.send({ ok: 'siker' });
    } catch (error) {
        console.log(error);
        return res.send({ error: error.name });
    }
});
//adminisztratív jogosultsággal adminisztratív felületre egy állás fordítás módosítása
router.put('/:id', JWTManager.verifyAdminUser, async (req, res) => {
    const paramId = req.params.id;
    try {
        const {
            jobId, languageId, title,
            aboutUs, jobDescription,payment,
            jobType, experience, qualification,
            language
        } = req.body;
        const data = await JobTranslation.update({
            jobId, languageId, title,
            aboutUs, jobDescription,payment,
            jobType, experience, qualification,
            language
        }, {
            where: { id: paramId },
        });

        return res.send({ ok: 'siker' });
    } catch (error) {
        console.log(error);
        return res.send({ error: error.name });
    }
});
//adminisztratív jogosultsággal adminisztratív felületre egy állás fordítás törlése
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