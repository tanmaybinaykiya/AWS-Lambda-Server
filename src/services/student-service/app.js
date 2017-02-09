var routerClass = require("koa-better-router");
var router = routerClass({ prefix: "student" }).loadMethods();
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
        // TODO authz -> super admin creates admin ; admin token contains insticode and schoolCode; match that with path params
        router.get("/institution/:institutionCode/school/:schoolCode/", superz.roleBasedAuth(["admin", "parent"]), service.getStudents);
        router.post("/institution/:institutionCode/school/:schoolCode/", superz.roleBasedAuth(["parent"]), service.enrollStudent);
        router.post("/institution/:institutionCode/school/:schoolCode/student/status", superz.roleBasedAuth(["admin"]), service.updateStudentStatus);
        router.post("/institution/:institutionCode/school/:schoolCode/student/assign", superz.roleBasedAuth(["admin"]), service.updateStudentClass);
        app.use(router.legacyMiddleware());
    }

    self.getApp = function () {
        return self.app;
    }

};

var server = new serverz();
server.init();

exports.app = server.getApp();
