var dynogels = require ("./dynogelsConfig");
var models = require ("../models");

module.exports.createSchool = function (school) {
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

module.exports.getSchoolsByInstitutionCode = function (institutionCode) {
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

module.exports.getSchoolByInstitutionCodeAndSchoolCode = function (institutionCode, shortCode) {
    console.log("getSchoolByInstitutionCodeAndSchoolCode: ", institutionCode, shortCode);
    return new Promise(function (resolve, reject) {
        models.School.get(institutionCode, shortCode, function (err, school) {
            if (err) {
                console.error("err, school :: ", err, school);
                reject(err);
            } else {
                resolve(school);
            }
        });
    });
}

module.exports.updateSchool = function (school) {
    return new Promise((resolve, reject) => {
        models.School.update(school, (err, updatedSchool) => {
                if (err) {
                    console.log("Error: ", err);
                    reject(err);
                } else {
                    resolve(updatedSchool);
                }
            });
    });
}
