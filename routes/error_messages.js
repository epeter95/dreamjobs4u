const express = require('express');
const router = express.Router();
const { ErrorMessage, ErrorMessageTranslation, Language } = require('../db/models');
const JWTManager = require('../middlewares/jwt_manager');
//jogosultság nélkül hibaüzenetek és fordítások lekérdezése
router.get('/public', async (req, res) => {
  try {
    const data = await ErrorMessage.findAll({
      include: ErrorMessageTranslation
    });
    return res.send(data);
  } catch (error) {
    console.log(error);
    return res.send({ error: error.name });
  }
});
//adminisztratív jogosultsággal egy hibaüzenet és fordítások lekérdezése
router.get('/', JWTManager.verifyAdminUser, async (req, res) => {
  try {
    const data = await ErrorMessage.findAll({ include: ErrorMessageTranslation });
    return res.send(data);
  } catch (error) {
    console.log(error);
    return res.send({ error: error.name });
  }
});
//adminisztratív jogosultsággal egy hibaüzenet és fordítások lekérdezése
router.get('/:id', JWTManager.verifyAdminUser, async (req, res) => {
  const paramId = req.params.id;
  try {
    let data;
    if (paramId) {
      data = await ErrorMessage.findOne({
        where: { id: paramId },
        include: ErrorMessageTranslation
      });
    }
    return res.send(data);
  } catch (error) {
    console.log(error);
    return res.send({ error: error.name });
  }
});
//adminisztratív jogosultsággal hibaüzenet létrehozása magyar fordítással
router.post('/', JWTManager.verifyAdminUser, async (req, res) => {
  try {
    const { key, adminName, text } = req.body;
    const data = await ErrorMessage.create({ key, adminName });
    const hunLanguage = await Language.findOne({ where: { key: process.env.DEFAULT_LANGUAGE_KEY } });
    const translationData = await ErrorMessageTranslation.create({ errorMessageId: data.id, languageId: hunLanguage.id, text });
    return res.send({ ok: 'siker' });
  } catch (error) {
    console.log(error);
    return res.send({ error: error.name });
  }
});
//adminisztratív jogosultsággal hibaüzenet módosítása
router.put('/:id', JWTManager.verifyAdminUser, async (req, res) => {
  const paramId = req.params.id;
  try {
    const { key, adminName } = req.body;
    const data = await ErrorMessage.update({ key, adminName }, {
      where: { id: paramId },
    });

    return res.send({ ok: 'siker' });
  } catch (error) {
    console.log(error);
    return res.send({ error: error.name });
  }
});
//adminisztratív jogosultsággal hibaüzenet törlése, és hozzá tartozó fordítások törlése
router.delete('/:id', JWTManager.verifyAdminUser, async (req, res) => {
  const paramId = req.params.id;
  try {
    const data = await ErrorMessage.destroy({
      where: { id: paramId }
    });
  } catch (error) {
    console.log(error);
    return res.send({ error: error.name });
  }
  return res.send({ ok: 'siker' });
});

module.exports = router;