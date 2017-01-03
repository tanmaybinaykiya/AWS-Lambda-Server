var bcrypt = require("co-bcryptjs");
var dao = require("./dao");
var HttpError = require("./errors").HttpError;
var validateAndGetUser = function* (email, password) {
    console.log("Email: ", email, password);
    var user = yield dao.getUser(email);
    if (!user) {
        throw new HttpError(401, "Invald username or password");
    }
    if (yield bcrypt.compare(password, user.get("passwordHash"))) {
        return user.toJSON();
    } else {
        throw new HttpError(401, "Invald username or password");
    }
}

var addUser = function* (user) {
    console.log("HI 1");
    var existinguser = yield dao.getUser(user.email);
    console.log("HI 2", existinguser);
    if (existinguser) {
        throw new HttpError(400, "User with email already exist");
    }
    console.log("HI 3");
    if (!user.role) {
        user.role = "readonly";
    }
    console.log("HI 4");
    var salt = yield bcrypt.genSalt(10);
    var passwordHash = yield bcrypt.hash(user.password, salt);
    user.passwordHash = passwordHash;
    delete user.password;
    console.log("HI 5");
    var user = yield dao.createUser(user);
    console.log("HI 6");
    if (!user) {
        throw new HttpError(400, "Bad request");
    }
    console.log("HI 7");
    return user;
}

var getUser = function* (email) {
    return yield dao.getUser(email);
}

module.exports = {
    validateAndGetUser,
    addUser,
    getUser
} 