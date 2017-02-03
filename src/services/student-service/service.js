var AWS = require('aws-sdk');
var jwt = require('jsonwebtoken');
var student = require("../../common/lib/student");

module.exports.getStudents = function* (req, send) {
    console.log("getStudents: ", "this.state: ", this.state, "req: ", req, "send: ", send);
    if (this.state.user.role === 'parent') {
        var queryParams = this.request.query;
        if (!queryParams.parentEmail) {
            this.status = 400;
        } else {
            var userObjs = yield student.getStudentsByParentEmailAndSchoolCode(queryParams.parentEmail, this.params.schoolCode);
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
        var userObjs = yield student.getStudentsBySchoolCode(this.params.schoolCode);
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
    var userObj = yield student.enrollStudent(newStudent);
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
    this.status = 200;
};
