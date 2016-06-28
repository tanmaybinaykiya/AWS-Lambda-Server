var institutionLib = require("../../lib/institution");
var handleRequest = require("../../lib/handler");
var HttpError = require("../../lib/errors").HttpError;
module.exports.handler = function (event, context, cb) {
  handleRequest(cb, function* (ctx) {
    var institutionShortCode= event.queryParams.shortCode;
    if (institutionShortCode.indexOf(institutionLib.restrictedCodes) >= 0) {
        ctx.body=  {
            name: "secureslice",
            type: "app"
        }
        return;
    }
    var institution = yield institutionLib.getInstitution(institutionShortCode);
    if(institution){
      ctx.body=institution.toJSON();
      ctx.body.type="institution";
      return;
    }else{
      throw new HttpError(404, "institution shortcode is not valid");
    }
    
  });
};
