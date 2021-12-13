const fs = require('fs');

class FileManager {
    //fájl feltöltés request file attribútumából, paraméterként megadott elérési útra, és opcionálisan először törlés segítségével
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
    //ideiglenesen fájl létrehozása alkalmazás struktúrában
    static createFileTmp(req, attribute){
        let tmpPath = '';
        if (req.files && req.files[attribute]) {
            const fileData = req.files[attribute];
            tmpPath = './public/tmp/' + fileData.name;
            fs.writeFile(tmpPath, fileData.data, {}, () => {});
        } 
        return tmpPath;
    }
    //fájl felolvasása alkalmazás könyvtárból url alapján
    static readFile(url){
        const file = fs.readFileSync(url)
        return file;
    }
    //fájl törlése alkalmazás könyvtárból url alapján
    static deleteFile(url){
        fs.rmSync( url, { recursive: true, force: true });
    }
}

module.exports = FileManager;