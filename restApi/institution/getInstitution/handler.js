var institutionLib = require("../../lib/institution");
var handleRequest = require("../../lib/handler");
module.exports.handler = function (event, context, cb) {
  handleRequest(cb, function* (ctx) {
    var institution = yield institutionLib.getInstitution(event.queryParams.shortCode);
    ctx.body=institution.toJSON();
    return;
  });
};
