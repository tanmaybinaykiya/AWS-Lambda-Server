var classDAO = require("./dao/class");
var gradeHelper = require("./grade");
var HttpError = require("./errors").HttpError;

module.exports.addClass = function* (institutionShortCode, schoolCode, grade, clazz) {
    var existingGrade = yield gradeHelper.getGradeBySchoolAndName(institutionShortCode, schoolCode, grade);
    if (!existingGrade) {
        throw new HttpError(400, "Not valid grade");
    }
    var existingClass = yield classDAO.getClassByName(getCompositeHashKeyForClass(institutionShortCode, schoolCode, grade), clazz.name);
    if (existingClass) {
        throw new HttpError(400, "Class with same name already exists");
    }
    clazz.institutionSchoolGradeCode = getCompositeHashKeyForClass(institutionShortCode, schoolCode, grade);
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
    return [institutionShortCode, schoolCode, gradeCode].join(":");
}
