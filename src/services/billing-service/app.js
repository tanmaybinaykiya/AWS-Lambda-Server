var routerClass = require("koa-better-router");
var router = routerClass({ prefix: "/billing" }).loadMethods();
var superServer = require("../../common/app");

var service = require("./service");

var serverz = function () {

    var app;
    var self = this;

    self.init = function () {
        superz = new superServer();
        superz.init();
        superz.loadJWTDecryption();
        self.app = superz.getApp();
        self.routes(self.app, superz);
    }

    self.routes = function (app, superz) {
        router.post("/institution/:institutionCode/school/:schoolCode/paymentMethod", superz.roleBasedAuth(["parent"]), service.addPaymentMethodForParent);
        router.post("/paymentMethod", superz.roleBasedAuth(["parent"]), service.getPaymentMethodForParent);
        router.get("/institution/:institutionCode/school/:schoolCode/braintree/token", superz.roleBasedAuth(["parent"]),service.getBraintreeClientToken);
        router.post("/institution/:institutionCode/school/:schoolCode/braintree/credentials", superz.roleBasedAuth(["admin"]), service.updateBraintreeCredentials);
        app.use(router.legacyMiddleware());
    }


    self.getApp = function () {
        return self.app;
    }

};

var server = new serverz();
server.init();

exports.app = server.getApp();
