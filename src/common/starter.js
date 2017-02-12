"use strict";
const koaProxy = require("./koa-proxy/index");
var server;

console.log("ENVIRONMENT VARIABLES:", process.env);

class Starter {
    constructor(app, serviceName) {
        Starter.proxy = new koaProxy.Proxy(serviceName);
        server = Starter.proxy.createServer(app.callback(), null);
        Starter.proxy.startServer(server);
    }
    handle(event, context) {
        if (event.headers) {
            Starter.proxy.proxy(server, event, context, null);
        }
        else {
            context.succeed();
        }
    }
}
exports.Starter = Starter;
