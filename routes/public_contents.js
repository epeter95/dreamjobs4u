var express = require('express');
var router = express.Router();
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
      include: PagePlace
    });
    return res.send(data);
  } catch (error) {
    console.log(error);
    return res.send({ error: error.name });
  }
});

router.get('/:id', async (req, res) => {
  const param_id = req.params.id;
  var data;
  try {
    if (param_id) {
      data = await PublicContent.findOne({
        where: { id: param_id },
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
  var param_id = req.params.id;
  try {
    const { key, name, pagePlaceID, link } = req.body;
    const publicContentRow = await PublicContent.update({ key, name,pagePlaceID, link }, {
      where: { id: param_id },
    });

    return res.send({ ok: 'siker' });
  } catch (error) {
    console.log(error);
    return res.send({ error: error.name });
  }
});

router.delete('/:id', async (req, res) => {
  var param_id = req.params.id;
  try {
    const data = await PublicContent.destroy({
      where: { id: param_id }
    });
  } catch (error) {
    console.log(error);
    return res.send({ error: error.name });
  }
  return res.send({ ok: 'siker' });
});

module.exports = router;