var classLib = require("../../common/lib/class");

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

module.exports.getClassesByGrade = function* (req, next) {
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

module.exports.getClassesBySchool = function* (req, next) {
    var queryParams = this.request.query;
    if (this.params.institutionCode && this.params.schoolCode) {
        var classes = yield classLib.getClassesBySchool(this.params.institutionCode, this.params.schoolCode);
        this.body = classes.Items.map(jsonMapper).map(classMapper);
        this.status = 200;
    } else {
        this.status = 400;
    }
};

var classMapper = (clazz) => ({
    name: clazz.name,
    teacherIds: clazz.teacherIds,
    fullCapacity: clazz.fullCapacity,
    currentUsage: clazz.currentUsage,
});

var jsonMapper = (item) => item.toJSON();