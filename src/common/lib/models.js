var dynogels = require("dynogels");
var Joi = require("joi");
var constants = require("./constants");

var getTableName = function (modelName) {
    return process.env.SERVERLESS_STAGE + "_" + modelName;
}

var Student = dynogels.define("Students", {
    hashKey: 'studentId',
    timestamps: true,
    schema: {
        studentId: dynogels.types.uuid(),
        parentEmail: Joi.string().email().required(),
        institutionShortCode: Joi.string().required(),
        schoolCode: Joi.string().required(),
        firstName: Joi.string().required(),
        middleName: Joi.string(),
        lastName: Joi.string().required(),
        nickname: Joi.string(),
        dateOfBirth: Joi.date().required(),
        cityOfBirth: Joi.string(),
        countryOfBirth: Joi.string(),
        stateOfBirth: Joi.string(),
        zip: Joi.number(),
        race: Joi.string(),
        gender: Joi.string().required(),
        extraInfo: Joi.string(),
        paymentInfo: {
            paymentMethod: Joi.string(),
            paymentStatus: Joi.string().required()
        },
        documents: {
            medicalForm: Joi.string().required(),
            tuitionForm: Joi.string().required()
        },
        enrollmentInfo: {
            isEnrolled: Joi.boolean().default(false),
            pastClassesEnrolled: Joi.array(),
            classesEnrolled: Joi.array(),
        },
        paymentMethodId: Joi.string().required()
    },
    tableName: getTableName("Students"),
    indexes: [{
        hashKey: 'institutionShortCode', rangeKey: 'studentId', name: 'StudentsInstitutionIndex', type: 'global'
    }, {
        hashKey: 'schoolCode', rangeKey: 'studentId', name: 'StudentsSchoolRoleIndex', type: 'global'
    }, {
        hashKey: 'dateOfBirth', rangeKey: 'firstName', name: 'StudentsBirthDateNameIndex', type: 'global'
    }, {
        hashKey: 'parentEmail', rangeKey: 'studentId', name: 'StudentsParentEmailIndex', type: 'global'
    }]
});

var Users = dynogels.define('Users', {
    hashKey: 'email',
    timestamps: true,
    schema: {
        email: Joi.string().email().required(),
        mobile: Joi.number().required(),
        firstname: Joi.string().required(),
        lastname: Joi.string().required(),
        street: Joi.string(),
        city: Joi.string(),
        state: Joi.string(),
        zip: Joi.number(),
        passwordHash: Joi.string(),
        mobileVerified: Joi.boolean().default(false),
        mailVerified: Joi.boolean().default(false),
        institutionShortCode: Joi.string(),
        schoolCode: Joi.string(),
        role: Joi.string().required(),
        familyCustomerId: Joi.string(),
        relation: Joi.string(),
        familyAccess: Joi.string()
    },
    tableName: getTableName("Users"),
    indexes: [{
        hashKey: 'institutionShortCode', rangeKey: 'role', name: 'UsersInstitutionIndex', type: 'global'
    }, {
        hashKey: 'schoolCode', rangeKey: 'role', name: 'UsersSchoolRoleIndex', type: 'global'
    }, {
        hashKey: 'familyCustomerId', name: 'UsersFamilyIndex', type: 'global'
    }]
});

var PaymentMethod = dynogels.define('PaymentMethod', {
    hashKey: 'methodId',
    timestamps: true,
    schema: {
        methodId: dynogels.types.uuid(),
        parentEmail: Joi.string().required(),
        braintree:{
            token: Joi.string().required(),
            customerId: Joi.string().required(),
            creditCardMaskedNumber: Joi.string().required()
        },
        isDefault: Joi.boolean().required()
    },
    tableName: getTableName("PaymentMethod"),
    indexes: [{
        hashKey: 'parentEmail', rangeKey: 'methodId', name: 'ParentMethodIndex', type: 'global'
    }]
});

