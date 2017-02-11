var dynogels = require("./dynogelsConfig");
var models = require("../models");

module.exports.createStudent = function (clazz) {
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


module.exports.getStudentsByBirthDateAndFirstName = function (dateOfBirth, firstName) {
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

module.exports.getStudentByStudentId = function (studentId) {
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

module.exports.getStudentsBySchoolCode = function (schoolCode) {
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
module.exports.getStudentsByParentEmailAndSchoolCode = function (email, code) {
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

module.exports.batchGetStudentsByStudentId = function (studentIds) {
    return new Promise((resolve, reject) => {
        models.Student.getItems(studentIds, (err, results) => {
            if (err) {
                console.log("Error: ", err);
                reject(err);
            } else {
                resolve(results.map(item => item.toJSON()));
            }
        });
    });
}

module.exports.batchUpdateStudents = function (students) {
    try {
        var promises = students.map(student => new Promise((resolve, reject) => {
            models.Student.update(student, (err, results) => {
                if (err) {
                    console.log("Error: ", err);
                    reject(err);
                } else {
                    resolve();
                }
            });
        }));
    } catch (err) {
        console.log("ERRR 1 : ", err);
    }
    try {
        return Promise.all(promises)
            .then(resp => console.log(resp))
            .catch(err => console.log(err));
    } catch (err2) {
        console.log("ERRR 2 : ", err2);
    }
}

module.exports.updateStudent = function (student) {
    return new Promise((resolve, reject) => {
        models.Student.update(student, (err, results) => {
            if (err) {
                console.log("Error: ", err);
                reject(err);
            } else {
                resolve();
            }
        });
    });
}
