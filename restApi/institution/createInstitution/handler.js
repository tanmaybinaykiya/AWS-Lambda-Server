var institutionLib = require("../../lib/institution");
var handleRequest = require("../../lib/handler");
module.exports.handler = function(event, context, cb) {
  handleRequest(function* () {
    var institution = yield institutionLib.createInstitution(event.body);
    return institution;
  }, cb);
};
