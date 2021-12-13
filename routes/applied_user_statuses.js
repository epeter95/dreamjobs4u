const express = require('express');
const router = express.Router();
const { AppliedUserStatus, AppliedUserStatusTranslation, Language } = require('../db/models');
const JWTManager = require('../middlewares/jwt_manager');
// jogosultság nélkül minden státusz lekérdezése
router.get('/public', async (req, res) => {
    try {
        const data = await AppliedUserStatus.findAll({ include: AppliedUserStatusTranslation });
        return res.send(data);
    } catch (error) {
        console.log(error);
        return res.send({ error: error.name });
    }
});
// adminisztratív jogosultsággal minden státusz lekérdezése
router.get('/', JWTManager.verifyAdminUser, async (req, res) => {
    try {
        const data = await AppliedUserStatus.findAll({ include: AppliedUserStatusTranslation });
        return res.send(data);
    } catch (error) {
        console.log(error);
        return res.send({ error: error.name });
    }
});
// adminisztratív jogosultsággal egy státusz lekérdezése paraméterben megkapott azonosító alapján
router.get('/:id', JWTManager.verifyAdminUser, async (req, res) => {
    const paramId = req.params.id;
    try {
        let data;
        if (paramId) {
            data = await AppliedUserStatus.findOne({
                where: { id: paramId },
                include: AppliedUserStatusTranslation
            });
        }
        return res.send(data);
    } catch (error) {
        console.log(error);
        return res.send({ error: error.name });
    }
});
// adminisztratív jogosultsággal státusz és magyar fordítás létrehozása
router.post('/', JWTManager.verifyAdminUser, async (req, res) => {
    try {
        const { key, adminName, text } = req.body;
        const data = await AppliedUserStatus.create({ key, adminName });
        const hunLanguage = await Language.findOne({ where: { key: process.env.DEFAULT_LANGUAGE_KEY } });
        const translationData = await AppliedUserStatusTranslation.create({ appliedUserStatusId: data.id, languageId: hunLanguage.id, text });
        return res.send({ ok: 'siker' });
    } catch (error) {
        console.log(error);
        return res.send({ error: error.name });
    }
});
// adminisztratív jogosultsággal státusz módosítása azonosító alapján
router.put('/:id', JWTManager.verifyAdminUser, async (req, res) => {
    const paramId = req.params.id;
    try {
        const { key, adminName } = req.body;
        const data = await AppliedUserStatus.update({ key, adminName }, {
            where: { id: paramId },
        });

        return res.send({ ok: 'siker' });
    } catch (error) {
        console.log(error);
        return res.send({ error: error.name });
    }
});
// adminisztratív jogosultsággal törlése azonosító alapján, minden fordítás törlődik
router.delete('/:id', JWTManager.verifyAdminUser, async (req, res) => {
    const paramId = req.params.id;
    try {
        const data = await AppliedUserStatus.destroy({
            where: { id: paramId }
        });
    } catch (error) {
        console.log(error);
        return res.send({ error: error.name });
    }
    return res.send({ ok: 'siker' });
});

module.exports = router;