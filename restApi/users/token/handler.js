var jwt = require('jsonwebtoken');
var user = require("../../lib/user");
var handleRequest = require("../../lib/handler");
module.exports.handler = function (event, context, cb) {
  handleRequest(cb, function* (ctx) {
    // console.log("Body: ", event.body);
    // console.log("Body1: ", JSON.parse(event.body).email);
    // console.log("Body2: ", JSON.parse(event.body).password);
    var userObj = yield user.validateAndGetUser(JSON.parse(event.body).email, JSON.parse(event.body).password);
    var token = jwt.sign(userObj, process.env.jwtSecret, { expiresIn: "1d" });
    userObj.access_token = token;
    ctx.body = JSON.stringify(userObj);
    ctx.statusCode = 401;
    console.log("SENDING REPSONE NOW!", ctx);
    console.log("SENDING REPSONE NOW!", ctx.body);
  });
  console.log("ZZZZZZZZZZZZ");
};
