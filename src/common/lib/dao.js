var dynogels = require("dynogels");
dynogels.log.level("info");
var models = require("./models");

if (process.env.IS_LOCAL) {
    console.log("IS LOCAL");
    dynogels.AWS.config.update({ region: 'us-east-1' });
    var opts = {
        apiVersion: "2012-08-10",
        credentials: new dynogels.AWS.Credentials(process.env.AWS_ACCESS_KEY_ID, process.env.AWS_SECRET_ACCESS_KEY),
        region: "us-east-1",
        endpoint: "http://localhost:8000"
    };
    dynogels.dynamoDriver(new dynogels.AWS.DynamoDB(opts));
} else {
    dynogels.dynamoDriver(new dynogels.AWS.DynamoDB());
}

var createTables = function () {
    return new Promise(function (resolve, reject) {
        dynogels.createTables(function (err) {
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
        console.log("Email: ", email);
        models.Users.get(email, function (err, user) {
            if (err) {
                console.error("err, user :: ", err, user);
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

var updateUser = function (user) {
    return new Promise(function (resolve, reject) {
        models.Users.update(user, function (err, user) {
            if (err) {
                reject(err);
            } else {
                resolve(user);
            }
        });
    });
}

var createInstitution = function (institution) {
    return new Promise(function (resolve, reject) {
        models.Institution.create(institution, function (err, institution) {
            if (err) {
                reject(err);
            } else {
                resolve(institution);
            }
        });
    });
}


var getInstitutionByShortcode = function (shortCode) {
    return new Promise(function (resolve, reject) {
        models.Institution.get(shortCode, function (err, institution) {
            if (err) {
                console.error("err, institution :: ", err, institution);
                reject(err);
            } else {
                resolve(institution);
            }
        });
    });
}


var createSchool = function (school) {
    return new Promise(function (resolve, reject) {
        models.School.create(school, function (err, school) {
            if (err) {
                reject(err);
            } else {
                resolve(school);
            }
        });
    });
}


var getSchoolsByInstitutionCode = function (institutionCode) {
    return new Promise(function (resolve, reject) {
        models.School.query(institutionCode)
            .loadAll()
            .exec(function (err, schools) {
                if (err) {
                    console.error("err, schools :: ", err, schools);
                    reject(err);
                } else {
                    resolve(schools.Items);
                }
            });
    });
}

var getSchoolByInstitutionCodeAndSchoolCode = function (institutionCode, shortCode) {
    console.log("getSchoolByInstitutionCodeAndSchoolCode: ", institutionCode, shortCode);
    return new Promise(function (resolve, reject) {
        models.School.get(institutionCode, shortCode, function (err, school) {
            if (err) {
                console.error("err, school :: ", err, school);
                reject(err);
            } else {
                console.log("Found School: ", school);
                resolve(school);
            }
        });
    });
}


var createClass = function (clazz) {
    return new Promise(function (resolve, reject) {
        models.Class.create(clazz, function (err, clazz) {
            if (err) {
                reject(err);
            } else {
                resolve(clazz);
            }
        });
    });
}

var createStudent = function (clazz) {
    return new Promise(function (resolve, reject) {
        models.Student.create(clazz, function (err, resp) {
            if (err) {
                reject(err);
            } else {
                resolve(resp);
            }
        });
    });
}

var getClassByShortCode = function (schoolCode, classCode) {
    return new Promise(function (resolve, reject) {
        models.Class.get(schoolCode, classCode, function (err, clazz) {
            if (err) {
                console.error("err, clazz :: ", err, clazz);
                reject(err);
            } else {
                resolve(clazz);
            }
        });
    });
}

var getClassesBySchoolCodeAndInstitutionCode = function (schoolCode, institutionCode) {
    return new Promise(function (resolve, reject) {
        models.Class.query(schoolCode)
            .loadAll()
            .where('institutionShortCode').equals(institutionCode)
            .exec(function (err, classes) {
                if (err) {
                    console.error("err, classes :: ", err, classes);
                    reject(err);
                } else {
                    resolve(classes.Items);
                }
            });
    });
}

var getStudentsByBirthDateAndFirstName = function (dateOfBirth, firstName) {
    return new Promise(function (resolve, reject) {
        models.Student.query(dateOfBirth)
            .where('firstName').eq(firstName)
            .usingIndex('StudentsBirthDateNameIndex')
            .exec(function (err, students) {
                if (err) {
                    console.error("err, students :: ", err, students);
                    reject(err);
                } else {
                    resolve(students.Items);
                }
            });
    });
}

var getStudentByStudentId = function (studentId) {
    return new Promise(function (resolve, reject) {
        models.Student.get(studentId, function (err, student) {
            if (err) {
                console.error("err, student :: ", err, student);
                reject(err);
            } else {
                resolve(student);
            }
        });
    });
}

var getUsersByFamilyCustomerId = function (familyId) {
    return new Promise(function (resolve, reject) {
        models.Users.query(familyId)
            .usingIndex('UsersFamilyIndex')
            .loadAll()
            .exec((err, mgrs) => {
                if (err) {
                    console.error("err, mgrs :: ", err, mgrs);
                    reject(err);
                } else {
                    resolve(mgrs);
                }
            });
    });
}

var getUsersBySchoolCodeAndRole = function (code, role) {
    return new Promise((resolve, reject) => {
        models.Users.query(code)
            .usingIndex('UsersSchoolRoleIndex')
            .where("role").eq(role)
            .exec((err, users) => {
                if (err) {
                    console.log("Error occured: ", err, users);
                    reject(err);
                } else {
                    resolve(users);
                }
            });
    });
}

var getUsersByInstitutionCodeAndRole = function (code, role) {
    return new Promise((resolve, reject) => {
        models.Users.query(code)
            .usingIndex('UsersInstitutionIndex')
            .where("role").eq(role)
            .exec((err, users) => {
                if (err) {
                    console.log("Error occured: ", err, users);
                    reject(err);
                } else {
                    resolve(users);
                }
            });
    });
}

var getClassesBySchoolCodeAndGrade = function (schoolCode, gradeCode) {
    return new Promise((resolve, reject) => {
        models.Class.query(schoolCode, code)
            .exec((err, classes) => {
                if (err) {
                    console.log("Error occured: ", err, classes);
                    reject(err);
                } else {
                    resolve(classes);
                }
            });
    });
}

var createGrade = function (grade) {
    return new Promise(function (resolve, reject) {
        models.Grade.create(clazz, function (err, clazz) {
            if (err) {
                reject(err);
            } else {
                resolve(clazz);
            }
        });
    });
}

var getGradesBySchoolCodeAndInstitution = function (schoolCode, institutionShortCode) {
    return new Promise((resolve, reject) => {
        models.Grade.query(schoolCode)
            .usingIndex('GradeInstitutionIndex')
            .where("institutionShortCode").eq(institutionShortCode)
            .exec((err, result) => {
                if (err) {
                    console.log("Error: ", err);
                    reject(err);
                } else {
                    resolve(result);
                }
            });
    });
}

var getGradesBySchoolCodeAndName = function (schoolCode, gradeName) {
    return new Promise((resolve, reject) => {
        models.Grade.get(schoolCode, gradeName)
            .exec((err, result) => {
                if (err) {
                    console.log("Error: ", err);
                    reject(err);
                } else {
                    resolve(result);
                }
            });
    });
}

var getStudentsBySchoolCode = function (schoolCode) {
    return new Promise((resolve, reject) => {
        models.Student
            .query(schoolCode)
            .usingIndex('StudentsSchoolRoleIndex')
            .exec((err, results) => {
                if (err) {
                    console.log("Error: ", err);
                    reject(err);
                } else {
                    resolve(results.Items.map(item => item.attrs));
                }
            });
    });
}
var getStudentsByParentEmailAndSchoolCode = function (email, code) {
    return new Promise((resolve, reject) => {
        models.Student
            .query(email)
            .usingIndex('StudentsParentEmailIndex')
            .exec((err, results) => {
                if (err) {
                    console.log("Error: ", err);
                    reject(err);
                } else {
                    resolve(results.Items.map(item => item.attrs));
                }
            });
    });
}

var addPaymentMethod = function (paymentMethod) {
    return new Promise(function (resolve, reject) {
        models.PaymentMethod.create(paymentMethod, function (err, resp) {
            if (err) {
                reject(err);
            } else {
                resolve(resp);
            }
        });
    });
}

var getPaymentMethodsForParentEmail = function (parentEmail) {
    return new Promise((resolve, reject) => {
        models.PaymentMethod.query(parentEmail)
            .loadAll()
            .usingIndex('ParentMethodIndex')
            .exec((err, result) => {
                if (err) {
                    console.log("Error: ", err);
                    reject(err);
                } else {
                    resolve(result);
                }
            });
    });
}

module.exports = {
    createTables,

    getUser,
    createUser,

    createInstitution,
    getInstitutionByShortcode,

    createSchool,
    getSchoolsByInstitutionCode,
    getSchoolByInstitutionCodeAndSchoolCode,

    createStudent,
    getStudentsByBirthDateAndFirstName,
    getStudentsByParentEmailAndSchoolCode,
    getStudentsBySchoolCode,
    getStudentByStudentId,

    getUsersByFamilyCustomerId,
    getUsersBySchoolCodeAndRole,
    getUsersByInstitutionCodeAndRole,

    createClass,
    getClassesBySchoolCodeAndInstitutionCode,
    getClassesBySchoolCodeAndGrade,

    getGradesBySchoolCodeAndInstitution,
    getGradesBySchoolCodeAndName,

    addPaymentMethod,
    getPaymentMethodsForParentEmail

}