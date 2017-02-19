var jwt = require('jsonwebtoken');
process.env.JWT_SECRET = "12345678";

var tokenObj = { "role": "SECS" };
console.log("SECS", jwt.sign(tokenObj, process.env.JWT_SECRET, { expiresIn: "120d", issuer: "https://www.secureslice.com/issuer" }));

var tokenObj = {
    "role": "registerAdmin",
    "email": "tanmay@secureslice.com",
    "institutionCode": "USC"
};

console.log("registerAdmin", jwt.sign(tokenObj, process.env.JWT_SECRET, { expiresIn: "120d", issuer: "https://www.secureslice.com/issuer" }));

var tokenObj = {
    "role": "registerParent",
    "email": "tanmay+parent@gmail.com",
    "institutionCode": "USC",
    "schoolCode": "CSE"
};

console.log("registerParent", jwt.sign(tokenObj, process.env.JWT_SECRET, { expiresIn: "120d", issuer: "https://www.secureslice.com/issuer" }));
