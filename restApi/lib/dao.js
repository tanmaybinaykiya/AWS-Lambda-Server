var vogels = require("vogels");
var models = require("./models");
var AWS = require("aws-sdk");
if (process.env.SERVERLESS_STAGE === 'dev') {
    var opts = { endpoint: 'http://localhost:7777', apiVersion: '2012-08-10', region: "us-east-1" };
    vogels.dynamoDriver(new AWS.DynamoDB(opts));
}
var createTables = function () {
    return new Promise(function (resolve, reject) {
        vogels.createTables(function (err) {
            if (err) {
                reject(err);
            } else {
                resolve(err);
            }
        });
    });
}

var getUser = function (email) {
    return new Promise(function (resolve, reject) {
        models.Users.get(email, function (err, user) {
            if (err) {
                reject(err);
            } else {
                resolve(user);
            }
        });
    });
}

var createUser = function (user) {
    return new Promise(function (resolve, reject) {
        models.Users.create(user, function (err, user) {
            if (err) {
                reject(err);
            } else {
                resolve(user);
            }
        });
    });
}

module.exports = {
    createTables,
    getUser,
    createUser
}