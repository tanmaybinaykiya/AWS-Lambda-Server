var AWS = require('aws-sdk');
var jwt = require('jsonwebtoken');
var user = require("../../common/lib/user");

module.exports.createUser = function* createUser(req, send) {
    console.log("createUser: ", "this.state: ", this.state, "req: ", req, "send: ", send);
    var requestBody = this.request.body;
    var newUser = {
        "email": requestBody.email,
        "institutionShortCode": this.state.user.institutionCode,
        "role": requestBody.role,
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
};

module.exports.createAdmin = function* createUser(req, send) {
    console.log("createAdmin: ", "this.state: ", this.state, "req: ", req, "send: ", send);
    var requestBody = this.request.body;
    var newUser = {
        "email": requestBody.email,
        "institutionShortCode": requestBody.institutionCode,
        "role": "admin",
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
};

