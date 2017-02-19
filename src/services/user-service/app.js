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

        router.post("/institution/:institutionCode/school/:schoolCode/parent/invite", superz.roleBasedAuth(["admin"]), service.inviteParent);
        router.post("/institution/:institutionCode/admin/invite", superz.roleBasedAuth(["admin"]), service.inviteAdmin);

        router.post("/contact/generateVerificationCode", superz.roleBasedAuth(["registerAdmin", "registerParent"]), service.generateVerificationCode);
        // router.post("/contact/verify", superz.roleBasedAuth(["registerAdmin", "registerParent"]), service.verifyUser);

        // router.post("/nexmooo", service.sendNexmoMessage);
        app.use(router.legacyMiddleware());
    }

    self.getApp = function () {
        return self.app;
    }

};

var server = new serverz();
server.init();

exports.app = server.getApp();
