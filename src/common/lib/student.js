var dao = require("./dao");
var HttpError = require("./errors").HttpError;

var enrollStudent = function* (student) {

    if (student.institutionShortCode && student.schoolId && student.firstName &&
        student.lastName && student.dateOfBirth && student.gender && student.documents && student.documents.medicalForm
        && student.documents.tuitionForm) {
        delete student.studentId;
        var existingStudent = yield dao.getStudentByBirthDateAndFirstName(student.dateOfBirth, student.firstName);
        if (existingStudent) {
            throw new HttpError(400, "student with birthdate and firstname already exists");
        }
        var existingSchool = yield dao.getSchoolByShortCode(student.institutionShortCode, student.schoolId);
        if (!existingSchool) {
            throw new HttpError(400, "school with shortcode does not exist");
        }
        student.paymentInfo = {
            paymentStatus: "NOT_PAID"
        };
        student.enrollmentInfo = {
            isEnrolled: false,
            pastClassesEnrolled: [],
            classesEnrolled: []
        }
        var newStudent = yield dao.createStudent(student);
        if (!newStudent) {
            throw new HttpError(400, "Bad request");
        }
        return newStudent;
    } else {
        throw new HttpError(400, "Bad request");
    }

}

var updateStudentDetails = function* (student) {
    if (student && student.studentId) {
        var existingStudent = yield dao.getStudentByStudentId(student.studentId);
        if (!existingStudent) {
            throw new HttpError(400, "Student does not exist");
        }
        var updatedStudent = existingStudent;
        if (student.middlename) updatedStudent.middlename = student.middlename;
        if (student.lastname) updatedStudent.lastname = student.lastname;
        if (student.nickname) updatedStudent.nickname = student.nickname;
        if (student.cityOfBirth) updatedStudent.cityOfBirth = student.cityOfBirth;
        if (student.countryOfBirth) updatedStudent.countryOfBirth = student.countryOfBirth;
        if (student.stateOfBirth) updatedStudent.stateOfBirth = student.stateOfBirth;
        if (student.zip) updatedStudent.zip = student.zip;
        if (student.race) updatedStudent.race = student.race;
        if (student.gender) updatedStudent.gender = student.gender;
        if (student.extraInfo) updatedStudent.extraInfo = student.extraInfo;
        if (student.documents && student.documents.medicalForm) updatedStudent.documents.medicalForm = student.documents.medicalForm;
        if (student.documents && student.documents.tuitionForm) updatedStudent.documents.tuitionForm = student.documents.tuitionForm;

        yield dao.updatedStudent(updatedStudent);
    } else {
        throw new HttpError(400, "Bad request");
    }
}

var unenrollStudent = function* (student) {
    if (student && student.studentId) {
        var existingStudent = yield dao.getStudentByStudentId(student.studentId);
        if (!existingStudent) {
            throw new HttpError(400, "Student does not exist");
        }
        existingStudent.enrollmentInfo.isEnrolled = false;
        yield dao.updatedStudent(updatedStudent);
    } else {
        throw new HttpError(400, "Bad request");
    }
}

var updatePaymentDetails = function* (studentId, paymentDetails) {
    // if (studentId && paymentDetails) {

    // } else {
    //     throw new HttpError(400, "Bad request");
    // }

}

var approvePaymentDetails = function* (studentId) {
    if (studentId) {
        var existingStudent = yield dao.getStudentByStudentId(studentId);
        if (!existingStudent) {
            throw new HttpError(400, "Bad request");
        }
        existingStudent.paymentInfo = {
            paymentStatus: "PAYMENT_CONFIRMED",
            confirmerAdminId: this.state.user.userId
        }
    }
}

module.exports = {
    enrollStudent,
    updatePaymentDetails,
    approvePaymentDetails
}
