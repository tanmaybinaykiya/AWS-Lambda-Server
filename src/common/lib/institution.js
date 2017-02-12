var institutionDAO = require("./dao/institution");
var HttpError = require("./errors").HttpError;
var cloudflare = require('./cloudflare');
var emailHelper = require('./emailhelper');

module.exports.restrictedCodes = ["app-beta", "app", "api", "secureslice"];

module.exports.createInstitution = function* (institution) {

    validateInstitutionRequestBody(institution);
    if (!institution.country) {
        institution.country = "US";
    }

    var existingInstitution = yield institutionDAO.getInstitutionByShortcode(institution.shortCode);
    if (existingInstitution) {
        throw new HttpError(400, "institution with shortcode already exist");
    }
    // var customer = yield chargebee.createInstitutionCustomer(institution.shortCode, institution.adminemail, institution.addressLine1, institution.city, institution.state, institution.zip, institution.country);
    // institution.customerId = customer.id;
    var newinstitution = yield institutionDAO.createInstitution(institution);
    if (!newinstitution) {
        throw new HttpError(400, "Bad request");
    }
    // try {
    //     yield cloudflare.createSubdomain(institution.shortCode);
    // } catch (err) {
    //     console.error("unable to create subdomain ", err);
    // }
    try {
        yield emailHelper.sendAdminInviteEmail(institution.adminemail, institution.shortCode);
    } catch (err) {
        console.error("unable to send admin invite email", err);
    }

    return newinstitution;
}

function validateInstitutionRequestBody(institution) {
    if (!institution.shortCode) throw new HttpError(400, "institution shortcode is mandatory");
    if (!institution.adminemail) throw new HttpError(400, "institution adminemail is mandatory");
    if (!institution.addressline1) throw new HttpError(400, "institution addressLine1 is mandatory");
    if (!institution.city) throw new HttpError(400, "institution city is mandatory");
    if (!institution.state) throw new HttpError(400, "institution state is mandatory");
    if (!institution.zip) throw new HttpError(400, "institution state is mandatory");
    if (restrictedCodes.indexOf(institution.shortCode) >= 0) throw new HttpError(400, "institution shortcode is not valid");
}

module.exports.getInstitution = function* (institutionShortCode) {
    return yield institutionDAO.getInstitutionByShortcode(institutionShortCode);
}
