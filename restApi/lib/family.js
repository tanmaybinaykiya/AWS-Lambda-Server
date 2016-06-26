var dao = require("./dao");
var chargebee = require('./chargebee');
var HttpError=require("./errors").HttpError;
var createFamily = function* (user) {
    var existingInstitution = yield dao.getInstitutionByShortcode(user.institutionShortCode);
    if (!existingInstitution) {
        throw new HttpError(400, "institution with shortcode does not exist");
    }
    var customer=yield chargebee.createCustomer(user);
    var family= {
        customerId   : customer.id,
        institutionShortCode     : user.institutionShortCode
    }
    var newfamily = yield dao.createFamily(family);
    if (!newfamily) {
        throw new HttpError(400, "Bad request");
    }
    return newfamily;
}

var getHostedPageURL = function* (family) {
    return yield chargebee.createHosterPageURLCustomer(family.customerId);
}

module.exports = {
    addClass,
    getHostedPageURL
} 