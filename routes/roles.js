const express = require('express');
const router = express.Router();
const { Role, RoleTranslation } = require('../db/models');
const JWTManager = require('../middlewares/jwt_manager');
const { Op } = require("sequelize");
//kizárólag publikus jogosultságok visszaadása publikus felületnek fordításokkal
router.get('/public', async (req, res) => {
  try {
    const data = await Role.findAll({
      where: {
        [Op.or]: [
          { key: 'employee' },
          { key: 'employer' }
        ]
      }, include: RoleTranslation
    });
    return res.send(data);
  } catch (error) {
    console.log(error);
    return res.send({ error: error.name });
  }
});
//adminisztratív jogosultsággal szerepkörök és fordításaik lekérdezése
router.get('/', JWTManager.verifyAdminUser, async (req, res) => {
  try {
    const data = await Role.findAll({ include: RoleTranslation });
    return res.send(data);
  } catch (error) {
    console.log(error);
    return res.send({ error: error.name });
  }
});
//adminisztratív jogosultsággal adminisztratív szerepkörök és fordításaik lekérdezése
router.get('/adminRoles', JWTManager.verifySuperAdminUser, async (req, res) => {
  try {
    const data = await Role.findAll({where: {id : 3}});
    return res.send(data);
  } catch (error) {
    console.log(error);
    return res.send({ error: error.name });
  }
});
//adminisztratív jogosultsággal publikus szerepkörök lekérdezése
router.get('/publicRoles', JWTManager.verifyAdminUser, async (req, res) => {
  try {
    const data = await Role.findAll({where: {id : [4,5]}});
    return res.send(data);
  } catch (error) {
    console.log(error);
    return res.send({ error: error.name });
  }
});
//adminisztratív jogosultsággal egy szerepkör és fordításai lekérdezése
router.get('/:id', JWTManager.verifyAdminUser, async (req, res) => {
  const paramId = req.params.id;
  try {
    let data;
    if (paramId) {
      data = await Role.findOne({
        where: { id: paramId },
        include: RoleTranslation
      });
    }
    return res.send(data);
  } catch (error) {
    console.log(error);
    return res.send({ error: error.name });
  }
});
//adminisztratív jogosultsággal egy szerepkör létrehozása
router.post('/', JWTManager.verifyAdminUser, async (req, res) => {
  try {
    const { key, adminName } = req.body;
    const data = await Role.create({ key, adminName });
    return res.send({ ok: 'siker' });
  } catch (error) {
    console.log(error);
    return res.send({ error: error.name });
  }
});
//adminisztratív jogosultsággal egy szerepkör módosítása
router.put('/:id', JWTManager.verifyAdminUser, async (req, res) => {
  const paramId = req.params.id;
  try {
    const { key, adminName } = req.body;
    const data = await Role.update({ key, adminName }, {
      where: { id: paramId },
    });

    return res.send({ ok: 'siker' });
  } catch (error) {
    console.log(error);
    return res.send({ error: error.name });
  }
});
//adminisztratív jogosultsággal egy szerepkör törlése
router.delete('/:id', JWTManager.verifyAdminUser, async (req, res) => {
  const paramId = req.params.id;
  try {
    const data = await Role.destroy({
      where: { id: paramId }
    });
  } catch (error) {
    console.log(error);
    return res.send({ error: error.name });
  }
  return res.send({ ok: 'siker' });
});

module.exports = router;
