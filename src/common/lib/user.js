var bcrypt = require("co-bcryptjs");
var userDAO = require("./dao/user");
var HttpError = require("./errors").HttpError;

module.exports.validateAndGetUser = function* (email, password) {
    var user = yield userDAO.getUser(email);
    if (!user) {
        throw new HttpError(401, "Invalid username or password");
    }
    if (yield bcrypt.compare(password, user.get("passwordHash"))) {
        return user.toJSON();
    } else {
        throw new HttpError(401, "Invalid username or password");
    }
}

module.exports.addUser = function* (user) {
    var existinguser = yield userDAO.getUser(user.email);
    if (existinguser) {
        throw new HttpError(400, "User with email already exist");
    }
    if (!user.role) {
        user.role = "readonly";
    }
    var salt = yield bcrypt.genSalt(10);
    var passwordHash = yield bcrypt.hash(user.password, salt);
    user.passwordHash = passwordHash;
    delete user.password;

    var user = yield userDAO.createUser(user);

    if (!user) {
        throw new HttpError(400, "Bad request");
    }
    return user;
}

module.exports.getUser = function* (email) {
    return yield userDAO.getUser(email);
}

module.exports.getProfileManager = function* (familyCustomerId) {
    var profileManagers = yield userDAO.getUsersByFamilyCustomerId(familyCustomerId);
    return profileManagers.map(mgr => ({
        familyCustomerId: mgr.familyCustomerId,
        name: mgr.name,
        relationship: mgr.relationship,
        role: mgr.role,
        email: mgr.email
    }));
}

module.exports.addProfileManager = function* (familyCustomerId, mgr) {
    module.exports.user = {
        email: mgr.email,
        familyCustomerId: mgr.familyCustomerId,
        relation: mgr.relation
    };
    yield addUser(user);
}

module.exports.createAdmin = function* (admin, institutionShortCode) {
    admin.institutionShortCode = institutionShortCode;
    admin.role = "admin";
    admin.schoolCode = "secureslice";
    admin.familyCustomerId = "secureslice";
    yield addUser(admin);
}

module.exports.createSuperAdmin = function* (admin) {
    admin.role = "superadmin";
    admin.institutionShortCode = "superadmin";
    admin.schoolCode = "superadmin";
    admin.familyCustomerId = "superadmin";
    yield addUser(admin);
}

module.exports.createTeacher = function* (user, institutionShortCode, schoolCode) {
    user.role = "teacher";
    user.institutionShortCode = institutionShortCode;
    user.schoolCode = schoolCode;
    user.familyCustomerId = "teacher";
    yield addUser(admin);
}

module.exports.createStaff = function* (user, institutionShortCode, schoolCode) {
    user.role = "staff";
    user.institutionShortCode = institutionShortCode;
    user.schoolCode = schoolCode;
    user.familyCustomerId = "staff";
    yield addUser(admin);
}

module.exports.getStaffBySchoolCode = function* (schoolCode) {
    return yield userDAO.getUsersBySchoolCodeAndRole(schoolCode, "staff");
}

module.exports.getParentsBySchoolCode = function* (schoolCode) {
    return yield userDAO.getUsersBySchoolCodeAndRole(schoolCode, "parent");
}

module.exports.getAdminByInstitutionCode = function* (institutionShortCode) {
    return yield userDAO.getUsersByInstitutionCodeAndRole(institutionShortCode, "admin");
}

module.exports.updateUser = function* (user) {
    return yield userDAO.updateUser(user);
}

module.exports.findByEmails = function* (parentEmails) {
    var parentEmailsSet = [] ;
    new Set(parentEmails).forEach(el => parentEmailsSet.push(el));
    return yield userDAO.getUsers(parentEmailsSet);
}
