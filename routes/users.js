const express = require('express');
const router = express.Router();
const { User, Role, Profile } = require('../db/models');
const bcrypt = require('bcrypt');
const JWTManager = require('../middlewares/jwt_manager');

router.get('/getDataForPublic', async (req, res) => {
  try {
    const email = JWTManager.getEmailByToken(req.headers['authorization']);
    const userData = await User.findOne({ where: { email: email }, include: Profile });
    const monogram = userData.firstName[0] + userData.lastName[0];
    return res.send({ monogram: monogram, profilePicture: userData.Profile.profilePicture });
  } catch (error) {
    console.log(error);
    return res.send({ error: error.name });
  }
});

router.post('/public/modifyUserData', async (req, res) => {
  try {
    const email = JWTManager.getEmailByToken(req.headers['authorization']);
    const { firstName, lastName } = req.body;
    const userData = await User.update(
      { firstName, lastName },
      { where: { email: email } }
    );
    return res.send({ ok: 'siker' });
  } catch (error) {
    console.log(error);
    return res.send({ error: error.name });
  }
});


router.post('/public/changePassword', async (req, res) => {
  try {
    const email = JWTManager.getEmailByToken(req.headers['authorization']);
    const { currentPassword, password } = req.body;
    const data = await User.findOne({ where: { email: email } });
    const isAuthenticated = await bcrypt.compare(currentPassword, data.password)
    if (!isAuthenticated) {
      return res.sendStatus(401);
    }else{
      const hashedPassword = await hashPassword(password);
      const updateData = await User.update({password: hashedPassword},{ where: { email: email } });
      return res.send({ ok: 'siker' });
    }
  } catch (error) {
    console.log(error);
    return res.send({ error: error.name });
  }
});

router.get('/', JWTManager.verifyAdminUser, async (req, res) => {
  try {
    const data = await User.findAll({ include: Role });
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
      data = await User.findOne({
        where: { id: paramId },
        include: Role
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
    const { firstName, lastName, email, password, roleId } = req.body;
    const hashedPassword = await hashPassword(password);
    const data = await User.create({ firstName, lastName, email, password: hashedPassword, roleId });
    return res.send({ ok: 'siker' });
  } catch (error) {
    console.log(error);
    return res.send({ error: error.name });
  }
});

async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

router.put('/:id', JWTManager.verifyAdminUser, async (req, res) => {
  const paramId = req.params.id;
  try {
    const { firstName, lastName, email, password, roleId } = req.body;
    const hashedPassword = await hashPassword(password);
    const data = await User.update({ firstName, lastName, email, hashedPassword, roleId }, {
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
