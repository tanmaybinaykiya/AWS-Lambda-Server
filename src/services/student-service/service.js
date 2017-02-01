var AWS = require('aws-sdk');
var jwt = require('jsonwebtoken');
var student = require("../../common/lib/student");

module.exports.getStudents = function* createUser(req, send) {
    console.log("getStudents: ", "this.state: ", this.state, "req: ", req, "send: ", send);
    var userObj = yield student.getStudents(this.params.institutionCode, this.params.schoolCode);
    this.body = { status: "ok" };
    this.status = 200;
};

module.exports.enrollStudent = function* enrollStudent(req, send) {
    console.log("enrollStudent: ", "this.state: ", this.state, "req: ", req, "send: ", send, this.params);
    var newStudent = this.request.body;
    newStudent.institutionShortCode = this.params.institutionCode;
    newStudent.schoolCode = this.params.schoolCode;
    var userObj = yield student.enrollStudent(newStudent);
    this.body = {
        studentId: userObj.studentId,
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
    this.status = 200;
};
