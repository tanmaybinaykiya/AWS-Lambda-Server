'use strict';
// var AWS = require('aws-sdk');
// var db = new AWS.DynamoDB();
// var bcrypt      = require("co-bcryptjs");
// var jwt         = require("koa-jwt");
var util=require("util");
module.exports.handler = function(event, context, cb) {
  console.log(util.inspect(event));
  return cb(null, {
    message: 'Go Serverless! Your Lambda function executed successfully!'
  });
};
