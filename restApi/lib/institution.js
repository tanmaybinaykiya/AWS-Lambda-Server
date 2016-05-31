var dao = require("./dao");
var HttpError=require("./errors").HttpError;
var createInstitution = function* (institution) {
    if(!institution.shortCode){
        throw new HttpError(400 , "institution shortcode is mandatory");
    }
    var existingInstitution = yield dao.getInstitutionByShortcode(institution.shortCode);
    if (existingInstitution) {
        throw new HttpError(400 , "institution with shortcode already exist" );
    }
    //TODO: Create a billing customer id
    institution.customerId="absceweferfre";
    institution = yield dao.createInstitution(institution);
    if (!institution) {
        throw new HttpError(400 , "Bad request" );
    }
    return institution;
}

module.exports = {
    createInstitution
} 