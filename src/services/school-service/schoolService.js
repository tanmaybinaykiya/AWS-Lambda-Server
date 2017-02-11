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
    this.body = jsonMapper(school);
    this.status = 200;
};

module.exports.getSchoolsByInstitution = function* () {
    console.log("getSchoolsByInstitution: ", this.params.institutionCode);
    if (this.params && this.params.institutionCode) {
        var schools = yield schoolLib.getSchoolsByInstitution(this.params.institutionCode);
        console.log("schools found: ", schools);
        var response = schools
            .map(jsonMapper)
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
        if (school) {
            this.body = {
                name: school.get("name"),
                code: school.get("code")
            };
            this.status = 200;
        }else{
            this.status = 404;
        }
    } else {
        this.status = 400;
    }
};

var jsonMapper = (item) => item.toJSON();