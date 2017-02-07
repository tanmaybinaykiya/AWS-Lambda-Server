var dynogels = require ("./dynogelsConfig");

module.exports.createTables = function () {
    return new Promise(function (resolve, reject) {
        dynogels.createTables(function (err) {
            if (err) {
                reject(err);
            } else {
                resolve(err);
            }
        });
    });
}
