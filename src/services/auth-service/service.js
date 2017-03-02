var AWS = require('aws-sdk');
var jwt = require('jsonwebtoken');

var jwtConfig = require("../../common/lib/jwt");
var user = require("../../common/lib/user");
var schoolLib = require("../../common/lib/school");

var ISSUER = "https://www.secureslice.com/issuer";

module.exports.getToken = function* getToken() {
    console.log("getToken");
    var userObj = yield user.validateAndGetUser(this.request.body.email, this.request.body.password);
    // if(userObj.role==="admin"){
    //     var userSchools = yield schoolLib.getSchoolsByInstitution(userObj.institutionShortCode);
    //     if(userSchools && userSchools.length>0){
    //         userSchools = userSchools.map(school => school.toJSON())
    //         console.log("schools: ", userSchools);
    //         userObj.schoolCode = userSchools[0].code;
    //     }
    // }
    var tokenObj = {
        role: userObj.role,
        email: userObj.email,
        institutionShortCode: userObj.institutionShortCode,
        schoolCode: userObj.schoolCode
    };
    var token = jwt.sign(tokenObj, jwtConfig.secret, jwtConfig.jwtOptions);
    this.body = {
        token: token,
        expiresIn: 86400000,
        name: userObj.firstname,
        email: userObj.email,
        role: userObj.role,
        institutionShortCode: userObj.institutionShortCode,
        schoolCode: userObj.schoolCode
    };
    this.status = 200;
};

// admin scope does not have schoolCode
