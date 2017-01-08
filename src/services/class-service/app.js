var routerClass = require("koa-better-router");
var router = routerClass().loadMethods();
var restAPI = routerClass({ prefix: "/class" });
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
        router.get("/", superz.roleBasedAuth(["admin"]), service.getClasses);
        router.post("/", superz.roleBasedAuth(["admin"]), service.createClass);
        restAPI.extend(router);
        app.use(function* restAPILegacyMiddleware() {
            return restAPI.legacyMiddleware();
        });
    }

    self.getApp = function () {
        return self.app;
    }

};

var server = new serverz();
server.init();

exports.app = server.getApp();
