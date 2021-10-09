const express = require('express');
const router = express.Router();
const { LanguageTranslation, Language } = require('../db/models');
const JWTManager = require('../middlewares/jwt_manager');

router.get('/',JWTManager.verifyAdminUser, async (req, res) => {
    try {
        const data = await LanguageTranslation.findAll({
            include: Language
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
            data = await LanguageTranslation.findOne({
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
        const { languageElementId, languageId, name } = req.body;
        const data = await LanguageTranslation.create({ languageElementId, languageId, name });
        return res.send({ ok: 'siker' });
    } catch (error) {
        console.log(error);
        return res.send({ error: error.name });
    }
});

router.put('/:id',JWTManager.verifyAdminUser, async (req, res) => {
    const paramId = req.params.id;
    try {
        const { languageElementId, languageId, name } = req.body;
        const data = await LanguageTranslation.update({ languageElementId, languageId, name }, {
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
        const data = await LanguageTranslation.destroy({
            where: { id: paramId }
        });
    } catch (error) {
        console.log(error);
        return res.send({ error: error.name });
    }
    return res.send({ ok: 'siker' });
});

module.exports = router;
