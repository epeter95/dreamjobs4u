var express = require('express');
var router = express.Router();
const {PagePlace} = require('../db/models');
// const JWTManager = require('../classes/jwt_manager');

// router.get('/', JWTManager.verifyServiceToken, async(req, res) => {
//   try{
//     const data = await PagePlace.findAll({
//     });
//     return res.send(data);
//   }catch(error){
//     console.log(error);
//     return res.send({error: error.name});
//   }
// });

router.get('/', async(req, res) => {
    try{
      const data = await PagePlace.findAll({});
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
      data = await PagePlace.findOne({ 
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
    const data = await PagePlace.create({
      key: req.body.key,
      name: req.body.name
    });

    return res.send({ok: 'siker'});
  } catch(error) {
    console.log(error);
    return res.send({error: error.name});
  }
});

router.put('/:key', async(req, res)=>{
  var param_key = req.params.key;
  console.log(req.params.key)
  try {
    var pagePlaceRow = await PagePlace.findOne({ 
      where: { key: param_key },
    });

    if (pagePlaceRow) {
      pagePlaceRow.name = req.body.name;
      console.log(req.body.name)
      pagePlaceRow.save();
    }

    return res.send({ok: 'siker'});
  }catch(error){
    console.log(error);
    return res.send({error: error.name});
  }  
});

router.delete('/:id', async(req, res)=>{
  var param_id = req.params.id;
  try{
    const data = await PagePlace.destroy({
      where: { id: param_id } 
    });
  }catch(error){
    console.log(error);
    return res.send({error: error.name});
  }
  return res.send({ok: 'siker'});
});

module.exports = router;
