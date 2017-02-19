var nodemailer = require("nodemailer");
var sgTransport = require("nodemailer-sendgrid-transport");
var jwt = require("jsonwebtoken");
var util = require("util");
var path = require("path");
var options = {
    auth: {
        api_key: process.env.SENDGRIDKEY
    }
}
var EmailTemplate = require("email-templates").EmailTemplate;
var transporter = nodemailer.createTransport(sgTransport(options));
var templateDir = path.join(__dirname, "./", "templates");

var jwtConfig = require("./jwt");

console.info("email templates Dir ", templateDir);

var parentRegistrationLinkFormat = "%s/#/register/parent?token=%s&institutionCode=%s&schoolCode=%s";
var adminRegistrationLinkFormat = "%s/#/register/admin?token=%s&institutionCode=%s";

module.exports.sendJoinEmail = function (email, familyId, institutionCode, role) {
    return new Promise(function (resolve, reject) {
        var registerEmailTokenScope = {
            "email": email,
            "familyId": familyId,
            "institutionCode": institutionCode,
            "role": role
        };
        var token = jwt.sign(registerEmailTokenScope, process.env.JWT_SECRET, { expiresIn: 60 * 60 * 24 * 7 });
        var registrationLink = util.format("%s/#/parent/register?token=%s", getDomain(institutionCode), token);
        console.debug("registrationLink Link " + registrationLink);
        var registrationEmailTemplate = new EmailTemplate(templateDir + "/registration");

        registrationEmailTemplate.render({
            registrationLink: registrationLink
        }, function (err, result) {
            console.info(result);

        });
        var registrationEmail = transporter.templateSender(registrationEmailTemplate, {
            from: "no-reply@secureslice.com"
        });
        verificationEmail({
            to: email,
            subject: "Parent Registration Invitation"
        }, {
                registrationLink: registrationLink,
                email: email
            }, function (err, info) {
                if (err) {
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

var getDomain = function () {
    switch (process.env.SERVERLESS_STAGE) {
        case "stage":
            return "https://app-beta.secureslice.com"
        case "prod":
            return "https://secureslice.com"
        default:
            return "http://localhost:8080"
    }
}

module.exports.sendAdminInviteEmail = function (email, institutionCode) {

    // TODO Fix this.
    return new Promise(function (resolve, reject) {
        var registerEmail = {
            "email": email,
            "institutionCode": institutionCode,
            "role": "admin"
        };
        var token = jwt.sign(registerEmail, process.env.JWT_SECRET, { expiresIn: 60 * 60 * 48 });
        var registrationLink = util.format("%s/#/admin/register?token=%s", getDomain(), token);
        console.debug("registrationLink Link " + registrationLink);
        var registrationEmailTemplate = new EmailTemplate(templateDir + "/admininvite");
        registrationEmailTemplate.render({
            registrationLink: registrationLink,
            email: email,
        }, function (err, result) {
            console.info(result);

        });
        var registrationEmail = transporter.templateSender(registrationEmailTemplate, {
            from: "no-reply@secureslice.com"
        });
        verificationEmail({
            to: email,
            subject: "Administrator Account Invitation"
        }, {
                registrationLink: registrationLink,
                email: email
            }, function (err, info) {
                if (err) {
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

function generateTemplate(templateVariables, templateLocation, emailId) {
    return new Promise(function (resolve, reject) {
        var registrationEmailTemplate = new EmailTemplate(templateLocation);
        registrationEmailTemplate.render(templateVariables, function (err, result) {
            if (err) {
                console.log("Error generating Template", err);
                reject(err);
            } else {
                console.log("generated Template", result, emailId);
                resolve({ email: emailId, template: result.html });
            }
        });
    });
}

function getRegisterAdminToken(emailId, institutionCode) {
    var tokenScope = {
        email: emailId,
        institutionCode: institutionCode,
        role: "registerAdmin"
    };
    return jwt.sign(tokenScope, jwtConfig.secret, jwtConfig.registrationOptions);
}

function getRegisterParentToken(emailId, institutionCode, schoolCode) {
    var tokenScope = {
        email: emailId,
        institutionCode: institutionCode,
        schoolCode: schoolCode,
        role: "registerParent"
    };
    return jwt.sign(tokenScope, jwtConfig.secret, jwtConfig.registrationOptions);
}

function sendInvite(result) {
    var emailId = result.email;
    var emailTemplate = result.template;
    console.log("sendInvite: ", emailId, emailTemplate);
    return new Promise(function (resolve, reject) {
        var email = {
            to: [emailId],
            from: 'no-reply@secureslice.com',
            subject: 'Invitation to register at SecureSlice',
            text: 'tb();',
            html: emailTemplate
        };
        transporter.sendMail(email, function (err, res) {
            if (err) {
                console.log(err);
                reject(err);
            }
            console.log(res);
            resolve(res);
        });

    });
}


module.exports.sendAdminInvite = function (emailId, institution) {
    console.log("sendAdminInvite: ", emailId, institution);
    return new Promise(function (resolve, reject) {
        var token = getRegisterAdminToken(emailId, institution.shortCode);
        var registrationLink = util.format(adminRegistrationLinkFormat, getDomain(), token, institution.shortCode);
        console.log("registrationLink Link " + registrationLink);
        var templateLocation = templateDir + "/registration/admin";
        var templateVariables = {
            registrationLink: registrationLink,
            institutionName: institution.name,
            email: emailId
        };
        generateTemplate(templateVariables, templateLocation, emailId)
            .then(sendInvite)
            .then((res) => {
                resolve(res);
            }).catch((err) => {
                reject(err);
            });
    });
}

module.exports.sendParentInvite = function (emailId, school) {
    console.log("sendParentInvite: ", emailId, school);
    return new Promise(function (resolve, reject) {
        var token = getRegisterAdminToken(emailId, school.institutionShortCode, school.code);
        var registrationLink = util.format(parentRegistrationLinkFormat, getDomain(), token, school.institutionShortCode, school.code);
        console.log("registrationLink Link " + registrationLink);
        var templateLocation = templateDir + "/registration/parent";
        var templateVariables = {
            registrationLink: registrationLink,
            schoolName: school.name
        };
        generateTemplate(templateVariables, templateLocation, emailId)
            .then(sendInvite)
            .then((res) => {
                resolve(res);
            }).catch((err) => {
                reject(err);
            });
    });
}
