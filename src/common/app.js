var cors = require("koa-cors");
var koaBody = require("koa-body");
var jwt = require("koa-jwt");
var koa = require("koa");
var path = require("path");
var eventContext = require("./koa-proxy/middleware");
var HttpError = require("./lib/errors").HttpError;

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
        app.use(function* koaBody() {
            return koaBody();
        });
        app.use(cors());
        app.use(eventContext());
    }

    self.loadJWTDecryption = function () {
        // console.log("Function: ", jwt({ secret: process.env.JWT_SECRET, issuer: ISSUER, debug: true }));
        app.use(jwt({ secret: process.env.JWT_SECRET, issuer: ISSUER, debug: true }));
    }

    // self.decodeToken = function () {
    //     return function* (req, next) {
    //         console.log("decoding: ", req.header.authorization);
    //         jsonwebtoken.verify(req.header.authorization, { secret: process.env.JWT_SECRET, issuer: ISSUER }, function (err, decoded) {
    //             console.log("err:", err, "decoded:", decoded);
    //             yield next();
    //         });
    //     };
    // }

    self.roleBasedAuth = function (allowedRoles) {
        return function* (next) {
            var reqRole = this.state.user.role;
            // try {
            if (allowedRoles.findIndex(entry => entry === "SECS") < 0) {
                allowedRoles.push("SECS");
            }
            if (reqRole && allowedRoles.some(allowedRole => allowedRole === reqRole)) {
                console.log("NEXT: ", next);
                yield next;
            } else {
                console.log("Invalid role for API: ", reqRole, ". Allowed roles are: ", allowedRoles);
                this.throw(403);
            }
            // } catch (err) {
            //     console.log("Error occured in authz", err);
            //     this.throw(403);
            // }

        };
    }

    self.getApp = function () {
        return app;
    }
};
