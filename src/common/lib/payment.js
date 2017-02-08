var paymentMethodDAO = require("./dao/paymentMethod");
var HttpError = require("./errors").HttpError;

module.exports.addPaymentMethod = function* (paymentMethod) {

    if (paymentMethod.parentEmail && paymentMethod.isDefault && paymentMethod.braintree && paymentMethod.braintree.token
        && paymentMethod.braintree.customerId && paymentMethod.braintree.creditCardMaskedNumber) {
        try {
            return yield paymentMethodDAO.addPaymentMethod(paymentMethod);
        } catch (err) {
            console.log("Joi Validation error: ", err);
            if (err.isJoi) {
                throw new HttpError(400, { err: "Invalid input" });
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
