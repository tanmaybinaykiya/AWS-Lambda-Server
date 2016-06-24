var dao = require("../../lib/dao");
var handleRequest = require("../../lib/handler");
var internalSecurity = require("../../lib/security").internalSecurity;
module.exports.handler = function (event, context, cb) {
  handleRequest(cb, internalSecurity(event.AuthorizationValue), function* (ctx) {
    yield dao.updateUser({"email":event.body.email,role: "superadmin"});
    ctx.body={"Status":"ok"};
    return;
  });
};
