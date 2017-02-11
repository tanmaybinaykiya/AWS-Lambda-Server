var dynogels = require("./dynogelsConfig");
var models = require ("../models");

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

module.exports.getClassByName = function (compositeKey, name) {
    return new Promise(function (resolve, reject) {
        models.Class.get(compositeKey, name, function (err, clazz) {
            if (err) {
                console.error("err, clazz :: ", err, clazz);
                reject(err);
            } else {
                resolve(clazz);
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

module.exports.getClassesBySchool = function (secondaryCompositeKey) {
    return new Promise((resolve, reject) => {
        models.Class.query(secondaryCompositeKey)
            .usingIndex('SchoolNameIndex')
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

module.exports.getClassBySchoolAndName = function (secondaryCompositeKey, className) {
    return new Promise((resolve, reject) => {
        models.Class.query(secondaryCompositeKey)
            .usingIndex('SchoolNameIndex')
            .where('name').equals(className)
            .exec((err, clazz) => {
                if (err) {
                    console.log("Error occured: ", err, clazz);
                    reject(err);
                } else {
                    resolve(clazz);
                }
            });
    });
}

