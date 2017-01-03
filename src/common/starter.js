var koa = require('koa');
var koaProxy = require('koa-proxy');

var server;

var Starter = function(){
    var proxy: Proxy;

    function init(callback, serviceName) {
        proxy = new koaProxy(serviceName);
        server = Starter.proxy.createServer(callback(), null);
        proxy.startServer(server);
    }

    function handle(event: any, context: any) {
        if (event.headers) {
            proxy.proxy(server, event, context, null);
        } else {
            context.succeed();
        }
    }
}

module.exports = new Starter();