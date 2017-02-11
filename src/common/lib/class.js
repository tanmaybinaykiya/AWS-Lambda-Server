var classDAO = require("./dao/class");
var gradeHelper = require("./grade");
var HttpError = require("./errors").HttpError;

module.exports.addClass = function* (institutionShortCode, schoolCode, grade, clazz) {
    var existingGrade = yield gradeHelper.getGradeBySchoolAndName(institutionShortCode, schoolCode, grade);
    if (!existingGrade) {
        throw new HttpError(400, "Not valid grade");
    }
    var existingClass = yield classDAO.getClassByName(getPrimaryCompositeHashKeyForClass(institutionShortCode, schoolCode, grade), clazz.name);
    if (existingClass) {
        throw new HttpError(400, "Class with same name already exists");
    }
    clazz.institutionSchoolGradeCode = getPrimaryCompositeHashKeyForClass(institutionShortCode, schoolCode, grade);
    clazz.institutionSchoolCode = getSecondaryCompositeHashKeyForClass(institutionShortCode, schoolCode);
    var newclass = yield classDAO.createClass(clazz);
    if (!newclass) {
        throw new HttpError(400, "Bad request");
    }
    return newclass;
}

module.exports.getClassByName = function* (institutionShortCode, schoolCode, gradeCode, name) {
    return yield classDAO.getClassByName(getPrimaryCompositeHashKeyForClass(institutionShortCode, schoolCode, gradeCode), name);
}

module.exports.getClassesByGrade = function* (institutionShortCode, schoolCode, gradeCode) {
    return yield classDAO.getClassesByGrade(getPrimaryCompositeHashKeyForClass(institutionShortCode, schoolCode, gradeCode));
}

module.exports.getClassesBySchool = function* (institutionShortCode, schoolCode) {
    return yield classDAO.getClassesBySchool(getSecondaryCompositeHashKeyForClass(institutionShortCode, schoolCode));
}

module.exports.getClassBySchoolAndName = function* (institutionShortCode, schoolCode, className) {
    return yield classDAO.getClassBySchoolAndName(getSecondaryCompositeHashKeyForClass(institutionShortCode, schoolCode), className);
}

module.exports.getGradeNameForClass = function (clazz) {
    return clazz.institutionSchoolGradeCode.split(':')[2];
}

module.exports.incrementCurrentUsage = function* (clazz, count) {
    clazz.currentUsage += count;
    return classDAO.update(clazz);
}

function getPrimaryCompositeHashKeyForClass(institutionShortCode, schoolCode, gradeCode) {
    return [institutionShortCode, schoolCode, gradeCode].join(":");
}

function getSecondaryCompositeHashKeyForClass(institutionShortCode, schoolCode) {
    return [institutionShortCode, schoolCode].join(":");
}
