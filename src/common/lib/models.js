var dynogels=require("dynogels");
var Joi=require("joi");
var getTableName=function(modelName) {
    return process.env.SERVERLESS_STAGE + "_" + modelName;
}
var Users = dynogels.define('Users', {
    hashKey : 'email',
    timestamps : true,
    schema : {
        email   : Joi.string().email().required(),
        mobile     : Joi.number().required(),
        firstname    : Joi.string().required(),
        lastname    : Joi.string().required(),
        street    : Joi.string(),
        city    : Joi.string(),
        state    : Joi.string(),
        zip    : Joi.number(),
        passwordHash     : Joi.string(),
        mobileVerified: Joi.boolean().default(false),
        mailVerified: Joi.boolean().default(false),
        institutionShortCode: Joi.string(),
        role: Joi.string().required(),
        familyCustomerId: Joi.string(),
        relation: Joi.string(),
        familyAccess: Joi.string()
    },
    tableName: getTableName("Users"),
    indexes : [{
       hashKey : 'institutionShortCode', rangeKey : 'role', name : 'UsersInstitutionIndex', type : 'global'
    },{
       hashKey : 'familyCustomerId',  name : 'UsersCustomerIndex', type : 'global'
    }]
});

var Institution = dynogels.define('Institution', {
    hashKey : 'shortCode',
    timestamps : true,
    schema : {
        shortCode   : Joi.string().required(),
        customerId     : Joi.string().required(),
        name    : Joi.string().required(),
        adminemail: Joi.string().email().required(),
        addressline1: Joi.string().required(),
        city: Joi.string().required(),
        state: Joi.string().required(),
        zip: Joi.number().required(),
        country: Joi.string().required(),
        billing:{
            chargePerAccount:{
                planId:Joi.string(),
                subscriptionId:Joi.string()
            },
            chargePerTransaction:{
                planId:Joi.string(),
                subscriptionId:Joi.string()
            },
            chargePerSms:{
                planId:Joi.string(),
                subscriptionId:Joi.string()
            }
        }
    },
    tableName: getTableName("Institution")
});

var School = dynogels.define('School', {
    hashKey : 'institutionShortCode',
    rangeKey : "code",
    timestamps : true,
    schema : {
        name   : Joi.string().required(),
        code     : Joi.string().required(),
        institutionShortCode: Joi.string().required()
    },
    tableName: getTableName("School"),
    indexes : [{
       hashKey : 'name', name : 'SchoolNameIndex', type : 'global'
    }]
});

var Class = dynogels.define('Class', {
    hashKey : 'schoolCode',
    rangeKey : "code",
    timestamps : true,
    schema : {
        schoolCode  : Joi.string().required(),
        code     : Joi.string().required(),
        institutionShortCode     : Joi.string().required(),
        teacherId: dynogels.types.stringSet(),
        startDate:  Joi.date().required(),
        endDate:  Joi.date().required(),
        fees:  Joi.number().required(),
        feeType:  Joi.string().required(),
        fullCapacity:  Joi.number().required(),
        currentUsage:  Joi.number().default(0),
        planId:  Joi.string().required()
    },
    tableName: getTableName("Class"),
    indexes : [{
       hashKey : 'institutionShortCode', name : 'ClassInstitutionIndex', type : 'global'
    },{
       hashKey : 'planId',  name : 'ClassPlanIndex', type : 'global'
    }]
});
//   var family ={
//     institutionId:"",
//     paymentMethods:[
//       {"gatewayId":"",isDefault:true,type:"" , status:"",accountNumber:""}
//     ],
//     notifications:[""],
//     customerId:"",//hash key
//   }
var Family = dynogels.define('Family', {
    hashKey : 'customerId',
    timestamps : true,
    schema : {
        customerId   : Joi.string().required(),
        institutionShortCode     : Joi.string().required()
    },
    tableName: getTableName("Family"),
    indexes : [{
       hashKey : 'institutionShortCode', name : 'FamilyInstitutionIndex', type : 'global'
    }]
});

//   var student={
//     name:"",
//     clazzId:"",//This will be null when in requested, and added as admin selects a class in EnrollmentInfo, //GSI - to get all students in a class
//     status:"",//requested, waiting, denied, approved 
//     institutionId:"",//GSI - to get all students in a institution
//     forms:[],//s3 file ids,
//     customerId:"",//GSI - to get all students in a family
//     lastPaymentStatus:"",//If last payment failed or succeeded
//     subscriptionId:""//Hash key 
//   }
//   var studentBillingInfo={
//     institutionId:"",//Hash key
//     subscriptionId:"",//GSI to get all bills by student
//     totalAmount:"",
//     transactionId:"",//Range key
//     transactionStatus:"",
//     customerId:"",//GSI to get all bills for a family
//     invoice:"",
//     fees:"",
//     actualPaymentProcessingFee:"",
//     paymentProcessingFee:"",
//     date:""//GSI to get all bills in a date range
//   } 
//   //Used for billing
//   var smsInfo={
//     smsId:"",//Range key
//     date:"",//GSI to get sms in a date range
//     type:"",//notification, verification etc.
//     userId:"",//Sent to whom?
//     institutionId:""//Hash key
//   }
module.exports={
    Users,
    Institution,
    School,
    Class,
    Family
}

//For School
//Family - Customer , Subscription  
//Class --> Plan
//Student --> Quantity

//For SS
//Institution --> Customer, Subscription
//Student --> Quantity
//SMS --> Quantity
//