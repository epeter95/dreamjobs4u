var express = require('express');
var router = express.Router();
const {User} = require('../db/models');
const bcrypt = require('bcrypt');
// const JWTManager = require('../classes/jwt_manager');

// router.get('/', JWTManager.verifyServiceToken, async(req, res) => {
//   try{
//     const data = await user.findAll({
//     });
//     return res.send(data);
//   }catch(error){
//     console.log(error);
//     return res.send({error: error.name});
//   }
// });

router.get('/', async(req, res) => {
    try{
      const data = await User.findAll({});
      return res.send(data);
    }catch(error){
      console.log(error);
      return res.send({error: error.name});
    }
  });

router.get('/:id', async(req, res) => {
  var param_id = req.params.id;
  var data;
  try{
    if(param_id){
      data = await User.findOne({ 
        where: { id: param_id },
      });
    }
    return res.send(data);
  }catch(error){
    console.log(error);
    return res.send({error: error.name});
  }
});

router.post('/', async(req, res)=>{
  try{
    const { firstName, lastName, email, password, role} = req.body;
    const hashedPassword = await hashPassword(password);
    const data = await User.create({firstName, lastName, email, password: hashedPassword, role: role || 'basic'});
    return res.send({ok: 'siker'});
  } catch(error) {
    console.log(error);
    return res.send({error: error.name});
  }
});

async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

router.put('/:id', async(req, res)=>{
  var param_id = req.params.id;
  try {
    const { firstName, lastName, email, password, role} = req.body;
    const hashedPassword = await hashPassword(password);
    const userRow = await User.update({firstName, lastName, email, hashedPassword, role},{ 
      where: { id: param_id },
    });

    return res.send({ok: 'siker'});
  }catch(error){
    console.log(error);
    return res.send({error: error.name});
  }  
});

router.delete('/:id', async(req, res)=>{
  var param_id = req.params.id;
  try{
    const data = await User.destroy({
      where: { id: param_id } 
    });
  }catch(error){
    console.log(error);
    return res.send({error: error.name});
  }
  return res.send({ok: 'siker'});
});

module.exports = router;
