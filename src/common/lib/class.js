var classDAO = require("./dao/class");
var HttpError = require("./errors").HttpError;

module.exports.addClass = function* (institutionShortCode, schoolCode, grade, clazz) {
    var school = yield classDAO.getSchoolByShortCode(institutionShortCode, schoolCode);
    if (!school) {
        throw new HttpError(400, "Not valid schoolCode");
    }
    var existingClass = yield classDAO.getClassByName(getCompositeHashKeyForClass(institutionShortCode, schoolCode, grade), clazz.name);
    if (existingClass) {
        throw new HttpError(400, "Class with shortcode already exists");
    }
    clazz.institutionSchoolGradeCode = getCompositeHashKeyForClass(clazz.institutionShortCode, clazz.schoolCode, clazz.grade);
    var newclass = yield classDAO.createClass(clazz);
    if (!newclass) {
        throw new HttpError(400, "Bad request");
    }
    return newclass;
}

module.exports.getClassByName = function* (institutionShortCode, schoolCode, gradeCode, name) {
    return yield classDAO.getClassByName(getCompositeHashKeyForClass(institutionShortCode, schoolCode, gradeCode), name);
}

module.exports.getClassesByGrade = function* (institutionShortCode, schoolCode, gradeCode) {
    return yield classDAO.getClassesByGrade(getCompositeHashKeyForClass(institutionShortCode, schoolCode, gradeCode));
}

function getCompositeHashKeyForClass(institutionShortCode, schoolCode, gradeCode) {
    return [institutionShortCode, schoolCode, gradeCode].join("_");
}
