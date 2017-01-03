var dynogels = require("dynogels");
var models = require("./models");
var AWS = require("aws-sdk");

if (process.env.SERVERLESS_STAGE === 'dev') {
    var opts = { endpoint: 'http://localhost:8000', apiVersion: '2012-08-10', region: "us-east-1" };
    dynogels.dynamoDriver(new AWS.DynamoDB(opts));
} else {
    dynogels.dynamoDriver(new AWS.DynamoDB());
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
                    resolve(schools);
                }
            });
    });
}

var getSchoolByShortCode = function (institutionCode, shortCode) {
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


var getClassByShortCode = function (schoolCode, classCode) {
    return new Promise(function (resolve, reject) {
        models.Class.get(schoolCode,classCode, function (err, clazz) {
            if (err) {
                console.error("err, clazz :: ", err, clazz);
                reject(err);
            } else {
                resolve(clazz);
            }
        });
    });
}

var getClassesBySchoolCode = function (schoolCode,institutionCode) {
    return new Promise(function (resolve, reject) {
        models.Class.query(schoolCode)
            .loadAll()
            .where('institutionShortCode').equals(institutionCode)
            .exec(function (err, classes) {
                if (err) {
                    console.error("err, classes :: ", err, classes);
                    reject(err);
                } else {
                    resolve(classes);
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
    getSchoolByShortCode,
    createClass,
    getClassByShortCode
}