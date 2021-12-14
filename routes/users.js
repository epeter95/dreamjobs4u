const express = require('express');
const router = express.Router();
const { User, Role, Profile, Category, CategoryTranslation, UserAppliedToJob, Job } = require('../db/models');
const bcrypt = require('bcrypt');
const JWTManager = require('../middlewares/jwt_manager');
const FileManager = require('../classes/file_manager');
const Mailer = require('../classes/mailer');
//monogram és profilkép visszaadása publikus felületnek
router.get('/getDataForPublic', async (req, res) => {
  try {
    const email = JWTManager.getEmailByToken(req.headers['authorization']);
    if (email == 'forbidden') {
      return res.sendStatus(403);
    }
    const userData = await User.findOne({ where: { email: email }, include: Profile });
    const monogram = userData.firstName[0] + userData.lastName[0];
    return res.send({ monogram: monogram, profilePicture: userData.Profile.profilePicture });
  } catch (error) {
    console.log(error);
    return res.send({ error: error.name });
  }
});
//név és email + preferált kategóriák visszaadása token alapján
router.get('/getUserDataWithCategoriesForPublic', async (req, res) => {
  try {
    const email = JWTManager.getEmailByToken(req.headers['authorization']);
    if (email == 'forbidden') {
      return res.sendStatus(403);
    }
    const userData = await User.findOne({
      where: { email: email },
      attributes: ['email', 'firstName', 'lastName'],
      include: { model: Category, include: CategoryTranslation }
    });
    return res.send(userData);
  } catch (error) {
    console.log(error);
    return res.send({ error: error.name });
  }
});
//preferált kategóriák visszaadása token alapján
router.get('/public/preferredCategories', async (req,res)=>{
  try{
    const email = JWTManager.getEmailByToken(req.headers['authorization']);
    if (email == 'forbidden') {
      return res.sendStatus(403);
    }
    const userData = await User.findOne({
      where: { email: email },
      attributes: ['id'],
      include: { model: Category, include: [CategoryTranslation, Job] }
    });
    return res.send(userData);
  }catch(error){
    return res.send({error: error.name});
  }
})
//név módosítása token alapján
router.post('/public/modifyUserData', async (req, res) => {
  try {
    const email = JWTManager.getEmailByToken(req.headers['authorization']);
    if (email == 'forbidden') {
      return res.sendStatus(403);
    }
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
//email küldése állásra jelentkezett felhasználónak ( esetleges válasz üzenet jelentkezésre )
router.post('/public/sendAnswerToAppliedUser', async (req, res) => {
  try {
    const email = JWTManager.getEmailByToken(req.headers['authorization']);
    if (email == 'forbidden') {
      return res.sendStatus(403);
    }
    const { message, toEmail, jobName, jobCompany, appliedUserStatusId, jobId, userId } = req.body;
    let fileData;
    let fileName;
    let filePath;
    if (req.files && req.files['fileData']) {
      console.log("van fájl");
      fileData = req.files['fileData'];
      fileName = fileData.name;
      filePath = FileManager.createFileTmp(req,'fileData');
    }
    await UserAppliedToJob.update({ appliedUserStatusId }, {
      where: { jobId: jobId, userId: userId },
    });
    console.log(filePath);
    const mailSubject = 'Válasz a ' + jobName + '( ' + jobCompany + ' ) állás jelentkezésre';
    if(filePath){
      await Mailer.sendMail(email, toEmail, mailSubject, message, [{ filename: fileName, path: filePath }], filePath);
    }else{
      await Mailer.sendMail(email, toEmail, mailSubject, message, [], '');
    }
    return res.send({ status: 'ok' });
  } catch (error) {
    console.log(error);
  }
});
//felhasználókhoz preferált kategóriák rendelése token alapján
router.post('/public/addUserCategories', async (req, res) => {
  try {
    let categories = req.body.categories;
    const email = JWTManager.getEmailByToken(req.headers['authorization']);
    if (email == 'forbidden') {
      return res.sendStatus(403);
    }
    console.log(email);
    let userRow = await User.findOne({ where: { email: email } });
    console.log(userRow);
    await userRow.setCategories([]);
    console.log("categories removed");
    for (let i = 0; i < categories.length; ++i) {
      const categoryRow = await Category.findOne({ where: { id: categories[i].id } });
      await userRow.addCategory(categoryRow);
    }
    return res.send({ status: 'ok' });
  } catch (error) {
    console.log(error);
  }
});
//felhasználói jelszó módosítása token alapján, nem egyező jelenlegi jelszó esetén hibaüzenet visszadobása
router.post('/public/changePassword', async (req, res) => {
  try {
    const email = JWTManager.getEmailByToken(req.headers['authorization']);
    if (email == 'forbidden') {
      return res.sendStatus(403);
    }
    const { currentPassword, password } = req.body;
    const data = await User.findOne({ where: { email: email } });
    const isAuthenticated = await bcrypt.compare(currentPassword, data.password)
    if (!isAuthenticated) {
      return res.sendStatus(401);
    } else {
      const hashedPassword = await hashPassword(password);
      const updateData = await User.update({ password: hashedPassword }, { where: { email: email } });
      return res.send({ ok: 'siker' });
    }
  } catch (error) {
    console.log(error);
    return res.send({ error: error.name });
  }
});
//összes felhasználó lekérdezése adminisztratív felületre szuper admin jogosultsággal
router.get('/', JWTManager.verifySuperAdminUser, async (req, res) => {
  await getAllUserForAdmin(req,res, [2,3,4,5]);
});
//összes admin jogú felhasználó lekérdezése adminisztratív felületre szuper admin jogosultsággal
router.get('/adminUsers', JWTManager.verifySuperAdminUser, async (req, res) => {
  await getAllUserForAdmin(req,res, [2,3]);
});
//összes publikus jogú felhasználó lekérdezése adminisztratív felületre admin jogosultsággal
router.get('/publicUsers', JWTManager.verifyAdminUser, async (req, res) => {
  await getAllUserForAdmin(req,res, [4,5]);
});

async function getAllUserForAdmin(req,res, roleIds){
  try {
    const data = await User.findAll({ include: Role, where: {roleId: roleIds }});
    return res.send(data);
  } catch (error) {
    console.log(error);
    return res.send({ error: error.name });
  }
}
//egy admin jogú felhasználó lekérdezése adminisztratív felületre szuper admin jogosultsággal
router.get('/adminUsers/:id', JWTManager.verifySuperAdminUser, async (req, res) => {
  await getOneUserForAdmin(req,res);
});
//egy publikus jogú felhasználó lekérdezése adminisztratív felületre admin jogosultsággal
router.get('/publicUsers/:id', JWTManager.verifyAdminUser, async (req, res) => {
  await getOneUserForAdmin(req,res);
});

async function getOneUserForAdmin(req,res){
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
}
//publikus jogú felhasználó létrehozása admin jogosultsággal
router.post('/publicUsers', JWTManager.verifyAdminUser, async (req, res) => {
  await postUser(req,res);
});
//admin jogú felhasználó létrehozása adminisztratív felületre szuper admin jogosultsággal
router.post('/adminUsers', JWTManager.verifySuperAdminUser, async (req, res) => {
  await postUser(req,res);
});

async function postUser(req,res){
  try {
    const { firstName, lastName, email, password, roleId } = req.body;
    const hashedPassword = await hashPassword(password);
    const data = await User.create({ firstName, lastName, email, password: hashedPassword, roleId });
    return res.send({ ok: 'siker' });
  } catch (error) {
    console.log(error);
    return res.send({ error: error.name });
  }
}
//admin jogú felhasználó létrehozása adminisztratív felületre
async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}
//admin jogú felhasználó módosítása adminisztratív felületre szuper admin jogosultsággal
router.put('/adminUsers/:id', JWTManager.verifySuperAdminUser, async (req, res) => {
  await putUser(req,res)
});
//publikus jogú felhasználó módosítása adminisztratív felületre admin jogosultsággal
router.put('/publicUsers/:id', JWTManager.verifyAdminUser, async (req, res) => {
  await putUser(req,res)
});

async function putUser(req,res){
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
}
//admin jogú felhasználó törlése adminisztratív felületről szuper admin jogosultsággal
router.delete('/adminUsers/:id', JWTManager.verifySuperAdminUser, async (req, res) => {
  await deleteUser(req,res)
});
//publikus jogú felhasználó törlése adminisztratív felületről admin jogosultsággal
router.delete('/publicUsers/:id', JWTManager.verifyAdminUser, async (req, res) => {
  await deleteUser(req,res)
});

async function deleteUser(req,res){
  const paramId = req.params.id;
  try {
    FileManager.deleteFile('./public/users/'+paramId);
    const data = await User.destroy({
      where: { id: paramId }
    });
    return res.send({ ok: 'siker' });
  } catch (error) {
    console.log(error);
    return res.send({ error: error.name });
  }
}

module.exports = router;
