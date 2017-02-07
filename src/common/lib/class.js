var classDAO = require("./dao/class");
var HttpError = require("./errors").HttpError;

module.exports.addClass = function* (clazz) {
    var school = yield classDAO.getSchoolByShortCode(clazz.institutionShortCode, clazz.schoolCode);
    if (!school) {
        throw new HttpError(400, "Not valid schoolCode");
    }
    var existingClass = yield classDAO.getClassByShortCode(clazz.schoolCode, clazz.code);
    if (existingClass) {
        throw new HttpError(400, "Class with shortcode already exists");
    }
    // var plan = yield chargebee.createClassPlan(clazz.code, clazz.schoolCode, clazz.institutionShortCode, clazz.fees, clazz.feeType, clazz.startDate, clazz.endDate)
    // clazz.planId = plan.id;
    var newclass = yield classDAO.createClass(clazz);
    if (!newclass) {
        throw new HttpError(400, "Bad request");
    }
    return newclass
}

module.exports.getClassesBySchool = function* (schoolCode, institutionShortCode) {
    return yield classDAO.getClassesBySchoolCode(schoolCode);
}

module.exports.getClassByName = function* (schoolCode, institutionShortCode, gradeCode, name) {
    return yield classDAO.getClassesBySchoolCodeAndGrade(schoolCode, gradeCode);
}

module.exports.getClassesByGrade = function* (schoolCode, institutionShortCode, gradeCode) {
    return yield classDAO.getClassesBySchoolCodeAndGrade(schoolCode, gradeCode);
}
