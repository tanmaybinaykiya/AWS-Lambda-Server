var nexmo = require('easynexmo');
nexmo.initialize(process.env.nexmoKey, process.env.nexmoSecret, true);

var sendOTP = function (number) {
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

var verifyOTP = function (requestId, code) {
    console.info("Verifying OTP for ", number);
    return new Promise(function (resolve, requestId) {
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

module.exports = {
    sendOTP
}
