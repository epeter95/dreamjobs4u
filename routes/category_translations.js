const express = require('express');
const router = express.Router();
const { CategoryTranslation, Category, Language } = require('../db/models');
const JWTManager = require('../middlewares/jwt_manager');
//adminisztratív jogosultsággal minden kategória fordítás lekérdezése kateógria és nyelv includeal
router.get('/',JWTManager.verifyAdminUser, async (req, res) => {
    try {
        const data = await CategoryTranslation.findAll({
            include: [Category,Language]
        });
        return res.send(data);
    } catch (error) {
        console.log(error);
        return res.send({ error: error.name });
    }
});
//adminisztratív jogosultsággal egy kategória fordítás lekérdezése kateógria és nyelv includeal azonosító alapján
router.get('/:id',JWTManager.verifyAdminUser, async (req, res) => {
    const paramId = req.params.id;
    try {
        let data;
        if (paramId) {
            data = await CategoryTranslation.findOne({
                where: { id: paramId },
            });
        }
        return res.send(data);
    } catch (error) {
        console.log(error);
        return res.send({ error: error.name });
    }
});
//adminisztratív jogosultsággal kategória fordítás létrehozása
router.post('/',JWTManager.verifyAdminUser, async (req, res) => {
    try {
        const { categoryId, languageId, text } = req.body;
        const data = await CategoryTranslation.create({ categoryId, languageId, text });
        return res.send({ ok: 'siker' });
    } catch (error) {
        console.log(error);
        return res.send({ error: error.name });
    }
});
//adminisztratív jogosultsággal kategória fordítás módosítása
router.put('/:id',JWTManager.verifyAdminUser, async (req, res) => {
    const paramId = req.params.id;
    try {
        const { categoryId, languageId, text } = req.body;
        const data = await CategoryTranslation.update({ categoryId, languageId, text }, {
            where: { id: paramId },
        });

        return res.send({ ok: 'siker' });
    } catch (error) {
        console.log(error);
        return res.send({ error: error.name });
    }
});
//adminisztratív jogosultsággal kategória fordítás törlése
router.delete('/:id',JWTManager.verifyAdminUser, async (req, res) => {
    const paramId = req.params.id;
    try {
        const data = await CategoryTranslation.destroy({
            where: { id: paramId }
        });
    } catch (error) {
        console.log(error);
        return res.send({ error: error.name });
    }
    return res.send({ ok: 'siker' });
});

module.exports = router;