var routerClass = require("koa-better-router");
var router = routerClass({ prefix: "/school" }).loadMethods();
var superServer = require("../../common/app");

var schoolService = require("./schoolService");
var gradeService = require("./gradeService");
var classService = require("./classService");

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
        
        router.get("/institution/:institutionCode/school", superz.roleBasedAuth(["admin", "parent"]), schoolService.getSchoolsByInstitution);
        router.get("/institution/:institutionCode/school/:schoolCode", superz.roleBasedAuth(["parent"]), schoolService.getSchoolsByInstitutionAndSchoolCode);
        router.post("/institution/:institutionCode/school", superz.roleBasedAuth(["admin"]), schoolService.createSchool);

        router.get("/institution/:institutionCode/school/:schoolCode/grade", superz.roleBasedAuth(["admin"]), gradeService.getGrades);
        router.post("/institution/:institutionCode/school/:schoolCode/grade", superz.roleBasedAuth(["admin"]), gradeService.createGrade);

        router.get("/institution/:institutionCode/school/:schoolCode/grade/:gradeName/class", superz.roleBasedAuth(["admin"]), classService.getClassesByGrade);
        // router.get("/institution/:institutionCode/school/:schoolCode/grade/:gradeName/class/:name", superz.roleBasedAuth(["admin"]), classService.getClassByName);
        router.post("/institution/:institutionCode/school/:schoolCode/grade/:gradeName/class", superz.roleBasedAuth(["admin"]), classService.createClass);
        router.get("/institution/:institutionCode/school/:schoolCode/class", superz.roleBasedAuth(["admin"]), classService.getClassesBySchool);

        app.use(router.legacyMiddleware());
    }

    self.getApp = function () {
        return self.app;
    }

};

var server = new serverz();
server.init();

exports.app = server.getApp();
