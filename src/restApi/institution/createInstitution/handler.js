var institutionLib = require("../../lib/institution");
var handleRequest = require("../../lib/handler");
var ssAdminSecurity = require("../../lib/security").ssAdminSecurity;
module.exports.handler = function (event, context, cb) {
  handleRequest(cb, ssAdminSecurity(event.AuthorizationValue), function* (ctx) {
    var institution = yield institutionLib.createInstitution(event.body);
    ctx.body=institution.toJSON();
    return;
  });
};
