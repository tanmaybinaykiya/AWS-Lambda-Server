var nexmo = require('easynexmo');
nexmo.initialize(process.env.nexmoKey, process.env.nexmoSecret, false);
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
module.exports = {
    sendOTP
}
