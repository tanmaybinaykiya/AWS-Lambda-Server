var dynogels = require ("./dynogelsConfig");

module.exports.createTables = function () {
    return new Promise(function (resolve, reject) {
        dynogels.createTables(function (err, result) {
            if (err) {
                console.error(err);
                reject(err);
            } else {
                console.log("Success:", result);
                resolve();
            }
        });
    });
}
