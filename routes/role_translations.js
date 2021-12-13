const express = require('express');
const router = express.Router();
const { RoleTranslation, Role, Language } = require('../db/models');
const JWTManager = require('../middlewares/jwt_manager');
//adminisztratív jogosultsággal szerepkör fordítások lekérdezése szerepkör és nyelv includeal
router.get('/',JWTManager.verifyAdminUser, async (req, res) => {
    try {
        const data = await RoleTranslation.findAll({
            include: [Role,Language]
        });
        return res.send(data);
    } catch (error) {
        console.log(error);
        return res.send({ error: error.name });
    }
});
//adminisztratív jogosultsággal egy szerepkör fordítás lekérdezése szerepkör és nyelv includeal
router.get('/:id',JWTManager.verifyAdminUser, async (req, res) => {
    const paramId = req.params.id;
    try {
        let data;
        if (paramId) {
            data = await RoleTranslation.findOne({
                where: { id: paramId },
            });
        }
        return res.send(data);
    } catch (error) {
        console.log(error);
        return res.send({ error: error.name });
    }
});
//adminisztratív jogosultsággal szerepkör fordítás létrehozása
router.post('/',JWTManager.verifyAdminUser, async (req, res) => {
    try {
        const { roleId, languageId, name } = req.body;
        const data = await RoleTranslation.create({ roleId, languageId, name });
        return res.send({ ok: 'siker' });
    } catch (error) {
        console.log(error);
        return res.send({ error: error.name });
    }
});
//adminisztratív jogosultsággal szerepkör fordítás módosítása
router.put('/:id',JWTManager.verifyAdminUser, async (req, res) => {
    const paramId = req.params.id;
    try {
        const { roleId, languageId, name } = req.body;
        const data = await RoleTranslation.update({ roleId, languageId, name }, {
            where: { id: paramId },
        });

        return res.send({ ok: 'siker' });
    } catch (error) {
        console.log(error);
        return res.send({ error: error.name });
    }
});
//adminisztratív jogosultsággal szerepkör fordítás törlése
router.delete('/:id',JWTManager.verifyAdminUser, async (req, res) => {
    const paramId = req.params.id;
    try {
        const data = await RoleTranslation.destroy({
            where: { id: paramId }
        });
    } catch (error) {
        console.log(error);
        return res.send({ error: error.name });
    }
    return res.send({ ok: 'siker' });
});

module.exports = router;
