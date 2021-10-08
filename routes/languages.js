const express = require('express');
const router = express.Router();
const { Language } = require('../db/models');
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
        const data = await Language.findAll({});
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

router.post('/', async (req, res) => {
    try {
        const data = await Language.create({
            key: req.body.key,
            active: req.body.active
        });

        return res.send({ ok: 'siker' });
    } catch (error) {
        console.log(error);
        return res.send({ error: error.name });
    }
});

router.put('/:id', async (req, res) => {
    const paramId = req.params.id;
    try {
        const { key, active } = req.body;
        const publicContentRow = await Language.update({ key, active }, {
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
