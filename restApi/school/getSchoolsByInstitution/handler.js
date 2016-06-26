var schoolLib = require("../../lib/school");
var handleRequest = require("../../lib/handler");
var ssAdminSecurity = require("../../lib/security").validTokenSecurity
module.exports.handler = function (event, context, cb) {
  handleRequest(cb, validTokenSecurity(event.AuthorizationValue), function* (ctx) {
    var schools = yield schoolLib.getSchoolsByInstitution(event.queryParams.shortCode);
    ctx.body = [];
    schools.Items.forEach(function (school) {
      ctx.body.push(school.toJSON());
    })
    return;
  });
};
