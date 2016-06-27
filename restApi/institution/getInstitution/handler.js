var institutionLib = require("../../lib/institution");
var handleRequest = require("../../lib/handler");
module.exports.handler = function (event, context, cb) {
  handleRequest(cb, function* (ctx) {
    if (institutionShortCode.indexOf(institutionLib.restrictedCodes) >= 0) {
        ctx.body=  {
            name: "secureslice",
            type: "app"
        }
        return;
    }
    var subDomain=event.queryParams.shortCode;
    if(process.env.SERVERLESS_STAGE==="beta"){
      subDomain=subDomain.split("-beta")[0];
    }
    var institution = yield institutionLib.getInstitution(subDomain);
    ctx.body=institution.toJSON();
    ctx.body.type="institution";
    return;
  });
};
