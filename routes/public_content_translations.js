const express = require('express');
const router = express.Router();
const { PublicContentTranslation, PublicContent, Language } = require('../db/models');
// const JWTManager = require('../classes/jwt_manager');

// router.get('/', JWTManager.verifyServiceToken, async(req, res) => {
//   try{
//     const data = await PagePlace.findAll({
//     });
//     return res.send(data);
//   }catch(error){
//     console.log(error);
//     return res.send({error: error.name});
//   }
// });

router.get('/', async (req, res) => {
    try {
        const data = await PublicContentTranslation.findAll({
            include: [PublicContent,Language]
        });
        return res.send(data);
    } catch (error) {
        console.log(error);
        return res.send({ error: error.name });
    }
});

router.get('/:id', async (req, res) => {
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

router.post('/', async (req, res) => {
    try {
        const { publicContentId, languageId, title } = req.body;
        const data = await PublicContentTranslation.create({ publicContentId, languageId, title });
        return res.send({ ok: 'siker' });
    } catch (error) {
        console.log(error);
        return res.send({ error: error.name });
    }
});

router.put('/:id', async (req, res) => {
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

router.delete('/:id', async (req, res) => {
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

module.exports = router;
