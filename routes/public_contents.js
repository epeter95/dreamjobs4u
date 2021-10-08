const express = require('express');
const router = express.Router();
const { PublicContent, PagePlace } = require('../db/models');
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
    const data = await PublicContent.findAll({
      include: { model: PagePlace, required: true }
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
      data = await PublicContent.findOne({
        where: { id: paramId },
        include: [
          PagePlace
        ]
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
    const { key, name, pagePlaceId, link } = req.body;
    const data = await PublicContent.create({ key, name, pagePlaceId, link });
    return res.send({ ok: 'siker' });
  } catch (error) {
    console.log(error);
    return res.send({ error: error.name });
  }
});

router.put('/:id', async (req, res) => {
  const paramId = req.params.id;
  try {
    const { key, name, pagePlaceID, link } = req.body;
    const data = await PublicContent.update({ key, name, pagePlaceID, link }, {
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
    const data = await PublicContent.destroy({
      where: { id: paramId }
    });
  } catch (error) {
    console.log(error);
    return res.send({ error: error.name });
  }
  return res.send({ ok: 'siker' });
});

module.exports = router;