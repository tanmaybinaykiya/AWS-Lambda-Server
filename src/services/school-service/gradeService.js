var gradeLib = require("../../common/lib/grade");

module.exports.createGrade = function* () {
    var institutionCode = this.params.institutionCode;
    var schoolCode = this.params.schoolCode;
    var requestBody = this.request.body;
    console.log("Create Grade Request: ", institutionCode, schoolCode, requestBody);
    if (isCreateGradeRequestValid(institutionCode, schoolCode, requestBody)) {
        var grade = yield gradeLib.addGrade(institutionCode, schoolCode, requestBody)
        this.status = 201;
        this.body = {};
    } else {
        this.status = 400;
    }
};

function isCreateGradeRequestValid(institutionCode, schoolCode, requestBody) {
    return institutionCode &&
        schoolCode &&
        requestBody &&
        requestBody.name &&
        requestBody.tuitionFee > 0 &&
        requestBody.planId &&
        requestBody.duration &&
        requestBody.duration.days &&
        requestBody.duration.from &&
        requestBody.duration.to &&
        requestBody.minimumAgeCriterion &&
        requestBody.minimumAgeCriterion.age > 0 &&
        requestBody.minimumAgeCriterion.validationDate;
}

module.exports.getGrades = function* (req, next) {
    var queryParams = this.request.query;
    var grades = yield gradeLib.getGradesBySchool(this.params.institutionCode, this.params.schoolCode);
    this.status = 200;
    this.body = grades.Items.map(jsonMapper).map(gradeMapper);
};

var gradeMapper = (grade) => ({
    name: grade.name,
    tuitionFee: grade.tuitionFee,
    planId: grade.planId,
    duration: grade.duration,
    minimumAgeCriterion: grade.minimumAgeCriterion
});

var jsonMapper = (item) => item.toJSON();
