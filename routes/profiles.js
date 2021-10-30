const express = require('express');
const router = express.Router();
const { Profile, User, Role, RoleTranslation } = require('../db/models');
const JWTManager = require('../middlewares/jwt_manager');
const FileManager = require('../middlewares/file_manager');

router.get('/getProfileDataForPublic', async (req, res) => {
  try {
    const email = JWTManager.getEmailByToken(req.headers['authorization']);
    if (email == 'forbidden') {
      return res.sendStatus(403);
    }
    const userData = await User.findOne({
      where: { email: email },
      include: [Profile, { model: Role, include: RoleTranslation }],
      attributes: ['email', 'firstName', 'lastName']
    });
    return res.send(userData);
  } catch (error) {
    console.log(error);
    return res.send({ error: error.name });
  }
});

router.post('/public/modifyProfileData', async (req, res) => {
  try {
    const email = JWTManager.getEmailByToken(req.headers['authorization']);
    if (email == 'forbidden') {
      return res.sendStatus(403);
    }
    const userData = await User.findOne({ where: { email: email } });
    const {
      jobTitle, age, currentSalary, expectedSalary, description,
      country, city, zipcode, phone, address
    } = req.body;
    const profileData = await Profile.update({
      jobTitle, age, currentSalary, expectedSalary, description,
      country, city, zipcode, phone, address
    },
      { where: { userId: userData.id }, }
    );
    return res.send({ ok: 'siker' });
  } catch (error) {
    console.log(error);
    return res.send({ error: error.name });
  }
});

router.post('/public/editProfilePicture', async (req, res) => {
  try {
    const email = JWTManager.getEmailByToken(req.headers['authorization']);
    const userData = await User.findOne({ where: { email: email } });
    if (email == 'forbidden') {
      return res.sendStatus(403);
    }
    const directoryName = userData.id + '/profile_pictures';
    const directoryRoot = './public/users/' + directoryName;
    const imageUrlString = await FileManager.handleFileUpload(req, directoryRoot, directoryName, 'profilePictureUrl', true);
    const profileData = await Profile.update({ profilePicture: imageUrlString }, { where: { userId: userData.id } })
    return res.send({ ok: 'siker' });
  } catch (error) {
    console.log(error);
    return res.send({ error: error.name })
  }
})


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
