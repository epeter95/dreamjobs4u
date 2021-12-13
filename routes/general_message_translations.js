const express = require('express');
const router = express.Router();
const { GeneralMessageTranslation, GeneralMessage, Language } = require('../db/models');
const JWTManager = require('../middlewares/jwt_manager');
//adminisztratív jogosultsággal adminisztratív felületre általános üzenet fordítások lekérdezése üzenet elemmel és nyelvvel
router.get('/',JWTManager.verifyAdminUser, async (req, res) => {
    try {
        const data = await GeneralMessageTranslation.findAll({
            include: [GeneralMessage,Language]
        });
        return res.send(data);
    } catch (error) {
        console.log(error);
        return res.send({ error: error.name });
    }
});
//adminisztratív jogosultsággal adminisztratív felületre egy általános üzenet fordítás lekérdezése üzenet elemmel és nyelvvel
router.get('/:id',JWTManager.verifyAdminUser, async (req, res) => {
    const paramId = req.params.id;
    try {
        let data;
        if (paramId) {
            data = await GeneralMessageTranslation.findOne({
                where: { id: paramId },
            });
        }
        return res.send(data);
    } catch (error) {
        console.log(error);
        return res.send({ error: error.name });
    }
});
//adminisztratív jogosultsággal adminisztratív felületre általános üzenet fordítás létrehozása
router.post('/',JWTManager.verifyAdminUser, async (req, res) => {
    try {
        const { generalMessageId, languageId, text } = req.body;
        const data = await GeneralMessageTranslation.create({ generalMessageId, languageId, text });
        return res.send({ ok: 'siker' });
    } catch (error) {
        console.log(error);
        return res.send({ error: error.name });
    }
});
//adminisztratív jogosultsággal adminisztratív felületre általános üzenet fordítás módosítása
router.put('/:id',JWTManager.verifyAdminUser, async (req, res) => {
    const paramId = req.params.id;
    try {
        const { generalMessageId, languageId, text } = req.body;
        const data = await GeneralMessageTranslation.update({ generalMessageId, languageId, text }, {
            where: { id: paramId },
        });

        return res.send({ ok: 'siker' });
    } catch (error) {
        console.log(error);
        return res.send({ error: error.name });
    }
});
//adminisztratív jogosultsággal adminisztratív felületre általános üzenet fordítás törlése
router.delete('/:id',JWTManager.verifyAdminUser, async (req, res) => {
    const paramId = req.params.id;
    try {
        const data = await GeneralMessageTranslation.destroy({
            where: { id: paramId }
        });
    } catch (error) {
        console.log(error);
        return res.send({ error: error.name });
    }
    return res.send({ ok: 'siker' });
});

module.exports = router;