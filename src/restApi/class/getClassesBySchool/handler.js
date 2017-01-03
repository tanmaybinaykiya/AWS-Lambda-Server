var classLib = require("../../lib/class");
var handleRequest = require("../../lib/handler");
var adminSecurity = require("../../lib/security").adminSecurity;
module.exports.handler = function (event, context, cb) {
  handleRequest(cb, adminSecurity(event.AuthorizationValue), function* (ctx) {
    var classes = yield classLib.getClassesBySchool(event.queryParams.schoolCode,event.queryParams.institutionCode);
    ctx.body = [];
    classes.Items.forEach(function (clazz) {
      ctx.body.push(clazz.toJSON());
    })
    return;
  });
};
