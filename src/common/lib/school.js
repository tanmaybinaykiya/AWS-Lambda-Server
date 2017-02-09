var schoolDAO = require("./dao/school");
var HttpError = require("./errors").HttpError;

module.exports.addSchool = function* (school) {
    var existingSchool = yield schoolDAO.getSchoolByInstitutionCodeAndSchoolCode(school.institutionShortCode, school.code);
    if (existingSchool) {
        throw new HttpError(400, "school with shortcode already exists");
    }

    var newschool = yield schoolDAO.createSchool(school);
    if (!newschool) {
        throw new HttpError(400, "Bad request");
    }
    return newschool;
}

module.exports.getSchoolsByInstitution = function* (shortCode) {
    return yield schoolDAO.getSchoolsByInstitutionCode(shortCode);
}

module.exports.getSchoolByInstitutionCodeAndSchoolCode = function* (instCode, schoolCode) {
    return yield schoolDAO.getSchoolByInstitutionCodeAndSchoolCode(instCode, schoolCode);
}
