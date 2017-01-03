var routerClass = require("koa-better-router");
var router = routerClass().loadMethods();
var restAPI = routerClass({ prefix: "/users" });
var superServer = require("../../common/app");

var service = require("./service");

var serverz = function () {

    var app;
    var self = this;

    self.init = function () {
        console.log(superServer);
        superz = new superServer();
        superz.init();
        // superz.loadJWTDecryption();
        self.app = superz.getApp();
        self.routes(self.app, superz);
    }

    self.routes = function (app, superz) {
        console.log("CONFIGURING ROUTES: ", service.getToken);
        router.post("/token", /*superz.roleBasedAuth(["admin"]),*/ service.getToken);
        router.put("/", superz.decodeToken(), superz.roleBasedAuth(["admin"]), service.createUser);
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
