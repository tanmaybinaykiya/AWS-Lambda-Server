var classLib = require("../../lib/class");
var handleRequest = require("../../lib/handler");
var adminSecurity = require("../../lib/security").adminSecurity;

module.exports.handler = function (event, context, cb) {
  handleRequest(cb, adminSecurity(event.AuthorizationValue), function* (ctx) {
    var clazz = yield classLib.addClass(event.body);
    ctx.body=clazz.toJSON();
    return;
  });
};
