var qs = require("querystring")
var institutionLib = require("../../common/lib/institution");

module.exports.createInstitution = function* () {
    console.log("createInstitution", this.request.body);
    var institution = yield institutionLib.createInstitution(this.request.body);
    this.body = institution.toJSON();
    this.status = 200;
};

module.exports.getInstitution = function* () {
    console.log("getInstitution: ", this.request.query);
    var queryParams = this.request.query;
    var institutionShortCode = queryParams.shortCode;
    if (institutionShortCode.indexOf(institutionLib.restrictedCodes) >= 0) {
        this.body = {
            name: "secureslice",
            type: "app"
        }
        this.status = 200;
    } else {
        var institution = yield institutionLib.getInstitution(institutionShortCode);
        if (institution) {
            this.body = institution.toJSON();
            this.body.type = "institution";
            this.status = 200;
        } else {
            this.status = 404;
        }
    }
};
