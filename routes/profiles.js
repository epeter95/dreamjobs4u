const express = require('express');
const router = express.Router();
const { Profile, User } = require('../db/models');
const JWTManager = require('../middlewares/jwt_manager');
const FileManager = require('../classes/file_manager');
//profil adatok visszaadása publikus felületnek token alapján
router.get('/getProfileDataForPublic', async (req, res) => {
  try {
    const email = JWTManager.getEmailByToken(req.headers['authorization']);
    if (email == 'forbidden') {
      return res.sendStatus(403);
    }
    const userData = await User.findOne({
      where: { email: email },
      include: [Profile],
      attributes: ['email', 'firstName', 'lastName']
    });
    return res.send(userData);
  } catch (error) {
    console.log(error);
    return res.send({ error: error.name });
  }
});
//profil adatok módosítása token alapján
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
    const directoryName = userData.id + '/user_cv';
    const directoryRoot = './public/users/' + directoryName;
    const cvPath = await FileManager.handleFileUpload(req, directoryRoot, directoryName, 'cvPath');
    if(cvPath){
      const profileData = await Profile.update({
        jobTitle, age, currentSalary, expectedSalary, description,
        country, city, zipcode, phone, address,cvPath
      },
        { where: { userId: userData.id }, }
      );
    }else{
      const profileData = await Profile.update({
        jobTitle, age, currentSalary, expectedSalary, description,
        country, city, zipcode, phone, address
      },
        { where: { userId: userData.id }, }
      );
    }
    return res.send({ ok: 'siker' });
  } catch (error) {
    console.log(error);
    return res.send({ error: error.name });
  }
});
//profilkép módosítása token alapján
router.post('/public/editProfilePicture', async (req, res) => {
  try {
    const email = JWTManager.getEmailByToken(req.headers['authorization']);
    if (email == 'forbidden') {
      return res.sendStatus(403);
    }
    const userData = await User.findOne({ where: { email: email } });
    const directoryName = userData.id + '/profile_pictures';
    const directoryRoot = './public/users/' + directoryName;
    const imageUrlString = await FileManager.handleFileUpload(req, directoryRoot, directoryName, 'profilePictureUrl',true);
    const profileData = await Profile.update({ profilePicture: imageUrlString }, { where: { userId: userData.id } })
    return res.send({ ok: 'siker' });
  } catch (error) {
    console.log(error);
    return res.send({ error: error.name })
  }
});

module.exports = router;
