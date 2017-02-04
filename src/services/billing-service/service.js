var AWS = require('aws-sdk');
var jwt = require('jsonwebtoken');
var payment = require("../../common/lib/payment");

module.exports.addPaymentMethodForParent = function* () {
    console.log("addPaymentMethodForParent: ", this.request.body);
    var requestBody = this.request.body;
    if (isValidPaymentMethod(requestBody)) {
        var addedPaymentMethod = yield payment.addPaymentMethod(requestBody);
        console.log("Payment method successfully added: ", paymentMethodSerializer(addedPaymentMethod));
        this.status = 200;
        this.body = paymentMethodSerializer(addedPaymentMethod);
    } else {
        this.status = 400;
    }
};

function isValidPaymentMethod(requestBody) {
    return requestBody.parentEmail && requestBody.cardNumber && requestBody.cvv && requestBody.postalCode && requestBody.expiration;
}

module.exports.getPaymentMethodForParent = function* () {
    console.log("getPaymentMethodForParent: ", this.request.query.parentEmail, this.request.query.default);
    var queryParams = this.request.query;
    if (queryParams.parentEmail) {
        if (queryParams.default === "true") {
            console.log("default");
            var paymentMethods = yield payment.getDefaultPaymentMethodForParent(queryParams.parentEmail);
            this.body = paymentMethods.map(method => method.toJSON()).map(paymentMethodSerializer);
        } else {
            console.log("Not default");
            var paymentMethods = yield payment.getPaymentMethodsForParent(queryParams.parentEmail);
            this.body = paymentMethods.Items.map(method => method.toJSON()).map(paymentMethodSerializer);
        }
        this.status = 200;
    } else {
        this.status = 400;
    }
};

var paymentMethodSerializer = (method) => ({
    cardNumber: obfuscateCardNumber(method.cardNumber || method.get("cardNumber")),
    methodId: method.methodId || method.get("methodId")
});

function obfuscateCardNumber(cardNumber) {
    return 'XXXX-XXXX-XXXX-' + cardNumber.slice(-4);
}