var Institution = dynogels.define('Institution', {
    hashKey: 'shortCode',
    timestamps: true,
    schema: {
        shortCode: Joi.string().required(),
        //customerId     : Joi.string().required(),
        name: Joi.string().required(),
        adminemail: Joi.string().email().required(),
        addressline1: Joi.string().required(),
        city: Joi.string().required(),
        state: Joi.string().required(),
        zip: Joi.number().required(),
        country: Joi.string().required(),
        billing: {
            chargePerAccount: {
                planId: Joi.string(),
                subscriptionId: Joi.string()
            },
            chargePerTransaction: {
                planId: Joi.string(),
                subscriptionId: Joi.string()
            },
            chargePerSms: {
                planId: Joi.string(),
                subscriptionId: Joi.string()
            }
        }
    },
    tableName: getTableName("Institution")
});

var School = dynogels.define('School', {
    hashKey: 'institutionShortCode',
    rangeKey: "code",
    timestamps: true,
    schema: {
        name: Joi.string().required(),
        code: Joi.string().required(),
        institutionShortCode: Joi.string().required(),
        braintreeConfig: {
            merchantId: Joi.string(),
            publicKey: Joi.string(),
            privateKey: Joi.string()
        }
    },
    tableName: getTableName("School"),
    indexes: [{
        hashKey: 'name', name: 'SchoolNameIndex', type: 'global'
    }]
});

var Grade = dynogels.define('Grade', {
    hashKey: 'institutionSchoolCode',
    rangeKey: 'name',
    timestamps: true,
    schema: {
        name: Joi.string().required(),
        //composite key of institutionCode and schoolCode
        institutionSchoolCode: Joi.string().required(),
        tuitionFee: Joi.number().required(),
        planId: Joi.string().required(),
        duration: {
            days: Joi.string().regex(/^[01]{7}$/).required(),
            from: Joi.date().required(),
            to: Joi.date().required(),
        },
        minimumAgeCriterion: {
            age: Joi.number().required(),
            validationDate: Joi.date().required(),
        }
    },
    tableName: getTableName("Grade")
});

var Class = dynogels.define('Class', {
    hashKey: 'institutionSchoolGradeCode',
    rangeKey: 'name',
    timestamps: true,
    schema: {
        //composite key of institutionCode, schoolCode and grade
        institutionSchoolGradeCode: Joi.string().required(),
        name: Joi.string().required(), //classId
        teacherId: dynogels.types.stringSet(),
        startDate: Joi.date().required(),
        endDate: Joi.date().required(),
        fees: Joi.number().required(),
        feeType: Joi.string(),
        fullCapacity: Joi.number().required(),
        currentUsage: Joi.number().default(0),

    },
    tableName: getTableName("Class"),
    indexes: [{
        hashKey: 'institutionSchoolCode', name: 'ClassInstitutionIndex', type: 'global'
    }]
});

// var BillingPlan = dynogels.define('BillingPlan', {
//     hashKey: 'planId',
//     timestamps: true,
//     schema: {
//         planId: dynogels.types.uuid(),
//         paymentSolution: Joi.string().required(),
//         sPlanId: Joi.string().required()
//     },
//     tableName: getTableName("BillingPlan"),
//     indexes: [{
//         hashKey: 'sPlanId', name: 'PaymentSolutionPlanId', type: 'global'
//     }]
// });


//   var family ={
//     institutionId:"",
//     paymentMethods:[
//       {"gatewayId":"",isDefault:true,type:"" , status:"",accountNumber:""}
//     ],
//     notifications:[""],
//     customerId:"",//hash key
//   }

// var Family = dynogels.define('Family', {
//     hashKey: 'customerId',
//     timestamps: true,
//     schema: {
//         customerId: Joi.string().required(),
//         institutionShortCode: Joi.string().required()
//     },
//     tableName: getTableName("Family"),
//     indexes: [{
//         hashKey: 'institutionShortCode', name: 'FamilyInstitutionIndex', type: 'global'
//     }]
// });

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
module.exports = {
    Users,
    Institution,
    School,
    Class,
    Student,
    PaymentMethod
    // Family
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