var gradeDao = require("./dao/grade");
var HttpError = require("./errors").HttpError;

module.exports.addGrade = function* (grade, schoolCode, institutionShortCode) {
    var existingGrade = yield gradeDao.getGradesBySchoolCodeAndName(schoolCode, grade.name);
    if (existingGrade) {
        throw new HttpError(400, "Grade with same name already exists");
    }
    grade.schoolCode = schoolCode;
    grade.institutionShortCode = institutionShortCode;
    try {
        yield gradeDao.createGrade(grade);
    } catch (err) {
        console.log("Error: ", err);
        throw new HttpError(500, "Grade with same name already exists" + err);
    }
}

module.exports.getGradesBySchool = function* (schoolCode, institutionShortCode) {
    return yield gradeDao.getGradesBySchoolCode(schoolCode, institutionShortCode);
}
