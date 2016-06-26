var chargebee = require('chargebee');
chargebee.configure({
    site: process.env.chargebeeSite,
    api_key: process.env.chargebeeKey
});

function monthDiff(d1, d2) {
    var months;
    months = (d2.getFullYear() - d1.getFullYear()) * 12;
    months -= d1.getMonth() + 1;
    months += d2.getMonth();
    return months <= 0 ? 0 : months;
}
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

var createClassPlan = function (classCode, schoolCode, institutionCode, fees, feeType, startDate, endDate) {
    return new Promise(function (resolve, reject) {
        var planName = institutionCode + "_" + schoolCode + "_" + classCode;
        var plan = {
            id: planName,
            name: planName,
            invoice_name: "Tution fees for student in class " + classCode,
            charge_model: "flat_fee"
        };
        if (feeType === "monthly") {
            var numberOfMonths = monthDiff(new Date(startDate), new Date(endDate));
            plan.period = 1;
            plan.period_unit = "month";
            plan.price = Math.floor(num) * 100;
            plan.billing_cycles = numberOfMonths
        } else {
            plan.setup_cost = fees * 100;
            plan.billing_cycles = 1
        }
        chargebee.plan.create(plan).request(function (error, result) {
            if (error) {
                //handle error
                console.error(error);
                reject(error);
            } else {
                console.log(result);
                var plan = result.plan;
                resolve(plan);
            }
        });
    });
}

var createCustomer = function (user) {
    return new Promise(function (resolve, reject) {
        chargebee.customer.create({
            first_name: user.firstname,
            last_name: user.lastname,
            email: user.email,
            allow_direct_debit:true,
            billing_address: {
                first_name: user.firstname,
                last_name: user.lastname,
                line1: user.street,
                city: user.city,
                state: user.state,
                zip: user.zip,
                country: user.country
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

var createHostedPageURLCustomer = function (customerId) {
    return new Promise(function (resolve, reject) {
        chargebee.hosted_page.update_payment_method({
            customer: {
                id: customerId
            },
            iframe_messaging: true
        }).request(function (error, result) {
            if (error) {
                //handle error
                console.error(error);
                reject(error);
            } else {
                console.log(result);
                var hosted_page = result.hosted_page;
                resolve(hosted_page);
            }
        });
    });
}

var createSubscription = function (customerId, planId, startDate) {
    return new Promise(function (resolve, reject) {
        chargebee.subscription.create_for_customer(customerId, {
            plan_id: planId,
            start_date: Math.floor(startDate.getTime() / 1000)
        }).request(function (error, result) {
            if (error) {
                console.error(error);
                reject(error);
            } else {
                console.log(result);
                var subscription = result.subscription;
                resolve(subscription);
            }
        });
    });
}

var getInvoicesForCustomer = function (customerId, offset, limit) {
    return new Promise(function (resolve, reject) {
        if (!limit) {
            limit = 10;
        }
        var invoiceReq = {
            "limit": limit,
            "customer_id[is]": customerId,
            "sort_by[asc]": "date"
        }
        if (!offset) {
            invoiceReq.offset = offset;
        }
        chargebee.invoice.list(invoiceReq).request(function (error, result) {
            if (error) {
                console.error(error);
                reject(error);
            } else {
                var invoices = [];
                for (var i = 0; i < result.list.length; i++) {
                    var entry = result.list[i]
                    var invoice = entry.invoice;
                    invoices.push(invoice);
                }
                resolve({
                    invoices: invoices,
                    next_offset: result.next_offset
                });
            }
        });
    });
}

var getInvoicePdf = function (invoiceId) {
    return new Promise(function (resolve, reject) {
        chargebee.invoice.pdf(invoiceId).request(
            function (error, result) {
                if (error) {
                    console.error(error);
                    reject(error);
                } else {
                    console.log(result);
                    var download = result.download;
                    resolve(download);
                }
            });
    });
}

var collectPayment = function (invoiceId) {
    return new Promise(function (resolve, reject) {
        chargebee.invoice.collect_payment(invoiceId).request(
            function (error, result) {
                if (error) {
                    console.error(error);
                    reject(error);
                } else {
                    console.log(result);
                    var invoice = result.invoice;
                    var transaction = result.transaction;
                    resolve(transaction);
                }
            });
    });
}


module.exports = {
    createInstitutionCustomer,
    createClassPlan,
    createCustomer,
    createHostedPageURLCustomer,
    createSubscription,
    getInvoicesForCustomer,
    getInvoicePdf,
    collectPayment
} 