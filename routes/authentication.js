const express = require('express');
const router = express.Router();
const { User, Profile } = require('../db/models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs');

async function hashPassword(password) {
  return await bcrypt.hash(password, 10);
}

router.post('/register', async (req, res) => {
    try {
        const { firstName, lastName, email, password, roleId } = req.body;
        const hashedPassword = await hashPassword(password);
        const data = await User.create({ firstName, lastName, email, password: hashedPassword, roleId });
        return res.send({ ok: 'siker' });
      } catch (error) {
        console.log(error);
        return res.send({ error: error.name });
      }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const data = await User.findOne({ where: {email: email} });
        if(data){
            const isAuthenticated = await bcrypt.compare(password, data.password)
            if(!isAuthenticated){
                return res.sendStatus(401);
            }
            if(data.role != 'admin'){
                return res.sendStatus(403);
            }
            const privateKey = fs.readFileSync(process.env.JWT_SECRET_KEY, 'utf8');
            const token = jwt.sign({ email: data.email, role: data.role }, privateKey, {algorithm: 'RS256'});
            return res.send({token: token});
        }else{
            res.send({error: 'Nem létező felhasználó!'})
        }
        return res.send({ ok: 'siker' });
    } catch (error) {
        console.log(error);
        return res.send({ error: error.name });
    }
});

router.post('/login/public', async (req, res) => {
    try {
        const { loginEmail, loginPassword } = req.body;
        const data = await User.findOne({ where: {email: loginEmail} });
        if(data){
            console.log("BEJÖTT")
            const isAuthenticated = await bcrypt.compare(loginPassword, data.password)
            if(!isAuthenticated){
                return res.sendStatus(401);
            }
            const privateKey = fs.readFileSync(process.env.JWT_SECRET_KEY, 'utf8');
            const token = jwt.sign({ email: data.email, role: data.role }, privateKey, {algorithm: 'RS256'});
            let profileData = await Profile.findOne({where:{userId: data.id}});
            if(!profileData){
                profileData = await Profile.create({userId: data.id, phone: '', profilePicture: '', cvPath: ''});
            }
            const monogram = data.firstName[0]+data.lastName[0];
            return res.send({token: token, profilePicture: profileData.profilePicture, monogram: monogram});
        }else{
            res.send({error: 'userNotExist'})
        }
        return res.send({ ok: 'siker' });
    } catch (error) {
        console.log(error);
        console.log(error);
        return res.send({ error: error.name });
    }
});

module.exports = router;