var AWS = require('aws-sdk');
var jwt = require('jsonwebtoken');
var user = require("../../common/lib/user");

module.exports.getToken = function* () {
    var userObj = yield user.validateAndGetUser(this.request.body.email, this.request.body.password);
    var token = jwt.sign(userObj, process.env.JWT_SECRET, { expiresIn: "1d" });
    userObj.accessToken = token;
    this.body = userObj;
    this.status = 200;
};

module.exports.createUser = function* () {
    var requestBody = this.request.body;
    var newUser = {
        "email": registerTokenDecoded.email,
        "institutionShortCode": registerTokenDecoded.institutionCode,
        "role": registerTokenDecoded.role,
        "mobile": requestBody.mobile,
        "firstname": requestBody.firstname,
        "lastname": requestBody.lastname,
        "street": requestBody.street,
        "city": requestBody.city,
        "state": requestBody.state,
        "zip": requestBody.zip,
        "password": requestBody.password,
    };
    var userObj = yield user.addUser(newUser);
    this.body = { status: "ok" };
    this.status = 200;
}
