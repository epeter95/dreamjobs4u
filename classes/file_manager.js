const fs = require('fs');

class FileManager {

    static async handleFileUpload(req, directoryPath, directoryName, fileAttribute, isDeleteNeeded) {
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
            if(isDeleteNeeded){
                fs.rmdirSync( directoryPath, { recursive: true });
            }
        }
        return imageUrlString;
    }

    static createFileTmp(req, attribute){
        let tmpPath = '';
        if (req.files && req.files[attribute]) {
            const fileData = req.files[attribute];
            tmpPath = './public/tmp/' + fileData.name;
            fs.writeFile(tmpPath, fileData.data, {}, () => {});
        } 
        return tmpPath;
    }

    static readFile(url){
        const file = fs.readFileSync(url)
        return file;
    }

    static deleteFile(url){
        fs.rmSync( url, { recursive: true, force: true });
    }
}

module.exports = FileManager;