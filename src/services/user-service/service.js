var AWS = require('aws-sdk');
var jwt = require('jsonwebtoken');

var HttpError = require("../../common/lib/errors").HttpError;
var userHelper = require("../../common/lib/user");
var emailHelper = require("../../common/lib/emailhelper");
var institutionHelper = require("../../common/lib/institution");
var schoolHelper = require("../../common/lib/school");
var smsHelper = require("../../common/lib/smshelper");
var constants = require("../../common/lib/constants");

function getInstitutionSchoolCodeCompositeKey(institutionShortCode, schoolCode) {
    return [institutionShortCode, schoolCode].join(":");
}

module.exports.createStaff = function* (req, send) {
    console.log("createStaff: ", "this.state: ", this.state, "req: ", req, "send: ", send);
    var requestBody = this.request.body;
    validateCreateUserRequestBody(requestBody);
    if (this.params.role === "staff" || this.params.role === "teacher") {
        var newUser = {
            "email": requestBody.email,
            "institutionShortCode": this.params.institutionCode,
            "institutionSchoolCode": getInstitutionSchoolCodeCompositeKey(this.params.institutionCode, this.params.schoolCode),
            "schoolCode": this.params.schoolCode,
            "role": this.params.role,
            "mobile": requestBody.contact,
            "firstname": requestBody.firstName,
            "lastname": requestBody.lastName,
            "street": requestBody.street,
            "city": requestBody.city,
            "state": requestBody.state,
            "zip": requestBody.zip,
        };
        var user = yield userHelper.addStaff(newUser);
        this.body = { status: "ok" };
        this.status = 201;
    } else {
        console.log("Invalid role: ", this.params.role);
        this.status = 400;
    }
};

var userResponseMapper = (user) => ({
    role: user.role,
    firstName: user.firstname,
    lastName: user.lastname,
    teacherId: (user.role === "teacher") ? user.teacherId : undefined,
    email: user.email
});

module.exports.getStaffByRole = function* () {
    var users = yield userHelper.getStaffBySchoolAndRole(this.params.institutionCode, this.params.schoolCode, this.params.role);
    this.body = users.map(user => user.toJSON()).map(userResponseMapper);
    this.status = 200;
}

module.exports.getStaff = function* () {
    var users = yield userHelper.getStaffBySchool(this.params.institutionCode, this.params.schoolCode);
    this.body = users.map(user => user.toJSON()).map(userResponseMapper);
    this.status = 200;
}

function validateCreateUserRequestBody(requestBody) {
    if (!requestBody.email) throw new HttpError(400, "Invalid Request Body", "InvalidEmail");
    if (!requestBody.firstName) throw new HttpError(400, "Invalid Request Body", "InvalidFirstName");
    if (!requestBody.lastName) throw new HttpError(400, "Invalid Request Body", "InvalidLastName");
    if (!requestBody.contact) throw new HttpError(400, "Invalid Request Body", "InvalidContact");
}

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
    console.log("validateRegisterAdminRequestBody");
    validateRegisterAdminRequestBody(requestBody);
    if (!requestBody.schoolCode) throw new HttpError(400, "Invalid Request Body", "InvalidSchoolCode");
}

