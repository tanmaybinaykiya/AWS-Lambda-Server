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
        institutionId: Joi.string(),
        role: Joi.string(),
        customerId: Joi.string(),
        relation: Joi.string(),
        familyAccess: Joi.string()
    },
    tableName: getTableName("Users"),
    indexes : [{
       hashKey : 'institutionId', rangeKey : 'role', name : 'UsersInstitutionIndex', type : 'global'
    },{
       hashKey : 'customerId',  name : 'UsersCustomerIndex', type : 'global'
    }]
});

var Institution = vogels.define('Institution', {
    hashKey : 'shortCode',
    timestamps : true,
    schema : {
        shortCode   : Joi.string(),
        customerId     : Joi.string(),
        name    : Joi.string(),
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

var School = vogels.define('School', {
    hashKey : 'institutionId',
    rangeKey : "code",
    timestamps : true,
    schema : {
        name   : Joi.string(),
        code     : Joi.string(),
        institutionId: vogels.types.uuid(),
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
    tableName: getTableName("School")
});

var Class = vogels.define('Class', {
    hashKey : 'schoolId',
    rangeKey : "code",
    timestamps : true,
    schema : {
        schoolId   : Joi.string(),
        code     : Joi.string(),
        institutionId     : Joi.string(),
        teacherId: vogels.types.stringSet(),
        startDate:  Joi.date(),
        endDate:  Joi.date(),
        fees:  Joi.number(),
        feeType:  Joi.string(),
        fullCapacity:  Joi.number(),
        currentUsage:  Joi.number(),
        planId:  Joi.string()
    },
    tableName: getTableName("Class"),
    indexes : [{
       hashKey : 'institutionId', name : 'ClassInstitutionIndex', type : 'global'
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
    Class
}