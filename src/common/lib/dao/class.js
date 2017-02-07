var dynogels = require ("./dynogelsConfig");

module.exports.createClass = function (clazz) {
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


module.exports.getClassByShortCode = function (schoolCode, classCode) {
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

module.exports.getClassesBySchoolCodeAndInstitutionCode = function (schoolCode, institutionCode) {
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

module.exports.getClassesByGrade = function (compositeKey) {
    return new Promise((resolve, reject) => {
        models.Class.query(compositeKey)
            .loadAll()
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