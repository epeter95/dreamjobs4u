const fs = require('fs');

class FileManager {

    static handleFileUpload(req, directoryPath, directoryName, fileAttribute) {
        let imageUrlString = '';
        if (req.files && req.files[fileAttribute]) {
            const fileData = req.files[fileAttribute];
            if (!fs.existsSync( directoryPath)) {
                fs.mkdirSync( directoryPath);
            }
            if (fs.readdirSync( directoryPath).length != 0) {
                fs.rmdirSync( directoryPath, { recursive: true });
                fs.mkdirSync( directoryPath);
            }
            const path =  directoryPath + '/' + fileData.name;
            fs.writeFile(path, fileData.data, {}, () => {
            });
            imageUrlString = directoryName + '/' + fileData.name;
        } else {
            fs.rmdirSync( directory, { recursive: true });
        }
        return imageUrlString;
    }
}

module.exports = FileManager;