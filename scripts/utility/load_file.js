const fs = require('fs');

module.exports.loadFile = (path) => {
    return new Promise(function (resolve, reject) {
        fs.readFile (path, 'utf8', function (error, data) {
            if (error) {
                reject(error);
            }
            resolve(data);
        });
    });
};