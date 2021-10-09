'use strict';
const jwt = require('jsonwebtoken');
const fs = require('fs');

class JWTManager {
    static verifyAdminUser(req, res, next) {
        try {
            const authHeader = req.headers['authorization'];
            const token = authHeader && authHeader.split(' ')[1];
            if (token == null) return res.sendStatus(401);
            const publicKey = fs.readFileSync(process.env.JWT_SECRET_PUBLIC_KEY);
            jwt.verify(token, publicKey,{alrogithms: ['RS256']}, (err, user) => {
                if (err) return res.sendStatus(401);
                if (user.role != 'admin') return res.sendStatus(403);
                next();
            });
        } catch (ex) {
            console.log(ex);
            return res.send(ex);
        }
    }
}

module.exports = JWTManager;