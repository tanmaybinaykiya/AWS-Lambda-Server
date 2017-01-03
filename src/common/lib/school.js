var dao = require("./dao");
var HttpError=require("./errors").HttpError;
var addSchool = function* (school) {
    var existingInstitution = yield dao.getInstitutionByShortcode(school.institutionShortCode);
    if (!existingInstitution) {
        throw new HttpError(400, "institution with shortcode doesnot exist");
    }
    var existingSchool = yield dao.getSchoolByShortCode(school.institutionShortCode,school.code);
    if (existingSchool) {
        throw new HttpError(400, "school with shortcode already exists");
    }

    var newschool = yield dao.createSchool(school);
    if (!newschool) {
        throw new HttpError(400, "Bad request");
    }
    return newschooll
}

var getSchoolsByInstitution = function* (shortCode) {
    return yield dao.getSchoolsByInstitutionCode(shortCode);
}

module.exports = {
    addSchool,
    getSchoolsByInstitution
} 