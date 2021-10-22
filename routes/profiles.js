const express = require('express');
const router = express.Router();
const { Profile } = require('../db/models');
const JWTManager = require('../middlewares/jwt_manager');

router.get('/', JWTManager.verifyAdminUser, async (req, res) => {
  try {
    const data = await Profile.findAll();
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
      data = await Profile.findOne({
        where: { id: paramId }
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
    const { userId, phone, profilePicture, cvPath } = req.body;
    const data = await Profile.create({ userId, phone, profilePicture, cvPath });
    return res.send({ ok: 'siker' });
  } catch (error) {
    console.log(error);
    return res.send({ error: error.name });
  }
});

router.put('/:id', JWTManager.verifyAdminUser, async (req, res) => {
  const paramId = req.params.id;
  try {
    const { userId, phone, profilePicture, cvPath } = req.body;
    const data = await Profile.update({ userId, phone, profilePicture, cvPath }, {
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
    const data = await Profile.destroy({
      where: { id: paramId }
    });
  } catch (error) {
    console.log(error);
    return res.send({ error: error.name });
  }
  return res.send({ ok: 'siker' });
});

module.exports = router;
