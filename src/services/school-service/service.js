var qs = require("querystring")
var schoolLib = require("../../common/lib/school");

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
        var response = schools.Items
            .map(school => (school.toJSON()))
            .map(school => ({ name: school.name, code: school.code }));
        this.body = response;
        this.status = 200;
    } else {
        this.status = 400;
    }
};
