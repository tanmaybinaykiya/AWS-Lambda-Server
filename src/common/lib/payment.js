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
                throw new HttpError(400, {
                    err: "Invalid input",
                    code: "InvalidInput"
                });
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
