const express = require('express');
const router = express.Router();
const { PublicContentTranslation, PublicContent, Language, PagePlace } = require('../db/models');
const JWTManager = require('../middlewares/jwt_manager');

router.get('/', JWTManager.verifyAdminUser, async (req, res) => {
    try {
        const data = await PublicContentTranslation.findAll({
            include: [PublicContent, Language]
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
            data = await PublicContentTranslation.findOne({
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
        const { publicContentId, languageId, title } = req.body;
        const data = await PublicContentTranslation.create({ publicContentId, languageId, title });
        return res.send({ ok: 'siker' });
    } catch (error) {
        console.log(error);
        return res.send({ error: error.name });
    }
});

router.put('/:id', JWTManager.verifyAdminUser, async (req, res) => {
    const paramId = req.params.id;
    try {
        const { publicContentId, languageId, title } = req.body;
        const data = await PublicContentTranslation.update({ publicContentId, languageId, title }, {
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
        const data = await PublicContentTranslation.destroy({
            where: { id: paramId }
        });
    } catch (error) {
        console.log(error);
        return res.send({ error: error.name });
    }
    return res.send({ ok: 'siker' });
});

router.get('/getByPagePlaceKey/:key', JWTManager.verifyAdminUser, async (req, res) => {
    var pagePlaceKeyParam = req.params.key;
    try {
        let result = new Array();
        if (pagePlaceKeyParam) {
            const pagePlace = await PagePlace.findOne({where: {key: pagePlaceKeyParam}});
            result = await PublicContentTranslation.findAll({
                include: [
                    { model: PublicContent, where: { pagePlaceId: pagePlace.id } },
                    Language
                ],
            });
        }
        return res.send(result);
    } catch (error) {
        console.log(error);
        return res.send({ error: error.name });
    }
});

module.exports = router;
