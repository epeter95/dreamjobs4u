const express = require('express');
const router = express.Router();
const { Category, CategoryTranslation, Language, Job } = require('../db/models');
const JWTManager = require('../middlewares/jwt_manager');
const Sequelize = require('sequelize');
const FileManager = require('../classes/file_manager');

router.get('/public', async (req, res) => {
  try {
    const data = await Category.findAll({
      include: [CategoryTranslation,Job]
        
    });
    return res.send(data);
  } catch (error) {
    console.log(error);
    return res.send({ error: error.name });
  }
});

router.get('/', JWTManager.verifyAdminUser, async (req, res) => {
  try {
    const data = await Category.findAll({ include: CategoryTranslation });
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
      data = await Category.findOne({
        where: { id: paramId },
        include: CategoryTranslation
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
    const { key, adminName, text } = req.body;
    const data = await Category.create({ key, adminName });
    const directoryName = data.id;
    const directoryRoot = './public/categories/' + directoryName;
    const imageUrlString = await FileManager.handleFileUpload(req, directoryRoot, directoryName, 'pictureUrl');
    data.pictureUrl = imageUrlString;
    data.save();
    const hunLanguage = await Language.findOne({ where: { key: process.env.DEFAULT_LANGUAGE_KEY } });
    const translationData = await CategoryTranslation.create({ categoryId: data.id, languageId: hunLanguage.id, text });
    return res.send({ ok: 'siker' });
  } catch (error) {
    console.log(error);
    return res.send({ error: error.name });
  }
});

router.put('/:id', JWTManager.verifyAdminUser, async (req, res) => {
  const paramId = req.params.id;
  try {
    const { key, adminName } = req.body;
    const directoryName = paramId;
    const directoryRoot = './public/categories/' + directoryName;
    const imageUrlString = await FileManager.handleFileUpload(req, directoryRoot, directoryName, 'pictureUrl');
    if(imageUrlString){
      const data = await Category.update({ key, adminName, pictureUrl: imageUrlString }, {
        where: { id: paramId },
      });
    }else{
      const data = await Category.update({ key, adminName }, {
        where: { id: paramId },
      });
    }

    return res.send({ ok: 'siker' });
  } catch (error) {
    console.log(error);
    return res.send({ error: error.name });
  }
});

router.delete('/:id', JWTManager.verifyAdminUser, async (req, res) => {
  const paramId = req.params.id;
  try {
    const directoryName = data.id;
    const directoryRoot = './public/categories/' + directoryName;
    FileManager.deleteFile(directoryRoot);
    const data = await Category.destroy({
      where: { id: paramId }
    });
  } catch (error) {
    console.log(error);
    return res.send({ error: error.name });
  }
  return res.send({ ok: 'siker' });
});

module.exports = router;