var braintree = require("braintree");

var BRAINTREE_MERCHANTID = "5k52p2nbs8p5zcch";
var BRAINTREE_PUBLICKEY = "k5bqd6zp5ngjdfw9";
var BRAINTREE_PRIVATEKEY = "7794ed9d8f0375fb0ddd44d92270d20a";

var PLAN_ID = "htmb";
var someToken = "k55gg4";

var gateway = braintree.connect({
    environment: braintree.Environment.Sandbox,
    merchantId: BRAINTREE_MERCHANTID,
    publicKey: BRAINTREE_PUBLICKEY,
    privateKey: BRAINTREE_PRIVATEKEY,
});
gateway.config.timeout = 10000;

gateway.subscription.create({
    paymentMethodToken: someToken,
    planId: PLAN_ID,
    price: "499.99"
}, function (err, result) {
    console.log(err, JSON.stringify(result));
});
