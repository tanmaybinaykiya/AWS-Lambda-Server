var dao = require("./dao");
var HttpError = require("./errors").HttpError;

module.exports.addPaymentMethod = function* (paymentMethod) {
    if (paymentMethod.cardNumber && paymentMethod.cvv && paymentMethod.expiration && paymentMethod.postalCode && paymentMethod.parentEmail) {
        var existingDefaultPaymentMethods = yield this.getDefaultPaymentMethodForParent(paymentMethod.parentEmail);
        paymentMethod.isDefault = (existingDefaultPaymentMethods.length < 1);
        return yield dao.addPaymentMethod(paymentMethod);
    } else {
        throw new HttpError(400);
    }
}

module.exports.getPaymentMethodsForParent = function* (parentEmail) {
    return yield dao.getPaymentMethodsForParentEmail(parentEmail);
}

module.exports.getDefaultPaymentMethodForParent = function* (parentEmail) {
    var existingPaymentMethods = yield this.getPaymentMethodsForParent(parentEmail);
    return existingPaymentMethods.Items.filter(method => method.get("isDefault") === true);
}