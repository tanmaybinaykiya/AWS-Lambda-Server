var nexmo = require('nexmo');
nexmo.initialize(process.env.NEXMO_KEY + "DUMMY", process.env.NEXMO_SECRET + "DUMMY", true);

module.exports.sendOTP = function (number) {
    console.info("Sending Verification OTP to ", number);
    return new Promise(function (resolve, reject) {
        nexmo.verifyNumber({ number: number, brand: "SecureSlice Schools" }, function (error, response) {
            if (error) {
                console.error("Verification OTP response error ", error);
                reject(error);
            } else {
                console.info("Verification OTP response ", response);
                resolve(response.request_id);
            }
        });
    });
}

module.exports.verifyOTP = function (requestId, code) {
    console.info("Verifying OTP for ", number);
    return new Promise(function (resolve, reject) {
        nexmo.verifyCheck({ request_id: requestId, code: code }, function (error, response) {
            if (error) {
                console.error("Verification OTP response error ", error);
                reject(error);
            } else {
                console.info("Verification OTP response ", response);
                resolve(response.request_id);
            }
        });
    });
}

module.exports.sendNotification = function (number, message) {
    console.info("Sending notification to", number, " message: ", message);
    return new Promise(function (resolve, reject) {
        nexmo.sendTextMessage(sender, recipient, message, opts, function (err, res) {
            if (err) {
                console.error("Error sending notification", err);
                reject(err);
            } else {
                console.log("Notification successful: ", res);
                resolve(res);
            }
        });
    });
}
