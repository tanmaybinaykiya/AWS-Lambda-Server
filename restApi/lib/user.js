var bcrypt      = require("co-bcryptjs");
var dao      = require("./dao");
var validateAndGetUser = function (email, password) {
    var user = yield dao.getUser(email);
    if(!user){
        throw new Error({status:401,message:"Invald username or password"});
    }
    if (yield bcrypt.compare(password, user.get("passwordHash"))) {
        return user;
    }else{
        throw new Error({status:401,message:"Invald username or password"});
    } 
}

var addUser = function (user) {
    var user = yield dao.getUser(user.email);
    if(user){
         throw new Error({status:400,message:"User with email already exist"});
    }
    user.role="readonly";
    var salt = yield bcrypt.genSalt(10);
    var passwordHash = yield bcrypt.hash(user.password, salt);
    user.passwordHash=passwordHash;
    delete user.password;
    var user = yield dao.createUser(user);
    if(!user){
        throw new Error({status:400,message:"Bad request"});
    }
    return user;
}

module.exports = {
    validateAndGetUser,
    addUser
} 