var bcrypt = require("co-bcryptjs");
var dao = require("./dao");
var HttpError=require("./errors").HttpError;
var validateAndGetUser = function* (email, password) {
    console.log(" getting user for  :: ", email);
    var user = yield dao.getUser(email);
    console.log(" user :: ", user);
    if (!user) {
        throw new HttpError(401 , "Invald username or password" );
    }
    if (yield bcrypt.compare(password, user.get("passwordHash"))) {
        return user;
    } else {
        throw new HttpError(401 , "Invald username or password" );
    }
}

var addUser = function* (user) {
    var user = yield dao.getUser(user.email);
    if (user) {
        throw new HttpError(400 , "User with email already exist" );
    }
    user.role = "readonly";
    var salt = yield bcrypt.genSalt(10);
    var passwordHash = yield bcrypt.hash(user.password, salt);
    user.passwordHash = passwordHash;
    delete user.password;
    var user = yield dao.createUser(user);
    if (!user) {
        throw new HttpError(400 , "Bad request" );
    }
    return user;
}

module.exports = {
    validateAndGetUser,
    addUser
} 