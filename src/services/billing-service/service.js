var AWS = require('aws-sdk');
var jwt = require('jsonwebtoken');
var user = require("../../common/lib/user");
var payment = require("../../common/lib/payment");
var braintree = require("../../common/lib/braintree");

module.exports.addPaymentMethodForParent = function* () {
    console.log("addPaymentMethodForParent: ", this.request.body, this.params.institutionCode, this.params.schoolCode);
    var requestBody = this.request.body;
    var clientDeviceData = this.request.headers["x-client-device-data"] || this.request.headers["X-Client-Device-Data"];
    if (isValidPaymentMethod(requestBody)) {
        var braintreeCredentials = yield braintree.getBraintreeCredentialsByInstitutionAndSchool(this.params.institutionCode, this.params.schoolCode);
        var brainTreeCustomer = yield braintree.createCustomer(requestBody.firstName, requestBody.lastName, requestBody.nonce, clientDeviceData, braintreeCredentials);
        var creditCardInfo = brainTreeCustomer.creditCards.find((card) => card.default);
        var addedPaymentMethod = yield payment.addPaymentMethod({
            parentEmail: requestBody.parentEmail,
            isDefault: true,
            braintree: {
                token: creditCardInfo.token,
                customerId: brainTreeCustomer.id,
                creditCardMaskedNumber: creditCardInfo.maskedNumber
            }
        });
        console.log("Payment method successfully added: ", paymentMethodSerializer(addedPaymentMethod));
        this.status = 200;
        this.body = paymentMethodSerializer(addedPaymentMethod);
    } else {
        this.status = 400;
    }
};

function isValidPaymentMethod(requestBody) {
    return (requestBody.nonce &&
        requestBody.firstName &&
        requestBody.lastName &&
        requestBody.parentEmail);
}

module.exports.getPaymentMethodForParent = function* () {
    console.log("getPaymentMethodForParent: ", this.request.query.parentEmail, this.request.query.default);
    var queryParams = this.request.query;
    if (queryParams.parentEmail) {
        if (queryParams.default === "true") {
            var paymentMethods = yield payment.getDefaultPaymentMethodForParent(queryParams.parentEmail);
            this.body = paymentMethods.map(method => method.toJSON()).map(paymentMethodSerializer);
        } else {
            var paymentMethods = yield payment.getPaymentMethodsForParent(queryParams.parentEmail);
            this.body = paymentMethods.Items.map(method => method.toJSON()).map(paymentMethodSerializer);
        }
        this.status = 200;
    } else {
        this.status = 400;
    }
};

var paymentMethodSerializer = (method) => ({
    cardNumber: method.cardNumber || method.get("cardNumber"),
    methodId: method.methodId || method.get("methodId"),
    isDefault: (method.isDefault !== undefined) ? method.isDefault : method.get("isDefault")
});

function obfuscateCardNumber(cardNumber) {
    return 'XXXX-XXXX-XXXX-' + cardNumber.slice(-4);
}

module.exports.getBraintreeClientToken = function* () {
    console.log("getBraintreeClientToken: ", this.params.institutionCode, this.params.schoolCode);
    var braintreeCredentials = yield braintree.getBraintreeCredentialsByInstitutionAndSchool(this.params.institutionCode, this.params.schoolCode);
    var clientToken = yield braintree.generateClientToken(braintreeCredentials);
    this.body = {
        clientToken: clientToken
    }
    this.status = 200;
};

module.exports.updateBraintreeConfig = function* () {
    console.log("updateBraintreeCredentials: ", this.params.institutionCode, this.params.schoolCode, this.request.body);
    var requestBody = this.request.body;
    if (requestBody.merchantId && requestBody.publicKey && requestBody.privateKey) {
        var braintreeCredentials = {
            merchantId: requestBody.merchantId,
            publicKey: requestBody.publicKey,
            privateKey: requestBody.privateKey,
            planId: requestBody.planId
        };
        yield braintree.updateBraintreeCredentialsByInstitutionAndSchool(this.params.institutionCode, this.params.schoolCode, braintreeCredentials);
        this.status = 200;
    } else {
        this.status = 400;
    }
};
