const express = require('express');
const router = express.Router();
const { PagePlace } = require('../db/models');
const JWTManager = require('../middlewares/jwt_manager');

router.get('/',JWTManager.verifyAdminUser, async (req, res) => {
  try {
    const data = await PagePlace.findAll({});
    return res.send(data);
  } catch (error) {
    console.log(error);
    return res.send({ error: error.name });
  }
});

router.get('/:id',JWTManager.verifyAdminUser, async (req, res) => {
  const paramId = req.params.id;
  try {
    let data;
    if (paramId) {
      data = await PagePlace.findOne({
        where: { id: paramId },
      });
    }
    return res.send(data);
  } catch (error) {
    console.log(error);
    return res.send({ error: error.name });
  }
});

router.post('/',JWTManager.verifyAdminUser, async (req, res) => {
  try {
    const { key, adminName } = req.body;
    const data = await PagePlace.create({key, adminName});

    return res.send({ ok: 'siker' });
  } catch (error) {
    console.log(error);
    return res.send({ error: error.name });
  }
});

router.put('/:id',JWTManager.verifyAdminUser, async (req, res) => {
  const paramId = req.params.id;
  try {
    const { adminName } = req.body;
    const data = await PagePlace.update({ adminName }, {
      where: { id: paramId },
    });

    return res.send({ ok: 'siker' });
  } catch (error) {
    console.log(error);
    return res.send({ error: error.name });
  }
});

router.delete('/:id',JWTManager.verifyAdminUser, async (req, res) => {
  const paramId = req.params.id;
  try {
    const data = await PagePlace.destroy({
      where: { id: paramId }
    });
  } catch (error) {
    console.log(error);
    return res.send({ error: error.name });
  }
  return res.send({ ok: 'siker' });
});

module.exports = router;
