'use strict';
var AWS = require('aws-sdk');
var jwt = require('jsonwebtoken');
var user = require("../../lib/user");
var handleRequest = require("../../lib/handler");
var HttpError=require("../../lib/errors").HttpError;
module.exports.handler = function (event, context, cb) {
    handleRequest(cb, function* (ctx) {
        var registerTokenDecoded = jwt.verify(event.queryParams.token, process.env.jwtSecret);
        var body=event.body;
        var newUser = {
            "email":registerTokenDecoded.email,
            "institutionShortCode":registerTokenDecoded.institutionCode,
            "role":registerTokenDecoded.role,
            "mobile"     : body.mobile,
            "firstname"    : body.firstname,
            "lastname"    :  body.lastname,
            "street"    : body.street,
            "city"    : body.city,
            "state"    : body.state,
            "zip"    : body.zip,
            "password"     : body.password,
        };
        var userObj = yield user.addUser(newUser);
        ctx.body = {status:"ok"};
    });
};
