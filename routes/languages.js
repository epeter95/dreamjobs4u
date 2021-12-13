const express = require('express');
const router = express.Router();
const { Language, LanguageTranslation } = require('../db/models');
const JWTManager = require('../middlewares/jwt_manager');
//publikus felület számára nyelvek és fordításaik lekérdezése
router.get('/public', async (req, res) => {
    try {
        const data = await Language.findAll({
            include: LanguageTranslation
        });
        return res.send(data);
    } catch (error) {
        console.log(error);
        return res.send({ error: error.name });
    }
});
//adminisztratív jogosultsággal nyelvek és fordításaik lekérdezése
router.get('/',JWTManager.verifyAdminUser, async (req, res) => {
    try {
        const data = await Language.findAll({
            include: LanguageTranslation
        });
        return res.send(data);
    } catch (error) {
        console.log(error);
        return res.send({ error: error.name });
    }
});
//adminisztratív jogosultsággal nyelv és fordításaik lekérdezése
router.get('/:id',JWTManager.verifyAdminUser, async (req, res) => {
    const paramId = req.params.id;
    try {
        let data;
        if (paramId) {
            data = await Language.findOne({
                where: { id: paramId },
            });
        }
        return res.send(data);
    } catch (error) {
        console.log(error);
        return res.send({ error: error.name });
    }
});
//adminisztratív jogosultsággal nyelv létrehozása magyar fordítással
router.post('/',JWTManager.verifyAdminUser, async (req, res) => {
    try {
        const { key, active, adminName, name } = req.body;
        const data = await Language.create({ key, adminName, active: active ? true : false });
        const hunLanguage = await Language.findOne({ where: { key: process.env.DEFAULT_LANGUAGE_KEY } });
        const translationData = await LanguageTranslation.create({ languageElementId: data.id, languageId: hunLanguage.id, name });
        return res.send({ ok: 'siker' });
    } catch (error) {
        console.log(error);
        return res.send({ error: error.name });
    }
});
//adminisztratív jogosultsággal nyelv módosítása
router.put('/:id',JWTManager.verifyAdminUser, async (req, res) => {
    const paramId = req.params.id;
    try {
        const { key, adminName, active } = req.body;
        const data = await Language.update({ key, adminName, active }, {
            where: { id: paramId },
        });

        return res.send({ ok: 'siker' });
    } catch (error) {
        console.log(error);
        return res.send({ error: error.name });
    }
});
//adminisztratív jogosultsággal nyelv módosítása fordításaikkal
router.delete('/:id',JWTManager.verifyAdminUser, async (req, res) => {
    const paramId = req.params.id;
    try {
        const data = await Language.destroy({
            where: { id: paramId }
        });
    } catch (error) {
        console.log(error);
        return res.send({ error: error.name });
    }
    return res.send({ ok: 'siker' });
});

module.exports = router;
