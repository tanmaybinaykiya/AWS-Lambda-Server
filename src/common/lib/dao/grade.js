var dynogels = require ("./dynogelsConfig");

module.exports.createGrade = function (grade) {
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

module.exports.getGradesBySchoolCodeAndInstitution = function (schoolCode, institutionShortCode) {
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

module.exports.getGradesBySchoolCodeAndName = function (schoolCode, gradeName) {
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