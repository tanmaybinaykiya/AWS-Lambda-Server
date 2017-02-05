var braintree = require("braintree");

var gateway = braintree.connect({
    environment: (process.env.BRAINTREE_PRODUCTION === "prOduCtIoN") ? braintree.Environment.Production : braintree.Environment.Sandbox,
    merchantId: process.env.BRAINTREE_MERCHANTID,
    publicKey: process.env.BRAINTREE_PUBLICKEY,
    privateKey: process.env.BRAINTREE_PRIVATEKEY,
});

module.exports.generateClientToken = function () {
    return new Promise((resolve, reject) => {
        gateway.clientToken.generate({}, (err, response) => {
            if (err) {
                console.log("Error getting braintree client token: ", err);
                reject(err);
            } else {
                resolve(response.clientToken);
            }
        });
    });
}
