var koa = require('koa');
var koaProxy = require('./koa-proxy/index');

var server;

module.exports.init = function (callback, serviceName) {
    server = koaProxy.createServer(serviceName, callback(), null);
    koaProxy.startServer(server);
}

module.exports.handle = function (event, context) {
    if (event.headers) {
        koaProxy.proxy(server, event, context, null);
    } else {
        context.succeed();
    }
}
