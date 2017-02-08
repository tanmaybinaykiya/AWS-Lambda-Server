var gradeDao = require("./dao/grade");
var HttpError = require("./errors").HttpError;

module.exports.addGrade = function* (institutionShortCode, schoolCode, grade) {
    var existingGrade = yield gradeDao.getGradesByInstitutionSchoolCodeAndName(getInstitutionSchoolCodeCompositeKey(institutionShortCode, schoolCode), grade.name);
    if (existingGrade) {
        throw new HttpError(400, "Grade with same name already exists");
    } else {
        grade.institutionSchoolCode = getInstitutionSchoolCodeCompositeKey(institutionShortCode, schoolCode);
        try {
            yield gradeDao.createGrade(grade);
        } catch (err) {
            console.log("Error: ", err);
            throw new HttpError(500, "Grade with same name already exists: " + err.message);
        }
    }
}

module.exports.getGradesBySchool = function* (institutionShortCode, schoolCode) {
    return yield gradeDao.getGradesByInstitutionSchoolCode(getInstitutionSchoolCodeCompositeKey(institutionShortCode, schoolCode));
}

module.exports.getGradeBySchoolAndName = function* (institutionShortCode, schoolCode, gradeName) {
    return  yield gradeDao.getGradesByInstitutionSchoolCodeAndName(getInstitutionSchoolCodeCompositeKey(institutionShortCode, schoolCode), gradeName);
}

function getInstitutionSchoolCodeCompositeKey(institutionShortCode, schoolCode) {
    return [institutionShortCode, schoolCode].join(":");
}