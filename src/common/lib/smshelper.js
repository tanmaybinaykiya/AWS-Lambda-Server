var Nexmo = require('nexmo');
var nexmo = new Nexmo(
    {
        apiKey: process.env.NEXMO_KEY,
        apiSecret: process.env.NEXMO_SECRET
    }, {
        debug: true
    });

module.exports.sendOTP = function (number) {
    console.info("Sending Verification OTP to ", number);
    return new Promise(function (resolve, reject) {
        nexmo.verify.request({
            number: number,
            brand: "SecureSlice"
        }, function (error, response) {
            if (error) {
                console.error("Verification OTP response error ", error);
                reject(error);
            } else if(response.status == 0) {
                console.info("Verification OTP response ", response);
                resolve(response.request_id);
            } else {
                console.info("Verification OTP response ", response);
                reject(response.error_text);
            }
        });
    });
}

module.exports.verifyOTP = function (requestId, code) {
    console.info("Verifying OTP for ", requestId);
    return new Promise(function (resolve, reject) {
        nexmo.verify.check({
            request_id: requestId,
            code: code
        }, function (error, response) {
            if (error) {
                console.error("Verification OTP response error ", error);
                reject(error);
            } else if(response.status == 0 ){
                console.info("Verification OTP response ", response);
                resolve(response.request_id);
            } else {
                console.info("Verification OTP response ", response);
                reject(response.error_text);
            }
        });
    });
}

module.exports.sendNotification = function (number, message) {
    console.info("Sending notification to", number, " message: ", message);
    return new Promise(function (resolve, reject) {
        nexmo.message.sendSms("SecureSlice", number, message, function (error, res) {
             if (error) {
                console.error("Error occured sendNotification error ", error);
                reject(error);
            } else if(response.status == 0 ){
                console.info("sendNotification successfull ", response);
                resolve(response.request_id);
            } else {
                console.info("sendNotification response ", response);
                reject(response.error_text);
            }
        });
    });
}
