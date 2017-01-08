var routerClass = require("koa-better-router");
var router = routerClass().loadMethods();
var restAPI = routerClass({ prefix: "/token" });
var superServer = require("../../common/app");

var service = require("./service");

var serverz = function () {

    var app;
    var self = this;

    self.init = function () {
        superz = new superServer();
        superz.init();
        self.app = superz.getApp();
        self.routes(self.app, superz);
    }

    self.routes = function (app, superz) {
        router.post("/", service.getToken);
        restAPI.extend(router);
        app.use(restAPI.legacyMiddleware());
    }

    self.getApp = function () {
        return self.app;
    }

};

var server = new serverz();
server.init();

exports.app = server.getApp();
