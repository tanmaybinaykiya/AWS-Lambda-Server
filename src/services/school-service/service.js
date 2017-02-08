var qs = require("querystring")
var schoolLib = require("../../common/lib/school");
var classLib = require("../../common/lib/class");
var gradeLib = require("../../common/lib/grade");

module.exports.createSchool = function* () {
    console.log("createSchool", this.request.body);
    var pathIssCode = this.params.institutionCode;
    var schoolView = {
        name: this.request.body.name,
        code: this.request.body.code,
        institutionShortCode: pathIssCode
    };
    var school = yield schoolLib.addSchool(schoolView);
    this.body = school.toJSON();
    this.status = 200;
};

module.exports.getSchoolsByInstitution = function* () {
    console.log("getSchoolsByInstitution: ", this.params.institutionCode);
    if (this.params && this.params.institutionCode) {
        var schools = yield schoolLib.getSchoolsByInstitution(this.params.institutionCode);
        console.log("schools found: ", schools);
        var response = schools
            .map(school => (school.toJSON()))
            .map(school => ({ name: school.name, code: school.code }));
        this.body = response;
        this.status = 200;
    } else {
        this.status = 400;
    }
};

module.exports.getSchoolsByInstitutionAndSchoolCode = function* () {
    console.log("getSchoolsByInstitutionAndSchoolCode: ", this.params.institutionCode, this.params.schoolCode);
    if (this.params && this.params.institutionCode && this.params.schoolCode) {
        var school = yield schoolLib.getSchoolByInstitutionCodeAndSchoolCode(this.params.institutionCode, this.params.schoolCode);
        this.body = {
            name: school.get("name"),
            code: school.get("code")
        };
        this.status = 200;
    } else {
        this.status = 400;
    }
};

// ********************* Class ********************* 

module.exports.createClass = function* () {
    var institutionCode = this.params.institutionCode;
    var schoolCode = this.params.schoolCode;
    var gradeName = this.params.gradeName;
    var requestBody = this.request.body;
    console.log("Create Class Body: ", requestBody, institutionCode, schoolCode, gradeName);
    if (isValidCreateClassRequest(requestBody, institutionCode, schoolCode, gradeName)) {
        var clazz = yield classLib.addClass(institutionCode, schoolCode, gradeName, requestBody);
        this.status = 200;
        this.body = classMapper(jsonMapper(clazz));
    } else {
        this.status = 400;
    }
};

function isValidCreateClassRequest(requestBody, institutionCode, schoolCode, gradeName) {
    return institutionCode &&
        schoolCode &&
        gradeName &&
        requestBody &&
        requestBody.name &&
        requestBody.teacherIds && requestBody.teacherIds.length > 0 &&
        // requestBody.startDate &&
        // requestBody.endDate &&
        // requestBody.fees > 0 &&
        requestBody.fullCapacity > 0
}

module.exports.getClasses = function* (req, next) {
    var queryParams = this.request.query;
    if (this.params.institutionCode && this.params.schoolCode && this.params.gradeName) {
        var classes = yield classLib.getClassesByGrade(this.params.institutionCode, this.params.schoolCode, this.params.gradeName);
        this.body = classes.Items.map(jsonMapper).map(classMapper);
        this.status = 200;
    } else {
        this.status = 400;
    }
};

module.exports.getClassByName = function* (req, next) {
    var institutionCode = this.params.institutionCode;
    var schoolCode = this.params.schoolCode;
    var gradeName = this.params.gradeName;
    var className = this.params.name;
    var queryParams = this.request.query;
    if (institutionCode && schoolCode && gradeName && className && queryParams) {
        var classObj = yield classLib.getClassByName(institutionCode, schoolCode, gradeName, className);
        return classMapper(jsonMapper(classObj));
    } else {
        this.status = 400;
    }
    this.status = 200;
    this.body = response;
};


var classMapper = (clazz) => ({
    name: clazz.name,
    teacherIds: clazz.teacherIds,
    fullCapacity: clazz.fullCapacity
});

// ********************* Grade ********************* 

module.exports.createGrade = function* () {
    var institutionCode = this.params.institutionCode;
    var schoolCode = this.params.schoolCode;
    var requestBody = this.request.body;
    console.log("Create Grade Request: ", institutionCode, schoolCode, requestBody);
    if (isCreateGradeRequestValid(institutionCode, schoolCode, requestBody)) {
        var grade = yield gradeLib.addGrade(institutionCode, schoolCode, requestBody)
        this.status = 201;
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
