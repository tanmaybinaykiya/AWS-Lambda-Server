var schoolLib = require("../../lib/school");
var handleRequest = require("../../lib/handler");
var adminSecurity = require("../../lib/security").adminSecurity;
module.exports.handler = function (event, context, cb) {
  handleRequest(cb, adminSecurity(event.AuthorizationValue), function* (ctx) {
    var school = yield schoolLib.addSchool(event.body);
    ctx.body=school.toJSON();
    return;
  });
};
