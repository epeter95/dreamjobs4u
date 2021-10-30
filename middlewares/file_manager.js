const fs = require('fs');
const { User } = require('../db/models');
const JWTManager = require('../middlewares/jwt_manager');

class FileManager {

    static async handleFileUpload(req, directoryName, fileAttribute, idNeeded) {
        let imageUrlString = '';
        if (req.files && req.files[fileAttribute]) {
            const email = JWTManager.getEmailByToken(req.headers['authorization']);
            const userData = await User.findOne({ where: { email: email } });
            if (email == 'forbidden') {
                return res.sendStatus(403);
            }
            const directoryRoot = './public/users/' + userData.id + directoryName;
            const fileData = req.files[fileAttribute];
            if (!fs.existsSync( directoryRoot)) {
                fs.mkdirSync( directoryRoot, { recursive: true });
            }
            if (fs.readdirSync( directoryRoot).length != 0) {
                fs.rmdirSync( directoryRoot, { recursive: true });
                fs.mkdirSync( directoryRoot, { recursive: true });
            }
            const path =  directoryRoot + '/' + fileData.name;
            fs.writeFile(path, fileData.data, {}, () => {
            });
            imageUrlString = userData.id + directoryName + '/' + fileData.name;
            if(idNeeded){
                return {imageUrlString: imageUrlString, userId: userData.id};
            }
        } else {
            fs.rmdirSync( directory, { recursive: true });
            return imageUrlString;
        }
    }
}

module.exports = FileManager;