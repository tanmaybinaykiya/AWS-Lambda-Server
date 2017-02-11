var paymentMethodDAO = require("./dao/paymentMethod");
var HttpError = require("./errors").HttpError;
var uuid = require("uuid");

module.exports.addPaymentMethod = function* (paymentMethod) {

    if (paymentMethod.parentEmail && paymentMethod.isDefault && paymentMethod.braintree && paymentMethod.braintree.token
        && paymentMethod.braintree.customerId && paymentMethod.braintree.creditCardMaskedNumber) {
        paymentMethod.methodId = uuid.v1();
        console.log("Adding Payment method: ", paymentMethod);
        try {
            return yield paymentMethodDAO.addPaymentMethod(paymentMethod);
        } catch (err) {
            console.log("Joi Validation error: ", err);
            if (err.isJoi) {
                throw new HttpError(400, "Invalid input", "InvalidInput");
            }
        }
    } else {
        throw new HttpError(400);
    }
}

module.exports.getPaymentMethodsForParent = function* (parentEmail) {
    return yield paymentMethodDAO.getPaymentMethodsForParentEmail(parentEmail);
}

module.exports.getDefaultPaymentMethodForParent = function* (parentEmail) {
    var existingPaymentMethods = yield this.getPaymentMethodsForParent(parentEmail);
    return existingPaymentMethods.Items.filter(method => method.get("isDefault") === true);
}

module.exports.getPaymentMethodsByIds = function* (paymentMethodIds) {
    var paymentMethodIdsSet = [] ;
    new Set(paymentMethodIds).forEach(el => paymentMethodIdsSet.push(el));
    console.log(paymentMethodIdsSet);
    var paymentMethods = yield paymentMethodDAO.getPaymentMethodsByIds(paymentMethodIdsSet);
    console.log("paymentMethods: ", paymentMethods);
    console.log("paymentMethods: ", paymentMethods[0].attrs);
    console.log("paymentMethods: ", paymentMethods[0].toJSON());
    console.log("paymentMethods: ", JSON.stringify(paymentMethods));
    return paymentMethodIds.map((id) => paymentMethods.find((method) => (method.toJSON().methodId === id)).toJSON());
}
