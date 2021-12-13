'use strict';
const jwt = require('jsonwebtoken');
const fs = require('fs');

class JWTManager {
    // admin jogú felhasználói authorizációra szükséges ellenőrzés JWT-vel és RSA publikus kulccsal
    static verifyAdminUser(req, res, next) {
        try {
            const authHeader = req.headers['authorization'];
            const token = authHeader && authHeader.split(' ')[1];
            if (token == null) return res.sendStatus(401);
            const publicKey = fs.readFileSync(process.env.JWT_SECRET_PUBLIC_KEY);
            jwt.verify(token, publicKey, { alrogithms: ['RS256'] }, (err, user) => {
                if (err) return res.sendStatus(401);
                if (user.roleId != 3 && user.roleId != 2) return res.sendStatus(403);
                next();
            });
        } catch (ex) {
            console.log(ex);
            return res.send(ex);
        }
    }
    // szuper admin jogú felhasználói authorizációra szükséges ellenőrzés JWT-vel és RSA publikus kulccsal
    static verifySuperAdminUser(req, res, next) {
        try {
            const authHeader = req.headers['authorization'];
            const token = authHeader && authHeader.split(' ')[1];
            if (token == null) return res.sendStatus(401);
            const publicKey = fs.readFileSync(process.env.JWT_SECRET_PUBLIC_KEY);
            jwt.verify(token, publicKey, { alrogithms: ['RS256'] }, (err, user) => {
                if (err) return res.sendStatus(401);
                if (user.roleId != 2) return res.sendStatus(403);
                next();
            });
        } catch (ex) {
            console.log(ex);
            return res.send(ex);
        }
    }
    //email cím kinyerése felhasználói tokenből
    static getEmailByToken(header) {
        const authHeader = header;
        const token = authHeader && authHeader.split(' ')[1];
        if (token == null) return 'forbidden';
        const publicKey = fs.readFileSync(process.env.JWT_SECRET_PUBLIC_KEY);
        const tokenData = jwt.verify(token, publicKey, { alrogithms: ['RS256'] });
        return tokenData.email;
    }
}

module.exports = JWTManager;