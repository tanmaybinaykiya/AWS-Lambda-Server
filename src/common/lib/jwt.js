var ISSUER = "https://www.secureslice.com/issuer";

module.exports.jwtOptions = {
    expiresIn: "1d", 
    issuer: ISSUER
};

module.exports.secret = process.env.JWT_SECRET;

module.exports.registrationOptions = {
    expiresIn: "30d", 
    issuer: ISSUER
};

module.exports.ISSUER = ISSUER;