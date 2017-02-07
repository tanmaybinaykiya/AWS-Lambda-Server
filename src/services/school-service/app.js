var routerClass = require("koa-better-router");
var router = routerClass({ prefix: "/school" }).loadMethods();
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
        // TODO change authz to superadmin
        // TODO add authz for path param institutionCode and admin token scope match
        
        router.get("/institution/:institutionCode/school", superz.roleBasedAuth(["admin"]), service.getSchoolsByInstitution);
        router.get("/institution/:institutionCode/school/:schoolCode", superz.roleBasedAuth(["parent"]), service.getSchoolsByInstitutionAndSchoolCode);
        router.post("/institution/:institutionCode/school", superz.roleBasedAuth(["admin"]), service.createSchool);

        router.get("/institution/:institutionCode/school/:schoolCode/grade", superz.roleBasedAuth(["admin"]), service.getGrades);
        router.post("/institution/:institutionCode/school/:schoolCode/grade", superz.roleBasedAuth(["admin"]), service.createGrades);

        router.get("/institution/:institutionCode/school/:schoolCode/grade/:gradeName/class", superz.roleBasedAuth(["admin"]), service.getClasses);
        router.get("/institution/:institutionCode/school/:schoolCode/grade/:gradeName/class/:name", superz.roleBasedAuth(["admin"]), service.getClasses);
        router.post("/institution/:institutionCode/school/:schoolCode/grade/:gradeName/class", superz.roleBasedAuth(["admin"]), service.createClass);

        app.use(router.legacyMiddleware());
    }

    self.getApp = function () {
        return self.app;
    }

};

var server = new serverz();
server.init();

exports.app = server.getApp();
