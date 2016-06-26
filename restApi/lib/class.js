var dao = require("./dao");
var chargebee = require('./chargebee');
var HttpError=require("./errors").HttpError;
var addClass = function* (clazz) {
    var school = yield dao.getSchoolByShortCode(clazz.institutionShortCode,clazz.schoolCode);
    if (!school) {
        throw new HttpError(400, "Not valid schoolCode");
    }
    var existingClass = yield dao.getClassByShortCode(clazz.schoolCode,clazz.code);
    if (existingClass) {
        throw new HttpError(400, "class with shortcode already exists");
    }
    var plan=yield chargebee.createClassPlan(clazz.code, clazz.schoolCode, clazz.institutionShortCode , clazz.fees, clazz.feeType, clazz.startDate, clazz.endDate)
    clazz.planId=plan.id;
    var newclass = yield dao.createClass(clazz);
    if (!newclass) {
        throw new HttpError(400, "Bad request");
    }
    return newclass
}

var getClassesBySchool = function* (shortCode) {
    return yield dao.getClassesBySchoolCode(shortCode);
}

module.exports = {
    addClass,
    getClassesBySchool
} 