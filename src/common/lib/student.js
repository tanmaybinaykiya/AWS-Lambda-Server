var uuid = require("uuid");

var HttpError = require("./errors").HttpError;
var studentDAO = require("./dao/student");
var schoolDAO = require("./dao/school");
var paymentDAO = require("./dao/paymentMethod");
var paymentLib = require("./payment");
var userHelper = require("./user");
var classLib = require("./class");
var smsHelper = require("./smshelper");
var gradeLib = require("./grade");
var braintree = require("./braintree");

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
        throw new HttpError(400, "Student with Birthdate and Firstname already exists", "StudentEntityAlreadyExists");
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
        throw new HttpError(400, "School with provided shortcode does not exist", "InvalidSchoolCode");
    }
    var paymentMethod = yield paymentDAO.getPaymentMethodById(student.paymentMethodId);
    if (!paymentMethod) {
        console.log("Payment Method does not exist: ", student.paymentMethodId);
        throw new HttpError(400, "Payment Method does not exist", "InvalidPaymentMethod");
    }
    paymentMethod = paymentMethod.toJSON();
    console.log("paymentMethod: ", paymentMethod);
    delete student.paymentMethodId;
    student.paymentInfo = {
        methodId: paymentMethod.methodId
    };
    student.enrollmentInfo = {
        state: 'PENDING_REVIEW',
    };
    student.studentId = uuid.v1();
    student.firstName = titleCase(student.firstName);
    student.lastName = titleCase(student.lastName);
    student.middleName = titleCase(student.middleName);
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

module.exports.getStudentsById = function* (studentIds) {
    if (studentIds) {
        return yield studentDAO.batchGetStudentsByStudentId(studentIds);
    } else {
        throw new HttpError(400, "Bad request");
    }
}

module.exports.updateStudents = function* (students) {
    if (students && students.length > 0) {
        yield studentDAO.batchUpdateStudents(students);
    } else {
        throw new HttpError(400, "Bad request");
    }
}

titleCase = (str) => (str ? str.toLowerCase().replace(/\b(\w)/g, s => s.toUpperCase()) : '');

module.exports.assignStudentClass = function* (institutionCode, schoolCode, studentIds, className) {

    console.log("getting Enrolled Students: ", studentIds);
    var enrolledStudents = yield this.getStudentsById(studentIds);
    console.log("enrolled Students: ", enrolledStudents);
    if (!enrolledStudents || enrolledStudents.length < 1) {
        throw new HttpError(404, "Student Does not exist", "InvalidStudentId");
    }
    if (enrolledStudents.length > 20) {
        throw new HttpError(400, "Too many Student Ids Passed to request", "StudentIdCountExceeded");
    }

    console.log("getting ClassBySchoolAndName: ", institutionCode, schoolCode, className);
    var clazz = yield classLib.getClassBySchoolAndName(institutionCode, schoolCode, className);
    console.log("got ClassBySchoolAndName: ", clazz);
    if (!clazz) {
        throw new HttpError(400, "Invalid class", "InvalidClassName");
    }
    clazz = clazz.Items[0].toJSON();

    console.log("getting GradeByName: ", institutionCode, schoolCode, classLib.getGradeNameForClass(clazz));
    var grade = yield gradeLib.getGradeBySchoolAndName(institutionCode, schoolCode, classLib.getGradeNameForClass(clazz));
    console.log("got GradeByName: ", grade);
    if (!grade) {
        throw new HttpError(500, "Invalid grade", "InvalidGradeName");
    }
    grade = grade.toJSON();

    var planId = grade.planId;
    // console.log(enrolledStudents);
    if ((clazz.fullCapacity - clazz.currentUsage) < studentIds.length) {
        throw new HttpError(400, "Class does not have enough slots to complete the request", "ClassCapacityConstraintViolation");
    }

    if (enrolledStudents.some(isStudentAgeConstraintViolated(grade))) {
        throw new HttpError(400, "StudentAgeConstraintViolation", "StudentAgeConstraintViolation");
    }

    console.log("getting SchoolByInstitutionCodeAndSchoolCode: ", institutionCode, schoolCode);
    var school = yield schoolDAO.getSchoolByInstitutionCodeAndSchoolCode(institutionCode, schoolCode);
    console.log("got SchoolByInstitutionCodeAndSchoolCode: ", school);
    school = school.toJSON();
    if (!school || !school.braintreeCredentials) {
        throw new HttpError(400, "BraintreeCredentialsMissing", "BraintreeCredentialsMissing");
    }

    var paymentMethodIds = enrolledStudents.map((student) => student.paymentInfo.methodId);
    console.log("getting PaymentMethodByIds: ", paymentMethodIds);
    var paymentMethods = yield paymentLib.getPaymentMethodsByIds(paymentMethodIds);
    console.log("got PaymentMethodsByIds: ", paymentMethods);
    if (paymentMethods.length !== enrolledStudents.length) {
        console.log("Payment Methods array size not equal to students array size: methods: ", paymentMethods, " students: ", enrolledStudents);
        throw new HttpError(500, "Unhandled Server Error", "InternalServerError");
    }

    for (var i = 0; i < enrolledStudents.length; i++) {
        var prevEnrInf = enrolledStudents[i].enrollmentInfo;
        enrolledStudents[i].enrollmentInfo = {
            pastClassesEnrolled: prevEnrInf.pastClassesEnrolled ? prevEnrInf.pastClassesEnrolled.concat(prevEnrInf.classEnrolled) : [prevEnrInf.classEnrolled],
            classEnrolled: className,
            state: 'REGISTERED'
        };
        var paymentMethod = paymentMethods[i];
        console.log("Adding Subscription:  ", school.braintreeCredentials, paymentMethod.braintree.token, planId);
        var subscriptionId = yield braintree.addSubscription(school.braintreeCredentials, paymentMethod.braintree.token, planId);
        console.log("Added Subscription:  ", subscriptionId);
        enrolledStudents[i].paymentInfo.subscriptionId = subscriptionId;
        console.log("Updating Student:  ", enrolledStudents[i]);
        yield studentDAO.updateStudent(enrolledStudents[i]);
        console.log("Updated Student:  ", enrolledStudents[i]);
    }

    console.log("Incrementing class Usage:  ", clazz, studentIds.length);
    yield classLib.incrementCurrentUsage(clazz, studentIds.length);
    console.log("Incremented class usage");

    // TODODODODODODOD
    yield sendStudentAdditionSuccessMessage(enrolledStudents);

}

function isStudentAgeConstraintViolated(grade) {
    return (student) => {
        var studentBirthDate = new Date(student.dateOfBirth);
        var validationDate = new Date(grade.minimumAgeCriterion.validationDate);
        var dateDiff = Math.floor((validationDate - studentBirthDate) / (1000 * 3600 * 24 * 365));
        return dateDiff < grade.minimumAgeCriterion.age;
    };
}

function* sendStudentAdditionSuccessMessage(enrolledStudents) {
    console.log("sendStudentAdditionSuccessMessage: ", enrolledStudents);
    var parentEmails = enrolledStudents.map(student => student.parentEmail);
    var parents = yield userHelper.findByEmails(parentEmails);
    parents = parents.map(parent => parent.toJSON());
    console.log("parents: ", parents);
    for (var i = 0; i < enrolledStudents.length; i++) {
        var parent = parents.find(parent => parent.email === enrolledStudents[i].parentEmail);
        console.log("parent: ", parent);
        yield smsHelper.sendNotification(parent.mobile, "Congratulations!, The admin has approved the addition of " + enrolledStudents[i].firstName + ".");
    }
}
