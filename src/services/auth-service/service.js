var AWS = require('aws-sdk');
var jwt = require('jsonwebtoken');
var user = require("../../common/lib/user");

var ISSUER = "https://www.secureslice.com/issuer";

module.exports.getToken = function* getToken() {
    console.log("getToken");
    var userObj = yield user.validateAndGetUser(this.request.body.email, this.request.body.password);
    var token = jwt.sign(userObj, process.env.JWT_SECRET, { expiresIn: "1d", issuer: ISSUER });
    userObj.accessToken = token;
    this.body = { token: token, expiresIn: 86400000 };
    this.status = 200;
};
