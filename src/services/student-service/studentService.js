var AWS = require('aws-sdk');
var jwt = require('jsonwebtoken');

var HttpError = require("../../common/lib/errors").HttpError;
var constants = require("../../common/lib/constants");
var studentLib = require("../../common/lib/student");

module.exports.getStudents = function* (req, send) {
    console.log("getStudents: ", "this.state: ", this.state, "req: ", req, "send: ", send);
    if (this.state.user.role === 'parent') {
        var queryParams = this.request.query;
        if (!queryParams.parentEmail) {
            this.status = 400;
        } else {
            var userObjs = yield studentLib.getStudentsByParentEmailAndSchoolCode(queryParams.parentEmail, this.params.schoolCode);
            console.log("userObjs: ", userObjs);
            if (!userObjs || userObjs.length < 1) {
                this.status = 204;
            } else {
                this.status = 200;
                this.body = userObjs.map(userObj => {
                    return {
                        studentId: userObj.studentId,
                        firstName: userObj.firstName,
                        middleName: userObj.middleName,
                        lastName: userObj.lastName,
                        nickname: userObj.nickname,
                        dateOfBirth: userObj.dateOfBirth,
                        cityOfBirth: userObj.cityOfBirth,
                        countryOfBirth: userObj.countryOfBirth,
                        stateOfBirth: userObj.stateOfBirth,
                        zip: userObj.zip,
                        race: userObj.race,
                        gender: userObj.gender,
                        extraInfo: userObj.extraInfo
                    }
                });
            }
        }
    } else {
        var userObjs = yield studentLib.getStudentsBySchoolCode(this.params.schoolCode);
        this.status = 200;
        this.body = userObjs.map(userObj => ({
            studentId: userObj.studentId,
            firstName: userObj.firstName,
            middleName: userObj.middleName,
            lastName: userObj.lastName,
            nickname: userObj.nickname,
            dateOfBirth: userObj.dateOfBirth,
            cityOfBirth: userObj.cityOfBirth,
            countryOfBirth: userObj.countryOfBirth,
            stateOfBirth: userObj.stateOfBirth,
            zip: userObj.zip,
            race: userObj.race,
            gender: userObj.gender,
            extraInfo: userObj.extraInfo,
            paymentInfo: userObj.paymentInfo,
            enrollmentInfo: userObj.enrollmentInfo,
            documents: userObj.documents
        }));
    }
};

module.exports.enrollStudent = function* (req, send) {
    console.log("enrollStudent: ", "this.state: ", this.state, "req: ", req, "send: ", send, this.params);
    var newStudent = this.request.body;
    newStudent.institutionShortCode = this.params.institutionCode;
    newStudent.schoolCode = this.params.schoolCode;
    var userObj = yield studentLib.enrollStudent(newStudent);
    this.body = {
        studentId: userObj.get("studentId"),
        // firstName: userObj.firstName,
        // middleName: userObj.middleName,
        // lastName: userObj.lastName,
        // nickname: userObj.nickname,
        // dateOfBirth: userObj.dateOfBirth,
        // cityOfBirth: userObj.cityOfBirth,
        // countryOfBirth: userObj.countryOfBirth,
        // stateOfBirth: userObj.stateOfBirth,
        // zip: userObj.zip,
        // race: userObj.race,
        // gender: userObj.gender,
        // extraInfo: userObj.extraInfo,
        // paymentInfo: userObj.paymentInfo,
        // enrollmentInfo: userObj.enrollmentInfo,
        // documents: userObj.documents

    };
    this.status = 201;
};

module.exports.updateStudentStatus = function* () {
    var requestBody = this.request.body;
    if (requestBody && requestBody.state && isValidState(requestBody.state) && requestBody.studentIds && requestBody.studentIds.length > 0) {
        var studentIds = requestBody.studentIds;
        var enrolledStudents = yield studentLib.getStudentsById(studentIds);
        // console.log(enrolledStudents);
        if (enrolledStudents && enrolledStudents.length > 0) {
            for (var i = 0; i < enrolledStudents.length; i++) {
                console.log(enrolledStudents[i]);
                enrolledStudents[i].enrollmentInfo.state = requestBody.state;
            }
            yield studentLib.updateStudents(enrolledStudents);
            this.status = 200;
        } else {
            throw new HttpError(404, "Student Does not exist", "InvalidStudentId");
        }

    } else {
        throw new HttpError(400, "Invalid params", "BadRequest");
    }
}

module.exports.updateStudentClass = function* () {
    var requestBody = this.request.body;
    var studentIds = requestBody.studentIds;
    var className = requestBody.className
    var institutionCode = this.params.institutionCode;
    var schoolCode = this.params.schoolCode;
    if (requestBody && className && studentIds && studentIds.length > 0) {
        yield studentLib.assignStudentClass(institutionCode, schoolCode, studentIds, className);
        this.status = 200;
    } else {
        throw new HttpError(400, "Invalid Params", "BadRequest");
    }
}

function isValidState(state) {
    return state.match(constants.nonRegisteredEnrollmentStateRegex) && (state.match(constants.nonRegisteredEnrollmentStateRegex)[0] === state);
}
