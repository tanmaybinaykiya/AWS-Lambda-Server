var jwt = require('jsonwebtoken');
var user = require("../../lib/user");
var handleRequest = require("../../lib/handler");
module.exports.handler = function (event, context, cb) {
  handleRequest(function* () {
    var userObj = yield user.validateAndGetUser(event.body.email, event.body.password);
    var token = jwt.sign(userObj, process.env.jwtSecret, { expiresIn: "1d" });
    return {
      access_token: token
    };
  }, cb);
};
