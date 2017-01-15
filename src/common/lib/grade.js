var dao = require("./dao");
var HttpError = require("./errors").HttpError;

var addGrade = function* (grade, schoolCode, institutionShortCode) {
    var existingGrade = yield dao.getGradesBySchoolCodeAndName(schoolCode, grade.name);
    if (existingGrade) {
        throw new HttpError(400, "Grade with same name already exists");
    }
    grade.schoolCode = schoolCode;
    grade.institutionShortCode = institutionShortCode;
    try {
        yield dao.createGrade(grade);
    } catch (err) {
        console.log("Error: ", err);
        throw new HttpError(500, "Grade with same name already exists" + err);
    }
}

var getGradesBySchool = function* (schoolCode, institutionShortCode) {
    return yield dao.getGradesBySchoolCode(schoolCode, institutionShortCode);
}

module.exports = {
    addGrade,
    getGradesBySchool
} 
