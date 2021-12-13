const express = require('express');
const router = express.Router();
const { ErrorMessageTranslation, ErrorMessage, Language } = require('../db/models');
const JWTManager = require('../middlewares/jwt_manager');
//adminisztratív jogosultsággal hibaüzenetek fordítások lekérdezése hibaüzenet és nyelv includeal
router.get('/',JWTManager.verifyAdminUser, async (req, res) => {
    try {
        const data = await ErrorMessageTranslation.findAll({
            include: [ErrorMessage,Language]
        });
        return res.send(data);
    } catch (error) {
        console.log(error);
        return res.send({ error: error.name });
    }
});
//adminisztratív jogosultsággal egy hibaüzenet fordítások lekérdezése hibaüzenet és nyelv includeal
router.get('/:id',JWTManager.verifyAdminUser, async (req, res) => {
    const paramId = req.params.id;
    try {
        let data;
        if (paramId) {
            data = await ErrorMessageTranslation.findOne({
                where: { id: paramId },
            });
        }
        return res.send(data);
    } catch (error) {
        console.log(error);
        return res.send({ error: error.name });
    }
});
//adminisztratív jogosultsággal hibaüzenet fordítások létrehozása
router.post('/',JWTManager.verifyAdminUser, async (req, res) => {
    try {
        const { errorMessageId, languageId, text } = req.body;
        const data = await ErrorMessageTranslation.create({ errorMessageId, languageId, text });
        return res.send({ ok: 'siker' });
    } catch (error) {
        console.log(error);
        return res.send({ error: error.name });
    }
});
//adminisztratív jogosultsággal hibaüzenet fordítások módosítása
router.put('/:id',JWTManager.verifyAdminUser, async (req, res) => {
    const paramId = req.params.id;
    try {
        const { errorMessageId, languageId, text } = req.body;
        const data = await ErrorMessageTranslation.update({ errorMessageId, languageId, text }, {
            where: { id: paramId },
        });

        return res.send({ ok: 'siker' });
    } catch (error) {
        console.log(error);
        return res.send({ error: error.name });
    }
});
//adminisztratív jogosultsággal hibaüzenet fordítások törlése
router.delete('/:id',JWTManager.verifyAdminUser, async (req, res) => {
    const paramId = req.params.id;
    try {
        const data = await ErrorMessageTranslation.destroy({
            where: { id: paramId }
        });
    } catch (error) {
        console.log(error);
        return res.send({ error: error.name });
    }
    return res.send({ ok: 'siker' });
});

module.exports = router;