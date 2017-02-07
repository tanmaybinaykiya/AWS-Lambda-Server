var dynogels = require ("./dynogelsConfig");

module.exports.addPaymentMethod = function (paymentMethod) {
    return new Promise(function (resolve, reject) {
        models.PaymentMethod.create(paymentMethod, function (err, resp) {
            if (err) {
                reject(err);
            } else {
                resolve(resp);
            }
        });
    });
}

module.exports.getPaymentMethodsForParentEmail = function (parentEmail) {
    return new Promise((resolve, reject) => {
        models.PaymentMethod.query(parentEmail)
            .loadAll()
            .usingIndex('ParentMethodIndex')
            .exec((err, result) => {
                if (err) {
                    console.log("Error: ", err);
                    reject(err);
                } else {
                    resolve(result);
                }
            });
    });
}
