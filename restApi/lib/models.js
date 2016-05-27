var vogels=require("vogels");
var Joi=require("joi");
var getTableName=function(modelName) {
    return process.env.SERVERLESS_STAGE + "_" + modelName;
}
var Users = vogels.define('Users', {
    hashKey : 'email',
    timestamps : true,
    schema : {
        email   : Joi.string().email(),
        mobile     : Joi.number(),
        name    : Joi.string(),
        passwordHash     : Joi.string(),
        mobileVerified: Joi.boolean().default(false),
        mailVerified: Joi.boolean().default(false),
        institution: Joi.string(),
        role: Joi.string(),
        customerId: Joi.string(),
        relation: Joi.string(),
        familyAccess: Joi.string()
    },
    tableName: getTableName("Users"),
    indexes : [{
       hashKey : 'institution', rangeKey : 'role', name : 'UsersInstitutionIndex', type : 'global'
    },{
       hashKey : 'customerId',  name : 'UsersCustomerIndex', type : 'global'
    }]
});

module.exports={
    Users
}