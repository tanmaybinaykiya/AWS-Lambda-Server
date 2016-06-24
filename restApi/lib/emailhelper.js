var nodemailer = require("nodemailer");
var sgTransport = require("nodemailer-sendgrid-transport");
var jwt         = require("jsonwebtoken");
var util        = require("util");
var path        = require("path");
var options = {
    auth: {
        api_key: process.env.sendgridKey 
    }
}
var EmailTemplate = require("email-templates").EmailTemplate;
var transporter = nodemailer.createTransport(sgTransport(options));
var templateDir = path.join(__dirname, "./", "templates");
console.info("email templates Dir ", templateDir);
var sendJoinEmail = function (email,familyId, institutionId, role) {
    return new Promise(function(resolve,reject){
        var registerEmail = {
            "email":email,
            "familyId":familyId,
            "institutionCode":institutionCode,
            "role":role
        };
        var token = jwt.sign(registerEmail, process.env.jwtSecret,{ expiresIn: 60*60*48 });
        var registrationLink=util.format("%s/#/parent/register?token=%s", process.env.uihost, token);
        console.debug("registrationLink Link " + registrationLink);
        var registrationEmailTemplate = new EmailTemplate(templateDir + "/registration");
        registrationEmailTemplate.render({
            registrationLink: registrationLink
        },function (err, result) {
            console.info(result);
            
        });
        var registrationEmail = transporter.templateSender(registrationEmailTemplate , {
            from: "no-reply@secureslice.com"
        });
        verificationEmail({
            to: email,
            subject: "Parent Registration Invitation"
        }, {
            registrationLink: registrationLink,
            email: email
        }, function(err, info){
            if (err){
                console.error("Error sending email ", err);
                reject(err);
            }
            else {
                console.debug("Message sent: ", info);
                resolve(info);
            }
        });
    });
}


var sendAdminInviteEmail = function (email,institutionCode) {
    return new Promise(function(resolve,reject){
        var registerEmail = {
            "email":email,
            "institutionCode":institutionCode,
            "role":"admin"
        };
        var token = jwt.sign(registerEmail, process.env.jwtSecret,{ expiresIn: 60*60*48 });
        var registrationLink=util.format("%s/#/admin/register?token=%s", process.env.uihost, token);
        console.debug("registrationLink Link " + registrationLink);
        var registrationEmailTemplate = new EmailTemplate(templateDir + "/admininvite");
        registrationEmailTemplate.render({
            registrationLink: registrationLink,
            email: email,
        },function (err, result) {
            console.info(result);
            
        });
        var registrationEmail = transporter.templateSender(registrationEmailTemplate , {
            from: "no-reply@secureslice.com"
        });
        verificationEmail({
            to: email,
            subject: "Administrator Account Invitation"
        }, {
            registrationLink: registrationLink,
            email: email
        }, function(err, info){
            if (err){
                console.error("Error sending email ", err);
                reject(err);
            }
            else {
                console.debug("Message sent: ", info);
                resolve(info);
            }
        });
    });
}

module.exports = {
    sendJoinEmail,
    sendAdminInviteEmail
}