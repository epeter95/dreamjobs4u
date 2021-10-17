const express = require('express');
const router = express.Router();
const { GeneralMessage, GeneralMessageTranslation, Language } = require('../db/models');
const JWTManager = require('../middlewares/jwt_manager');

router.get('/public', async (req, res) => {
  try {
    const data = await GeneralMessage.findAll({
      include: GeneralMessageTranslation
    });
    return res.send(data);
  } catch (error) {
    console.log(error);
    return res.send({ error: error.name });
  }
});

router.get('/', JWTManager.verifyAdminUser, async (req, res) => {
  try {
    const data = await GeneralMessage.findAll({ include: GeneralMessageTranslation });
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
      data = await GeneralMessage.findOne({
        where: { id: paramId },
        include: GeneralMessageTranslation
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
    const data = await GeneralMessage.create({ key, adminName });
    const hunLanguage = await Language.findOne({ where: { key: process.env.DEFAULT_LANGUAGE_KEY } });
    const translationData = await GeneralMessageTranslation.create({ generalMessageId: data.id, languageId: hunLanguage.id, text });
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
    const data = await GeneralMessage.update({ key, adminName }, {
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
    const data = await GeneralMessage.destroy({
      where: { id: paramId }
    });
  } catch (error) {
    console.log(error);
    return res.send({ error: error.name });
  }
  return res.send({ ok: 'siker' });
});

module.exports = router;