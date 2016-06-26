var jwt = require('jsonwebtoken');
var HttpError=require("./errors").HttpError;
var getToken = function (authHeader) {
    if (!authHeader) {
        return null;
    }
    var parts = authHeader.split(' ');
    if (2 > parts.length) return null;
    var schema = parts.shift().toLowerCase();
    var token = parts.join(' ');
    if ('bearer' != schema) return null;
    return token;
}

var ssAdminSecurity = function (authHeader) {
    return function* (ctx){
        var token = getToken(authHeader);   
        if(!token){
            throw new HttpError(401 , "Authorization header not passed");
        } 
        try{
            var decoded = jwt.verify(token, process.env.jwtSecret);
            if(decoded.role !== "superadmin"){
                throw new HttpError(401 , "UnAuthorized");
            }
            ctx.user=decoded;    
        }catch(err){
            console.error(err);
            throw new HttpError(401 , "UnAuthorized");
        }
        
    }
}

var adminSecurity = function (authHeader) {
    return function* (ctx){
        var token = getToken(authHeader);   
        if(!token){
            throw new HttpError(401 , "Authorization header not passed");
        } 
        try{
            var decoded = jwt.verify(token, process.env.jwtSecret);
            if(decoded.role !== "admin"){
                throw new HttpError(401 , "UnAuthorized");
            }
            ctx.user=decoded;    
        }catch(err){
            console.error(err);
            throw new HttpError(401 , "UnAuthorized");
        }
        
    }
}


var internalSecurity = function (authHeader) {
    return function* (ctx){
        var token = getToken(authHeader);  
        console.log(token,process.env.jwtSecret); 
        if(!token){
            throw new HttpError(401 , "Authorization header not passed");
        } 
        try{
            var decoded = jwt.verify(token, process.env.jwtSecret);
            if(decoded.role !== "internal"){
                throw new HttpError(401 , "UnAuthorized");
            }
            ctx.user=decoded;    
        }catch(err){
            console.error(err);
            throw new HttpError(401 , "UnAuthorized");
        }
        
    }
}

var validTokenSecurity = function (authHeader) {
    return function* (ctx){
        var token = getToken(authHeader);  
        console.log(token,process.env.jwtSecret); 
        if(!token){
            throw new HttpError(401 , "Authorization header not passed");
        } 
        try{
            var decoded = jwt.verify(token, process.env.jwtSecret);
            ctx.user=decoded;    
        }catch(err){
            console.error(err);
            throw new HttpError(401 , "UnAuthorized");
        }
        
    }
}
module.exports = {
    ssAdminSecurity,
    internalSecurity,
    validTokenSecurity,
    adminSecurity
} 