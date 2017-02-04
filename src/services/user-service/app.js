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
        router.post("/institution/:institutionCode/admin/register", superz.roleBasedAuth(["registerAdmin"]), service.registerAdmin);
        app.use(router.legacyMiddleware());
    }

    self.getApp = function () {
        return self.app;
    }

};

var server = new serverz();
server.init();

exports.app = server.getApp();
