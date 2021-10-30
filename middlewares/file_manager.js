const fs = require('fs');
const { User } = require('../db/models');
const JWTManager = require('../middlewares/jwt_manager');

class FileManager {

    static async handleFileUpload(req, directoryPath, directoryName, fileAttribute) {
        let imageUrlString = '';
        if (req.files && req.files[fileAttribute]) {
            const fileData = req.files[fileAttribute];
            if (!fs.existsSync( directoryPath)) {
                fs.mkdirSync( directoryPath, { recursive: true });
            }
            if (fs.readdirSync( directoryPath).length != 0) {
                fs.rmdirSync( directoryPath, { recursive: true });
                fs.mkdirSync( directoryPath, { recursive: true });
            }
            const path =  directoryPath + '/' + fileData.name;
            fs.writeFile(path, fileData.data, {}, () => {
            });
            imageUrlString = process.env.DOMAIN_NAME + directoryName + '/' + fileData.name;
        } else {
            fs.rmdirSync( directoryPath, { recursive: true });
        }
        return imageUrlString;
    }
}

module.exports = FileManager;