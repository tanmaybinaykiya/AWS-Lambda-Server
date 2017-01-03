var cors = require("koa-cors");
var koaBody = require("koa-body");
var jwt = require("koa-jwt");
var koa = require("koa");
var path = require("path");
var eventContext = require("./koa-proxy/middleware");
var HttpError = require("./lib/errors").HttpError;

var ISSUER = "secs";

module.exports = function () {
    var self = this;
    var app = new koa();
    var routeMap;

    self.init = function () {
        console.log("Configuring server....", app);

        // x-response-time
        app.use(function* (next) {
            var start = new Date().getTime();
            yield next;
            var ms = new Date().getTime() - start;
            this.set("X-Response-Time", ms + "ms");
        });

        // logger
        app.use(function* (next) {
            console.log("Request Start: %s %s", this.method, this.url);
            var start = new Date().getTime();
            yield next;
            var ms = new Date().getTime() - start;
            console.log("Request End: %s %s %d - %s ms", this.method, this.url, this.status, ms);
        });

        app.use(function* (next) {
            try {
                yield next;
            } catch (err) {
                if (err instanceof HttpError) {
                    this.status = err.status;
                    this.body = err.message;
                } else {
                    this.status = err.statusCode || 500;
                    this.body = err.responseBody || "Unexpected Server error";
                    this.app.emit("error", err, this);
                }
            }
        });

        app.on("error", function (err) {
            console.log("server error", err);
        });
        app.use(koaBody());
        app.use(cors());
        app.use(eventContext());
    }

    self.loadJWTDecryption = function () {
        app.use(jwt({ secret: process.env.JWT_SECRET, issuer: ISSUER }));
    }

    self.decodeToken = function () {
        return jwt({ secret: process.env.JWT_SECRET, issuer: ISSUER });
    }

    self.roleBasedAuth = function (allowedRoles) {
        return function* (next) {
            if (allowedRoles.findIndex(entry => entry === "INTERNAL") < 0) {
                allowedRoles.push("INTERNAL");
            }
            if (this.state.user.role && allowedRoles.some(allowedRole => allowedRole === this.state.user.role)) {
                yield next;
            } else {
                console.log("Invalid role for API: ", this.state.user.role, ". Allowed roles are: ", allowedRoles);
                this.throw(403);
            }
        };
    }

    self.getApp = function () {
        console.log("RETURNING, ", self.app, app)
        return app;
    }
};