module.exports.registerParent = function* createUser(req, send) {
    console.log("registerParent");
    var requestBody = this.request.body;
    validateRegisterParentRequestBody(requestBody);
    if (requestBody.email && this.state.user.email && requestBody.email.length > 0 && requestBody.email.indexOf(this.state.user.email) > -1) {
        try {
            var requestId = yield smsHelper.verifyOTP(requestBody.contact.verification.requestId, requestBody.contact.verification.code);
        } catch (err) {
            console.log("Error verifying number. Reason:", err);
            throw new HttpError(400, "Contact Number Verification Failed", "ContactVerificationFailed");
        }
        if (requestId) {
            var newUser = {
                email: requestBody.email,
                mailVerified: true,
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
            this.status = 201;
        } else {
            throw new HttpError(400, "Invalid Request Body", "InvalidSchoolCode");
        }
    } else {
        console.log("Email in token does not match that of request body. ReqBody:", this.state.user.email, requestBody.email);
        this.status = 403;
    }
};

module.exports.sendNexmoMessage = function* () {
    console.log("sendNexmoMessage");
    try {
        var messageId = yield smsHelper.sendNotification("+3125902259", "This is a test message generated by Tanmay, Revert back to him with a whatsapp message if you receive this message!");
        console.log("Received messageId: ", messageId);
    } catch (err) {
        console.log("Error occured");
        throw new HttpError(500, "Error occured sending notifcaiton", err);
    }
    this.status = 200
    this.body = { status: "ok" }
}

module.exports.registerAdmin = function* createUser(req, send) {
    console.log("registerAdmin");
    var requestBody = this.request.body;
    validateRegisterAdminRequestBody(requestBody);
    if (this.state.user.email === requestBody.email) {
        try {
            var requestId = yield smsHelper.verifyOTP(requestBody.contact.verification.requestId, requestBody.contact.verification.code);
        } catch (err) {
            console.log("Error verifying number. Reason:", err);
            throw new HttpError(400, "Contact Number Verification Failed", "ContactVerificationFailed");
        }
        if (requestId) {
            var newUser = {
                email: requestBody.email,
                mailVerified: true,
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
            this.status = 201;
        } else {
            throw new HttpError(400, "Invalid Request Body", "InvalidSchoolCode");
        }
    } else {
        console.log("Email in token does not match that of request body. ReqBody:", this.state.user.email, requestBody.email);
        this.status = 403;
    }
};

module.exports.generateVerificationCode = function* () {
    console.log("generateVerificationCode: ", this.request.body);
    var requestBody = this.request.body;
    console.log("validateGenerateVerificationCodeRequestBody ");
    validateGenerateVerificationCodeRequestBody(requestBody);
    console.log("after validateGenerateVerificationCodeRequestBody ");
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

/*
module.exports.verifyUser = function* (req, send) {
    console.log("verifyUser ");
    var requestBody = this.request.body;
    if (requestBody.email && requestBody.requestId && requestBody.verificationCode) {
        var user = yield userHelper.getUser(requestBody.email);
        if (user) {
            var requestId = yield smsHelper.verifyOTP(requestBody.requestId, requestBody.verificationCode);
            if (requestId && user.mobileVerificationRequestId && user.mobileVerificationRequestId === requestId) {
                user.mobileVerified = true;
                delete user.mobileVerificationRequestId;
                yield userHelper.updateUser(user);
                this.body = { status: "ok" };
                this.status = 200;
            } else {
                throw new HttpError(400, "Request ID Does Not Match that of previously generated verification", "InvalidRequestId");
            }
        } else {
            throw new HttpError(400, "Invalid User", "InvalidUserEmail");
        }
    } else {
        console.log("Invalid role: ", this.params.role);
        this.status = 400;
    }
};
*/
module.exports.inviteParent = function* () {
    var requestBody = this.request.body;
    var institutionCode = this.params.institutionCode;
    var schoolCode = this.params.schoolCode;
    if (requestBody.email && requestBody.email.length > 0 && institutionCode && schoolCode) {
        var school = yield schoolHelper.getSchoolByInstitutionCodeAndSchoolCode(institutionCode, schoolCode);
        if (school) {
            yield emailHelper.sendParentInvite(requestBody.email, school.toJSON());
            this.status = 200;
            this.body = { status: "ok" }
        } else {
            throw new HttpError(400, "Invalid school", "SchoolNotFound");
        }
    } else {
        throw new HttpError(400, "Invalid request body", "BadRequest");
    }
};

module.exports.inviteAdmin = function* () {
    var requestBody = this.request.body;
    var institutionCode = this.params.institutionCode;
    if (requestBody.email && institutionCode) {
        var institution = yield institutionHelper.getInstitution(institutionCode);
        if (institution) {
            yield emailHelper.sendAdminInvite(requestBody.email, institution.toJSON());
            this.status = 200;
            this.body = { status: "ok" }
        } else {
            throw new HttpError(400, "Invalid institution", "InstitutionNotFound");
        }
    } else {
        throw new HttpError(400, "Invalid request body", "BadRequest");
    }
};
