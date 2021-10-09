const express = require('express');
const router = express.Router();
const { User } = require('../db/models');
const bcrypt = require('bcrypt');
const JWTManager = require('../middlewares/jwt_manager');

router.get('/',JWTManager.verifyAdminUser, async (req, res) => {
  try {
    const data = await User.findAll({});
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
      data = await User.findOne({
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
    const { firstName, lastName, email, password, role } = req.body;
    const hashedPassword = await hashPassword(password);
    const data = await User.create({ firstName, lastName, email, password: hashedPassword, role: role || 'basic' });
    return res.send({ ok: 'siker' });
  } catch (error) {
    console.log(error);
    return res.send({ error: error.name });
  }
});

async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

router.put('/:id',JWTManager.verifyAdminUser, async (req, res) => {
  const paramId = req.params.id;
  try {
    const { firstName, lastName, email, password, role } = req.body;
    const hashedPassword = await hashPassword(password);
    const data = await User.update({ firstName, lastName, email, hashedPassword, role }, {
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
    const data = await User.destroy({
      where: { id: paramId }
    });
  } catch (error) {
    console.log(error);
    return res.send({ error: error.name });
  }
  return res.send({ ok: 'siker' });
});

module.exports = router;
