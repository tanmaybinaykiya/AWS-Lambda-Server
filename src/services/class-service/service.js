var classLib = require("../../common/lib/class");
var qs = require("querystring")

module.exports.createClass = function* () {
    console.log("Create Class Body: ", this.request.body);
    var clazz = classLib.addClass(this.request.body);
    this.status = 200;
    this.body = clazz.toJSON();
};

module.exports.getClasses = function* (req, next) {
    var queryParams = this.request.query;
    var classes = yield classLib.getClassesBySchool(queryParams.schoolCode, queryParams.institutionCode);
    var response = classes.Items.forEach(function (clazz) {
        ctx.body.push(clazz.toJSON());
    })
    this.status = 200;
    this.body = response;
};
