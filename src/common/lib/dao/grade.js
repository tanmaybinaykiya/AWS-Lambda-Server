var dynogels = require("./dynogelsConfig");
var models = require ("../models");

module.exports.createGrade = function (grade) {
    return new Promise(function (resolve, reject) {
        models.Grade.create(grade, function (err, resp) {
            if (err) {
                reject(err);
            } else {
                resolve(resp);
            }
        });
    });
}

module.exports.getGradesByInstitutionSchoolCode = function (institutionSchoolCode) {
    return new Promise((resolve, reject) => {
        models.Grade.query(institutionSchoolCode)
            .loadAll()
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

module.exports.getGradesByInstitutionSchoolCodeAndName = function (institutionSchoolCode, gradeName) {
    return new Promise((resolve, reject) => {
        models.Grade.get(institutionSchoolCode, gradeName, (err, result) => {
                if (err) {
                    console.log("Error: ", err);
                    reject(err);
                } else {
                    resolve(result);
                }
            });
    });
}