var cors = require("koa-cors");
var koaBody = require("koa-body");
var jwt = require("koa-jwt");
var koa = require("koa");
var path = require("path");
var eventContext = require("./koa-proxy/middleware");
var HttpError = require("./lib/errors").HttpError;
var util = require("util");

var ISSUER = "https://www.secureslice.com/issuer";

module.exports = function () {
    var self = this;
    var app = new koa();
    var routeMap;

    self.init = function () {
        console.log("Configuring server....", app);

        // x-response-time
        app.use(function* responseTimeHeader(next) {
            var start = new Date().getTime();
            yield next;
            var ms = new Date().getTime() - start;
            this.set("X-Response-Time", ms + "ms");
        });

        // logger
        app.use(function* responseTimeComputer(next) {
            console.log("Request Start: %s %s", this.method, this.url);
            var start = new Date().getTime();
            yield next;
            var ms = new Date().getTime() - start;
            console.log("Request End: %s %s %d - %s ms", this.method, this.url, this.status, ms);
        });

        app.use(function* errorHandler(next) {
            try {
                yield next;
            } catch (err) {
                if (err instanceof HttpError) {
                    this.status = err.status;
                    this.body = err.message;
                } else if (err.statusCode === 401) {
                    console.log("Error: ", err);
                    this.status = err.statusCode;
                    this.body = { error: "Authentication Error" }
                } else if (err.statusCode === 403) {
                    this.status = err.statusCode;
                    this.body = { error: "Authorization Error" }
                } else {
                    this.status = err.statusCode || 500;
                    this.body = err.responseBody || { error: "Unexpected Server error" };
                    this.app.emit("error", err, this);
                }
            }
        });

        app.on("error", function (err) {
            console.log("Unhandled Server error", err);
        });
        app.use(koaBody());
        app.use(cors());
        app.use(eventContext());
    }

    self.loadJWTDecryption = function () {
        app.use(jwt({ secret: process.env.JWT_SECRET, issuer: ISSUER, debug: true }));
    }

    self.roleBasedAuth = function (allowedRoles) {
        if (!allowedRoles) allowedRoles = [];
        if (allowedRoles.findIndex(entry => entry === "SECS") < 0) {
            allowedRoles.push("SECS");
        }
        return function* (next) {
            if (this.state && this.state.user && this.state.user.role) {
                var reqRole = this.state.user.role;
                if (reqRole && allowedRoles.some(allowedRole => allowedRole === reqRole)) {
                    console.log("NEXT: ", next);
                    yield next;
                } else {
                    console.log("Invalid role for API: ", reqRole, ". Allowed roles are: ", allowedRoles);
                    this.throw(403);
                }
            } else {
                console.log("No role in token, that's weird!");
                this.throw(403);
            }
        };
    }

    self.getApp = function () {
        return app;
    }
};
