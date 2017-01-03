var bcrypt = require("co-bcryptjs");
var dao = require("./dao");
var HttpError=require("./errors").HttpError;
var validateAndGetUser = function* (email, password) {
    var user = yield dao.getUser(email);
    if (!user) {
        throw new HttpError(401 , "Invald username or password" );
    }
    if (yield bcrypt.compare(password, user.get("passwordHash"))) {
        return user.toJSON();
    } else {
        throw new HttpError(401 , "Invald username or password" );
    }
}

var addUser = function* (user) {
    var existinguser = yield dao.getUser(user.email);
    if (existinguser) {
        throw new HttpError(400 , "User with email already exist" );
    }
    if(!user.role){
        user.role = "readonly";    
    }
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

var getUser = function* (email) {
    return yield dao.getUser(email);
}

module.exports = {
    validateAndGetUser,
    addUser,
    getUser
} 