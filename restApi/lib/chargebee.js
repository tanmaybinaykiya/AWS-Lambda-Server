var chargebee = require('chargebee');
chargebee.configure({
    site: process.env.chargebeeSite,
    api_key: process.env.chargebeeKey
});
var createInstitutionCustomer = function (institutionName, email, addressLine1, city, state, zip, country) {
    return new Promise(function (resolve, reject) {
        chargebee.customer.create({
            first_name: institutionName,
            email: email,
            billing_address: {
                first_name: institutionName,
                line1: addressLine1,
                city: city,
                state: state,
                zip: zip,
                country: country
            }
        }).request(function (error, result) {
            if (error) {
                reject(error);
            } else {
                console.log(result);
                var customer = result.customer;
                resolve(customer);
            }
        });
    });
}

module.exports = {
    createInstitutionCustomer
} 