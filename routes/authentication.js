const express = require('express');
const router = express.Router();
const { User, Profile, Role } = require('../db/models');
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
            if(data.roleId != 2 && data.roleId != 3){
                return res.sendStatus(403);
            }
            const privateKey = fs.readFileSync(process.env.JWT_SECRET_KEY, 'utf8');
            const token = jwt.sign({ email: data.email, roleId: data.roleId }, privateKey, {algorithm: 'RS256'});
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
            const isAuthenticated = await bcrypt.compare(loginPassword, data.password)
            if(!isAuthenticated){
                return res.sendStatus(401);
            }
            const privateKey = fs.readFileSync(process.env.JWT_SECRET_KEY, 'utf8');
            const token = jwt.sign({ email: data.email, role: data.role }, privateKey, {algorithm: 'RS256'});
            let profileData = await Profile.findOne({where:{userId: data.id}, include: {model: User, include: Role}});
            if(!profileData){
                await Profile.create({
                    userId: data.id, phone: '', profilePicture: '', cvPath: '',
                    jobTitle: '', age: 0, currentSalary: '', expectedSalary: '',
                    country: '', zipcode: '', city: '', address: '', description: ''
                });
            }
            profileData = await Profile.findOne({where:{userId: data.id}, include: {model: User, include: Role}});
            const monogram = data.firstName[0]+data.lastName[0];
            return res.send({token: token, profilePicture: profileData.profilePicture, monogram: monogram, role: profileData.User.Role.publicKey});
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