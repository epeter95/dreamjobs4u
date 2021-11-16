const express = require('express');
const router = express.Router();
const { UserAppliedToJob, Job, User, AppliedUserStatus } = require('../db/models');
const JWTManager = require('../middlewares/jwt_manager');

router.get('/', JWTManager.verifyAdminUser, async (req, res) => {
    try {
        const data = await UserAppliedToJob.findAll({ include: [Job, User, AppliedUserStatus] });
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
            data = await UserAppliedToJob.findOne({
                where: { id: paramId },
                include: [Job, User, AppliedUserStatus]
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
        const { userId, jobId, appliedUserStatusId } = req.body;
        const data = await UserAppliedToJob.create({ userId, jobId, appliedUserStatusId });
        return res.send({ ok: 'siker' });
    } catch (error) {
        console.log(error);
        return res.send({ error: error.name });
    }
});

router.put('/:id', JWTManager.verifyAdminUser, async (req, res) => {
    const paramId = req.params.id;
    try {
        const { userId, jobId, appliedUserStatusId } = req.body;
        const data = await UserAppliedToJob.update({ userId, jobId, appliedUserStatusId }, {
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
        const data = await UserAppliedToJob.destroy({
            where: { id: paramId }
        });
    } catch (error) {
        console.log(error);
        return res.send({ error: error.name });
    }
    return res.send({ ok: 'siker' });
});

module.exports = router;