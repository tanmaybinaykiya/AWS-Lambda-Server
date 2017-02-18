var AWS = require('aws-sdk');
var jwt = require('jsonwebtoken');


var HttpError = require("../../common/lib/errors").HttpError;
var userHelper = require("../../common/lib/user");
var smsHelper = require("../../common/lib/smsHelper");
var constants = require("../../common/lib/constants");

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
        var userObj = yield userHelper.addUser(newUser);
        this.body = { status: "ok" };
        this.status = 200;
    } else {
        console.log("Invalid role: ", this.params.role);
        this.status = 400;
    }
};

function validateRegisterAdminRequestBody(requestBody) {
    console.log("validateRegisterAdminRequestBody");
    if (!requestBody.email) throw new HttpError(400, "Invalid Request Body", "InvalidEmail");
    if (!requestBody.firstName) throw new HttpError(400, "Invalid Request Body", "InvalidFirstName");
    if (!requestBody.lastName) throw new HttpError(400, "Invalid Request Body", "InvalidLastName");
    if (!requestBody.contact) throw new HttpError(400, "Invalid Request Body", "InvalidContact");
    if (!requestBody.contact.number) throw new HttpError(400, "Invalid Request Body", "InvalidContactNumber");
    if (!requestBody.contact.verification.code) throw new HttpError(400, "Invalid Request Body", "InvalidcontactVerificationCode");
    if (!requestBody.contact.verification.requestId) throw new HttpError(400, "Invalid Request Body", "InvalidcontactVerificationRequestId");
    if (!requestBody.password) throw new HttpError(400, "Invalid Request Body", "InvalidPassword");
    if (!requestBody.institutionCode) throw new HttpError(400, "Invalid Request Body", "InvalidInstitutionCode");
}

function validateRegisterParentRequestBody(requestBody) {
    validateRegisterAdminRequestBody(requestBody);
    if (!requestBody.schoolCode) throw new HttpError(400, "Invalid Request Body", "InvalidSchoolCode");
}

module.exports.registerParent = function* createUser(req, send) {
    console.log("registerParent");
    var requestBody = this.request.body;
    validateRegisterParentRequestBody(requestBody);
    if (this.state.user.email === requestBody.email) {
        var requestId = yield smsHelper.verifyOTP(requestBody.contact.verification.requestId, requestBody.contact.verification.code);
        if (requestId) {
            var newUser = {
                email: requestBody.email,
                institutionShortCode: requestBody.institutionCode,
                schoolCode: requestBody.schoolCode,
                role: "parent",
                mobile: requestBody.contact.number,
                mobileVerified: true,
                firstname: requestBody.firstName,
                lastname: requestBody.lastName,
                street: requestBody.street,
                city: requestBody.city,
                state: requestBody.state,
                zip: requestBody.zip,
                password: requestBody.password,
            };
            var userObj = yield userHelper.addUser(newUser);
            this.body = { status: "ok" };
            this.status = 200;
        } else {
            throw new HttpError(400, "Invalid Request Body", "InvalidSchoolCode");
        }
    } else {
        console.log("Email in token does not match that of request body. ReqBody:", this.state.user.email, requestBody.email);
        this.status = 403;
    }
};

module.exports.registerAdmin = function* createUser(req, send) {
    console.log("registerAdmin");
    var requestBody = this.request.body;
    validateRegisterAdminRequestBody(requestBody);
    if (this.state.user.email === requestBody.email) {
        try{
            var requestId = yield smsHelper.verifyOTP(requestBody.contact.verification.requestId, requestBody.contact.verification.code);
        } catch(err) {
            console.log("Error verifying number. Reason:", err);
            throw new HttpError(400, "Contact Number Verification Failed", "ContactVerificationFailed");
        }
        if (requestId) {
            var newUser = {
                email: requestBody.email,
                institutionShortCode: requestBody.institutionCode,
                role: "admin",
                mobile: requestBody.contact.number,
                mobileVerified: true,
                firstname: requestBody.firstName,
                lastname: requestBody.lastName,
                street: requestBody.street,
                city: requestBody.city,
                state: requestBody.state,
                zip: requestBody.zip,
                password: requestBody.password,
            };
            var userObj = yield userHelper.addUser(newUser);
            this.body = { status: "ok" };
            this.status = 200;
        } else {
            throw new HttpError(400, "Invalid Request Body", "InvalidSchoolCode");
        }
    } else {
        console.log("Email in token does not match that of request body. ReqBody:", this.state.user.email, requestBody.email);
        this.status = 403;
    }
};

module.exports.generateVerificationCode = function* () {
    console.log("generateVerificationCode ");
    var requestBody = JSON.parse(this.request.body);
    validateGenerateVerificationCodeRequestBody(requestBody);
    var requestId = yield smsHelper.sendOTP(requestBody.number);
    this.body = { requestId: requestId };
    this.status = 200;
};

function validateGenerateVerificationCodeRequestBody(requestBody) {
    console.log("requestBody: ", requestBody, requestBody["email"], requestBody.email, !requestBody.email);
    if (!requestBody.email) throw new HttpError(400, "Invalid email", "BadRequest");
    if (!requestBody.number) throw new HttpError(400, "Invalid number", "BadRequest");
    if (!requestBody.number.match(constants.contactNumberRegex)) throw new HttpError(400, "Invalid number format", "BadRequest");
}

// module.exports.verifyUser = function* (req, send) {
//     console.log("verifyUser ");
//     var requestBody = this.request.body;
//     if (requestBody.email && requestBody.requestId && requestBody.verificationCode) {
//         var user = yield userHelper.getUser(requestBody.email);
//         if (user) {
//             var requestId = yield smsHelper.verifyOTP(requestBody.requestId, requestBody.verificationCode);
//             if (requestId && user.mobileVerificationRequestId && user.mobileVerificationRequestId === requestId) {
//                 user.mobileVerified = true;
//                 delete user.mobileVerificationRequestId;
//                 yield userHelper.updateUser(user);
//                 this.body = { status: "ok" };
//                 this.status = 200;
//             } else {
//                 throw new HttpError(400, "Request ID Does Not Match that of previously generated verification", "InvalidRequestId");
//             }
//         } else {
//             throw new HttpError(400, "Invalid User", "InvalidUserEmail");
//         }
//     } else {
//         console.log("Invalid role: ", this.params.role);
//         this.status = 400;
//     }
// };

