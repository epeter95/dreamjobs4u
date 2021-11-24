const express = require('express');
const router = express.Router();
const { Event, User, Job, JobTranslation,Profile } = require('../db/models');
const JWTManager = require('../middlewares/jwt_manager');
const Mailer = require('../classes/mailer');

router.get('/public/getEventsByToken', async (req, res) => {
    try {
        const email = JWTManager.getEmailByToken(req.headers['authorization']);
        if (email == 'forbidden') {
          return res.sendStatus(403);
        }
        const user = await User.findOne({where: {email: email}});
        const data = await Event.findAll({ include: [{model: User, attributes: ['id','firstName','lastName'], include: Profile}, {model: Job, include: JobTranslation}], where:{ownerId: user.id} });
        return res.send(data);
    } catch (error) {
        console.log(error);
        return res.send({ error: error.name });
    }
});


router.get('/public/getUserIdByToken', async (req, res) => {
    try {
        const email = JWTManager.getEmailByToken(req.headers['authorization']);
        if (email == 'forbidden') {
          return res.sendStatus(403);
        }
        const user = await User.findOne({where: {email: email}});
        return res.send({userId: user.id});
    }catch(error){
        console.log(error);
        return res.send({error: error.name});
    }
});

router.get('/public/getEventByToken/:id', async (req, res) => {
    try {
        const eventId = req.params.id;
        const email = JWTManager.getEmailByToken(req.headers['authorization']);
        if (email == 'forbidden') {
          return res.sendStatus(403);
        }
        const user = await User.findOne({where: {email: email}});
        const data = await Event.findOne({ include: [{model: User, attributes: ['id','firstName','lastName','email']}], where:{link: eventId} });
        return res.send(data);
    } catch (error) {
        console.log(error);
        return res.send({ error: error.name });
    }
});

router.post('/public/createEvent', async (req, res) => {
    try {
        const { jobId, users, startDate } = req.body;
        const email = JWTManager.getEmailByToken(req.headers['authorization']);
        if (email == 'forbidden') {
          return res.sendStatus(403);
        }
        console.log({jobId, users});
        const owner = await User.findOne({where: {email: email}});
        const date = new Date();
        const link = 'esemeny'+date.getTime();
        const data = await Event.create({ jobId, ownerId: owner.id, link, startDate });
        await data.setUsers([]);
        for (let i = 0; i < users.length; ++i) {
          const userRow = await User.findOne({ where: { id: users[i] } });
          const message = 'Tisztelt '+userRow.lastName+ ' '+ userRow.firstName+'. Ezúton értesítjük, hogy '+startDate+' időpontban esemény meghívást kapott. Amint elindult a videóhívás, emailben értesítjük a szükséges jelszóval a csatlakozáshoz. Az esemény a következő címen lesz elérhető: <br> https://sweetjobs.herokuapp.com/esemenyek/'+link
          await Mailer.sendMail(email, userRow.email, 'Eseményre való meghívás', message, [], '');
          await data.addUser(userRow);
        }
        return res.send({ ok: 'siker' });
    } catch (error) {
        console.log(error);
        return res.send({ error: error.name });
    }
});

router.delete('/public/delete/:id', async (req, res) => {
    const paramId = req.params.id;
    try {
        const email = JWTManager.getEmailByToken(req.headers['authorization']);
        if (email == 'forbidden') {
          return res.sendStatus(403);
        }
        const data = await Event.destroy({
            where: { id: paramId }
        });
    } catch (error) {
        console.log(error);
        return res.send({ error: error.name });
    }
    return res.send({ ok: 'siker' });
});

router.get('/', JWTManager.verifyAdminUser, async (req, res) => {
    try {
        const data = await Event.findAll({ include: User });
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
            data = await Event.findOne({
                where: { id: paramId },
                include: User
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
        const { jobId, users } = req.body;
        const email = JWTManager.getEmailByToken(req.headers['authorization']);
        if (email == 'forbidden') {
          return res.sendStatus(403);
        }
        const owner = await User.findOne({where: {email: email}});
        const date = new Date();
        const link = 'event'+date.getTime();
        const data = await Event.create({ jobId, ownerId: owner.id, link});
        await data.setUsers([]);
        for (let i = 0; i < users.length; ++i) {
          const userRow = await User.findOne({ where: { id: users[i].id } });
          await data.addUser(userRow);
        }
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
        const data = await Event.update({ key, adminName }, {
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
        const data = await Event.destroy({
            where: { id: paramId }
        });
    } catch (error) {
        console.log(error);
        return res.send({ error: error.name });
    }
    return res.send({ ok: 'siker' });
});

module.exports = router;