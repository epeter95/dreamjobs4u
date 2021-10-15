const express = require('express');
const router = express.Router();
const { PublicContent, PagePlace, Language, PublicContentTranslation } = require('../db/models');
const JWTManager = require('../middlewares/jwt_manager');

router.get('/',JWTManager.verifyAdminUser, async (req, res) => {
  try {
    const data = await PublicContent.findAll({
      include: [PagePlace, PublicContentTranslation]
    });
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
      data = await PublicContent.findOne({
        where: { id: paramId },
        include: [
          PagePlace
        ]
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
    const { key, adminName, pagePlaceId, link, title } = req.body;
    const data = await PublicContent.create({ key, adminName, pagePlaceId, link });
    const hunLanguage = await Language.findOne({ where: { key: process.env.DEFAULT_LANGUAGE_KEY } });
    const translationData = await PublicContentTranslation.create({ publicContentId: data.id, languageId: hunLanguage.id, title });
    return res.send({ ok: 'siker' });
  } catch (error) {
    console.log(error);
    return res.send({ error: error.name });
  }
});

router.put('/:id',JWTManager.verifyAdminUser, async (req, res) => {
  const paramId = req.params.id;
  try {
    const { key, adminName, pagePlaceId, link } = req.body;
    const data = await PublicContent.update({ key, adminName, pagePlaceId, link }, {
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
    const data = await PublicContent.destroy({
      where: { id: paramId }
    });
  } catch (error) {
    console.log(error);
    return res.send({ error: error.name });
  }
  return res.send({ ok: 'siker' });
});

router.get('/getByPagePlaceKey/:key', JWTManager.verifyAdminUser,  async(req, res) => {
  var pagePlaceKeyParam = req.params.key;
  try {
    let result = new Array();
    if (pagePlaceKeyParam) {
      result = await PublicContent.findAll({
        include: [
          { model: PagePlace, where: { key: pagePlaceKeyParam } }
        ],
      });
    }
    return res.send(result);
  } catch(error) {
    console.log(error);
    return res.send({error: error.name});
  }
});

module.exports = router;