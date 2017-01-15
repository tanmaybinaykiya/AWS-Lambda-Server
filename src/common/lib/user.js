var bcrypt = require("co-bcryptjs");
var dao = require("./dao");
var HttpError = require("./errors").HttpError;

var validateAndGetUser = function* (email, password) {
    var user = yield dao.getUser(email);
    if (!user) {
        throw new HttpError(401, "Invald username or password");
    }
    if (yield bcrypt.compare(password, user.get("passwordHash"))) {
        return user.toJSON();
    } else {
        throw new HttpError(401, "Invalid username or password");
    }
}

var addUser = function* (user) {
    var existinguser = yield dao.getUser(user.email);
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

    var user = yield dao.createUser(user);

    if (!user) {
        throw new HttpError(400, "Bad request");
    }
    return user;
}

var getUser = function* (email) {
    return yield dao.getUser(email);
}

var getProfileManager = function* (familyCustomerId) {
    var profileManagers = yield dao.getUsersByFamilyCustomerId(familyCustomerId);
    return profileManagers.map(mgr => ({
        familyCustomerId: mgr.familyCustomerId,
        name: mgr.name,
        relationship: mgr.relationship,
        role: mgr.role,
        email: mgr.email
    }));
}

var addProfileManager = function* (familyCustomerId, mgr) {
    var user = {
        email: mgr.email,
        familyCustomerId: mgr.familyCustomerId,
        relation: mgr.relation
    };
    yield addUser(user);
}

var createAdmin = function* (admin, institutionShortCode) {
    admin.institutionShortCode = institutionShortCode;
    admin.role = "admin";
    admin.schoolCode = "secureslice";
    admin.familyCustomerId = "secureslice";
    yield addUser(admin);
}

var createSuperAdmin = function* (admin) {
    admin.role = "superadmin";
    admin.institutionShortCode = "superadmin";
    admin.schoolCode = "superadmin";
    admin.familyCustomerId = "superadmin";
    yield addUser(admin);
}

var createTeacher = function* (user, institutionShortCode, schoolCode) {
    user.role = "teacher";
    user.institutionShortCode = institutionShortCode;
    user.schoolCode = schoolCode;
    user.familyCustomerId = "teacher";
    yield addUser(admin);
}

var createStaff = function* (user, institutionShortCode, schoolCode) {
    user.role = "staff";
    user.institutionShortCode = institutionShortCode;
    user.schoolCode = schoolCode;
    user.familyCustomerId = "staff";
    yield addUser(admin);
}

var getStaffBySchoolCode = function* (schoolCode) {
    return yield dao.getUsersBySchoolCodeAndRole(schoolCode, "staff");
}

var getParentsBySchoolCode = function* (schoolCode) {
    return yield dao.getUsersBySchoolCodeAndRole(schoolCode, "parent");
}

var getAdminByInstitutionCode = function* (institutionShortCode) {
    return yield dao.getUsersByInstitutionCodeAndRole(institutionShortCode, "admin");
}

module.exports = {
    validateAndGetUser,
    addUser,
    getUser,
    getProfileManager,
    addProfileManager,
    createAdmin,
    createSuperAdmin,
    createTeacher,
    createStaff,
    getStaffBySchoolCode,
    getParentsBySchoolCode,
    getAdminByInstitutionCode
}
