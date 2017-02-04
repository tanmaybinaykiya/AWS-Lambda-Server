var AWS = require('aws-sdk');
var jwt = require('jsonwebtoken');
var user = require("../../common/lib/user");

module.exports.createUser = function* createUser(req, send) {
    console.log("createUser: ", "this.state: ", this.state, "req: ", req, "send: ", send);
    var requestBody = this.request.body;
    if (this.params.role === "staff" || this.params.role === "teacher") {
        var newUser = {
            "email": requestBody.email,
            "institutionShortCode": this.params.user.institutionCode,
            "role": this.params.role,
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
    } else {
        console.log("Invalid role: ", this.params.role);
        this.status = 400;
    }
};

module.exports.registerAdmin = function* createUser(req, send) {
    console.log("createAdmin: ", "this.state: ", this.state, "req: ", req, "send: ", send);
    var requestBody = this.request.body;
    if (this.state.user.role === "registerAdmin") {
        if (this.state.user.email === requestBody.email) {
            var newUser = {
                "email": requestBody.email,
                "institutionShortCode": this.params.institutionCode,
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
        } else {
            console.log("Email in token does not match that of request body. ReqBody:", this.state.user.email, requestBody.email);
            this.status = 403;
        }
    } else {
        //superAdmin
        var newUser = {
            "email": requestBody.email,
            "institutionShortCode": this.params.institutionCode,
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
    }
};

