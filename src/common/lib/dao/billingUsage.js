var dynogels = require("./dynogelsConfig");
var models = require("../models");

module.exports.log = function (log) {
    var logObject = {
        log: log,
        method: 'Braintree',
        timestamp: new Date().getTime()
    };

    return new Promise(function (resolve, reject) {
        models.BillingUsageLog.create(logObject, function (err, resp) {
            if (err) {
                reject(err);
            } else {
                console.log("logged successfully");
                resolve(resp);
            }
        });
    });
}
