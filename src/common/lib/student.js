var studentDAO = require("./dao/student");
var schoolDAO = require("./dao/school");
var HttpError = require("./errors").HttpError;
var uuid = require("uuid");

module.exports.enrollStudent = function* (student) {

    validateStudentEnrollRequest(student);
    delete student.studentId;
    var existingStudents = null;
    try {
        existingStudents = yield studentDAO.getStudentsByBirthDateAndFirstName(new Date(student.dateOfBirth), student.firstName);
    } catch (err) {
        console.log("Error in getStudentByBirthDateAndFirstName", err);
        throw err;
    }
    if (existingStudents && existingStudents.length > 0) {
        console.log("Student with Birthdate and Firstname already exists", existingStudents.map(item => item.attrs));
        throw new HttpError(400, { err: "Student with Birthdate and Firstname already exists" });
    }
    var existingSchool = null;
    try {
        existingSchool = yield schoolDAO.getSchoolByInstitutionCodeAndSchoolCode(student.institutionShortCode, student.schoolCode);
    } catch (err) {
        console.log("Error in getSchoolByShortCode", err);
        throw err;
    }
    if (!existingSchool) {
        console.log("School with provided shortcode does not exist");
        throw new HttpError(400, { err: "School with provided shortcode does not exist" });
    }
    student.paymentInfo = {
        methodId: student.paymentMethodId
    };
    delete student.paymentMethodId;
    student.enrollmentInfo = {
        state: 'PENDING_REVIEW',
    };
    student.studentId = uuid.v1();
    
    var newStudent = null;
    try {
        var newStudent = yield studentDAO.createStudent(student);
    } catch (err) {
        console.log("Error in createStudent", err);
        throw err;
    }
    if (!newStudent) {
        throw new HttpError(400, "Bad request");
    }
    return newStudent;

}

function validateStudentEnrollRequest(student) {
    if (!student.institutionShortCode) throw new HttpError(400, { error: "Invalid institutionShortCode" });
    if (!student.schoolCode) throw new HttpError(400, { error: "Invalid schoolCode" });
    if (!student.firstName) throw new HttpError(400, { error: "Invalid firstName" });
    if (!student.lastName) throw new HttpError(400, { error: "Invalid lastName" });
    if (!student.dateOfBirth) throw new HttpError(400, { error: "Invalid dateOfBirth" });
    if (!student.gender) throw new HttpError(400, { error: "Invalid gender" });
    if (!student.documents) throw new HttpError(400, { error: "Invalid documents" });
    if (!student.documents.medicalForm) throw new HttpError(400, { error: "Invalid medicalForm" });
    if (!student.documents.tuitionForm) throw new HttpError(400, { error: "Invalid tuitionForm" });
    if (!student.parentEmail) throw new HttpError(400, { error: "Invalid parentEmail" });
    if (!student.paymentMethodId) throw new HttpError(400, { error: "Invalid paymentMethodId" });
}

module.exports.updateStudentDetails = function* (student) {
    if (student && student.studentId) {
        var existingStudent = yield studentDAO.getStudentByStudentId(student.studentId);
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

        yield studentDAO.updatedStudent(updatedStudent);
    } else {
        throw new HttpError(400, "Bad request");
    }
}

module.exports.unenrollStudent = function* (student) {
    if (student && student.studentId) {
        var existingStudent = yield studentDAO.getStudentByStudentId(student.studentId);
        if (!existingStudent) {
            throw new HttpError(400, "Student does not exist");
        }
        existingStudent.enrollmentInfo.isEnrolled = false;
        yield studentDAO.updateStudent(updatedStudent);
    } else {
        throw new HttpError(400, "Bad request");
    }
}

module.exports.approvePaymentDetails = function* (studentId) {
    if (studentId) {
        var existingStudent = yield studentDAO.getStudentByStudentId(studentId);
        if (!existingStudent) {
            throw new HttpError(400, "Bad request");
        }
        existingStudent.paymentInfo = {
            paymentStatus: "PAYMENT_CONFIRMED",
            confirmerAdminId: this.state.user.userId
        }
    }
}

//token should contain institutionShortCode and schoolCode
module.exports.getStudentsBySchoolCode = function* (schoolCode) {
    if (schoolCode) {
        var existingStudents = yield studentDAO.getStudentsBySchoolCode(schoolCode);
        return existingStudents;
    } else {
        throw new HttpError(400, "Bad request");
    }
}

module.exports.getStudentsByParentEmailAndSchoolCode = function* (parentEmail, schoolCode) {
    if (schoolCode) {
        var existingStudents = yield studentDAO.getStudentsByParentEmailAndSchoolCode(parentEmail, schoolCode);
        return existingStudents;
    } else {
        throw new HttpError(400, "Bad request");
    }
}

module.exports.getStudentsById  = function* (studentIds){
    if (studentIds) {
        return yield studentDAO.batchGetStudentsByStudentId(studentIds);
    } else {
        throw new HttpError(400, "Bad request");
    }
}

module.exports.updateStudents  = function* (students){
    if (students && students.length>0) {
        yield studentDAO.batchUpdateStudents(students);
    } else {
        throw new HttpError(400, "Bad request");
    }
}
