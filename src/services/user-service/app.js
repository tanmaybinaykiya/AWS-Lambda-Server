var routerClass = require("koa-better-router");
var router = routerClass({ prefix: "/user" }).loadMethods();
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
        // TODO authz -> super admin invites admin
        router.post("/institution/:institutionCode/user/:role", superz.roleBasedAuth(["admin"]), service.createUser);

        //TODO validate iss code
        router.post("/admin/register", superz.roleBasedAuth(["registerAdmin"]), service.registerAdmin);
        
        // TODO validate issCode and schoolCode
        router.post("/parent/register", superz.roleBasedAuth(["registerParent"]), service.registerParent);

        router.post("/contact/generateVerificationCode", superz.roleBasedAuth(["registerAdmin", "registerParent"]), service.generateVerificationCode);
        // router.post("/contact/verify", superz.roleBasedAuth(["registerAdmin", "registerParent"]), service.verifyUser);
        app.use(router.legacyMiddleware());
    }

    self.getApp = function () {
        return self.app;
    }

};

var server = new serverz();
server.init();

exports.app = server.getApp();
