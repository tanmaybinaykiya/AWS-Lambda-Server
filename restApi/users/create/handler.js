'use strict';
var AWS = require('aws-sdk');
// var db = new AWS.DynamoDB();
var vogels = require('vogels');
var Joi      = require('joi')

module.exports.handler = function(event, context, cb) {
  var institution={
    name:"",
    shortCode:"",//Hashkey
    customerId:"",
    billing:{
      chargePerAccount:{planId:"",subscriptionId:""},
      chargePerTransaction:{planId:"",subscriptionId:""},
      chargePerSms:{planId:"",subscriptionId:""},
    }
  }
  var user={
    email:"",//Hash key
    mobile:"",
    name:"",
    passwordHash:"",
    mobileVerified:false,
    mailVerified:false,
    institution:"", //Global Secondary Index hash key - to get all users in an institutions
    role:"",//parent, staff,admin,ssadmin //Range key in GSI-1  
    customerId:"", //GSI-2 - to get all users in a family
    relation:"",
    familyAccess:""
  }
  
  var school={
    name:"",
    code:"",//Range key
    address:"",
    institutionId:"",//Hash key
    semisterInDays:"",
    billOn:""//Monthly, firstDay, lastDay
  }
  var clazz={
    code:"",//Range key
    institutionId:"",//GSI to get all classes in an institution
    schoolId:"",//Hash key
    teacherId:"",
    startDate:"",
    endDate:"",
    fees:500,
    feeType:"",//Monthly, PerSemister, Yearly, oneTime
    fullCapacity:"",
    currentUsage:"",
    planId:"",//GSI to get all class by plan id
    planDetails:{
      
    }
  }
  var family ={
    institutionId:"",
    paymentMethods:[
      {"gatewayId":"",isDefault:true,type:"" , status:"",accountNumber:""}
    ],
    notifications:[""],
    customerId:"",//hash key
  }
  var student={
    name:"",
    clazzId:"",//This will be null when in requested, and added as admin selects a class in EnrollmentInfo, //GSI - to get all students in a class
    status:"",//requested, waiting, denied, approved 
    institutionId:"",//GSI - to get all students in a institution
    forms:[],//s3 file ids,
    customerId:"",//GSI - to get all students in a family
    lastPaymentStatus:"",//If last payment failed or succeeded
    subscriptionId:""//Hash key 
  }
  var studentBillingInfo={
    institutionId:"",//Hash key
    subscriptionId:"",//GSI to get all bills by student
    totalAmount:"",
    transactionId:"",//Range key
    transactionStatus:"",
    customerId:"",//GSI to get all bills for a family
    invoice:"",
    fees:"",
    actualPaymentProcessingFee:"",
    paymentProcessingFee:"",
    date:""//GSI to get all bills in a date range
  } 
  //Used for billing
  var smsInfo={
    smsId:"",//Range key
    date:"",//GSI to get sms in a date range
    type:"",//notification, verification etc.
    userId:"",//Sent to whom?
    institutionId:""//Hash key
  }
  if(process.env.SERVERLESS_STAGE === 'dev'){
    var opts = { endpoint : 'http://localhost:7777', apiVersion: '2012-08-10',region:"us-east-1" };
    vogels.dynamoDriver(new AWS.DynamoDB(opts));
  }
  
  var Account = vogels.define('Account', {
    hashKey : 'email',

    // add the timestamp attributes (updatedAt, createdAt)
    timestamps : true,

    schema : {
      email   : Joi.string().email(),
      name    : Joi.string(),
      age     : Joi.number(),
      roles   : vogels.types.stringSet(),
      settings : {
        nickname      : Joi.string(),
        acceptedTerms : Joi.boolean().default(false)
      }
    }
  });
  console.log("Stage :::: " + event);
  vogels.createTables(function(err) {
    if (err) {
      console.log('Error creating tables: ', err);
      cb(err);
    } else {
      console.log('Tables has been created');
      Account.create({email: 'foo@example.com', name: 'Foo Bar', age: 21}, function (err, acc) {
        cb(null,acc);
        console.log('created account in DynamoDB', acc.get('email'));
      });
      
    }
  });
};
