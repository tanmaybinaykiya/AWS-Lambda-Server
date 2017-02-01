var jwt = require('jsonwebtoken');
process.env.JWT_SECRET = "12345678";

var tokenObj = {"role":"SECS",};


console.log(jwt.sign(tokenObj, process.env.JWT_SECRET, { expiresIn: "1d", issuer:"https://www.secureslice.com/issuer" }));