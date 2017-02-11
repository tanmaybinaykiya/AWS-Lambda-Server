var braintree = require("braintree");

var schoolDAO = require("./dao/school");
var billingUsageDAO = require("./dao/billingUsage");
var HttpError = require("./errors").HttpError;

module.exports.generateClientToken = function* (credentials) {
    return new Promise((resolve, reject) => {
        var gateway = braintree.connect({
            environment: (process.env.BRAINTREE_PRODUCTION === "PRoDuCtiOn") ? braintree.Environment.Production : braintree.Environment.Sandbox,
            merchantId: credentials.merchantId,
            publicKey: credentials.publicKey,
            privateKey: credentials.privateKey,
        });
        gateway.config.timeout = 10000;
        gateway.clientToken.generate({}, (err, response) => {
            if (err) {
                console.log("Error getting braintree client token: ", err);
                reject(err);
            } else {
                billingUsageDAO.log(response)
                    .then(() => {
                        resolve(response.clientToken);
                    }).catch((err) => {
                        console.log("Error logging to billing usage log: ", err);
                        resolve(response.clientToken);
                    })
            }
        });
    });
}

module.exports.getBraintreeCredentialsByInstitutionAndSchool = function* (institutionCode, schoolCode) {
    var school = yield schoolDAO.getSchoolByInstitutionCodeAndSchoolCode(institutionCode, schoolCode);
    if (!school) {
        throw new HttpError("School not found");
    } else {
        return school.get("braintreeCredentials");
    }
}

module.exports.updateBraintreeCredentialsByInstitutionAndSchool = function* (institutionCode, schoolCode, braintreeCredentials) {
    var school = yield schoolDAO.getSchoolByInstitutionCodeAndSchoolCode(institutionCode, schoolCode);
    if (!school) {
        throw new HttpError("School not found");
    } else {
        var schoolJson = school.toJSON();
        schoolJson.braintreeCredentials = braintreeCredentials;
        yield schoolDAO.updateSchool(schoolJson);
    }
}

module.exports.createCustomer = function (firstName, lastName, nonce, clientDeviceData, credentials) {
    return new Promise((resolve, reject) => {
        console.log("createCustomer: ", {
            firstName: firstName,
            lastName: lastName,
            creditCard: {
                paymentMethodNonce: nonce,
                options: {
                    failOnDuplicatePaymentMethod: false,
                    makeDefault: true,
                    // verifyCard: true
                }
            },
            // deviceData: clientDeviceData
        });
        var gateway = braintree.connect({
            environment: (process.env.BRAINTREE_PRODUCTION === "PRoDuCtiOn") ? braintree.Environment.Production : braintree.Environment.Sandbox,
            merchantId: credentials.merchantId,
            publicKey: credentials.publicKey,
            privateKey: credentials.privateKey,
        });
        gateway.config.timeout = 10000;
        gateway.customer.create({
            firstName: firstName,
            lastName: lastName,
            creditCard: {
                paymentMethodNonce: nonce,
                options: {
                    failOnDuplicatePaymentMethod: false,
                    makeDefault: true,
                    verifyCard: true
                }
            },
            deviceData: clientDeviceData
        }, (err, result) => {
            if (err) {
                console.log("Error getting braintree client token: ", err, result);
                reject(err);
            } else if (result.success) {
                billingUsageDAO.log(result)
                    .then(() => {
                        console.log("Successfully created customer: ", JSON.stringify(result, null, 4));
                        resolve(result.customer);
                    }).catch((err) => {
                        console.log("Error logging to billing usage log: ", err);
                        console.log("Successfully created customer: ", JSON.stringify(result, null, 4));
                        resolve(result.customer);
                    });
            } else {
                console.log("something went wrong. Possibly, customer validation: ", err, JSON.stringify(result, null, 4));
                reject("Customer Validation failed");
            }
        });
    });
}


module.exports.addSubscription = function* (braintreeCredentials, paymentMethod, planId, amount) {
    return new Promise((resolve, reject) => {
        var gateway = braintree.connect({
            environment: (process.env.BRAINTREE_PRODUCTION === "PRoDuCtiOn") ? braintree.Environment.Production : braintree.Environment.Sandbox,
            merchantId: credentials.merchantId,
            publicKey: credentials.publicKey,
            privateKey: credentials.privateKey,
        });
        gateway.config.timeout = 10000;
        gateway.subscription.create({
            paymentMethodToken: someToken,
            planId: planId,
            price: amount
        }, function (err, result) {
            if (err) {
                console.log(err);
            } else {
                console.log(result);
                billingUsageDAO.log(result)
                    .then(() => {
                        console.log("Successfully addSubscription: ", JSON.stringify(result, null, 4));
                        resolve(result.id);
                    }).catch((err) => {
                        console.log("Error logging to billing usage log: ", err);
                        console.log("Successfully addSubscription: ", JSON.stringify(result, null, 4));
                        resolve(result.id);
                    });
            }
        });

    });
}