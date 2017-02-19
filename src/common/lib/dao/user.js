var dynogels = require ("./dynogelsConfig");
var models = require ("../models");

module.exports.getUser = function (email) {
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

module.exports.getUsers = function (emails) {
    return new Promise(function (resolve, reject) {
        console.log("Emails: ", emails);
        models.Users.getItems(emails, function (err, users) {
            if (err) {
                console.error("err: ", err);
                reject(err);
            } else {
                console.error("users: ", users);
                resolve(users);
            }
        });
    });
}

module.exports.createUser = function (user) {
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

module.exports.updateUser = function (user) {
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


module.exports.getUsersByFamilyCustomerId = function (familyId) {
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

module.exports.getUsersBySchoolCodeAndRole = function (code, role) {
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

module.exports.getUsersByInstitutionCodeAndRole = function (code, role) {
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