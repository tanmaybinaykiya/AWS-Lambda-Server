"use strict";
const http = require("http");

class Proxy {
    constructor(socketPathPrefix) {
        this.createServer = (requestListener, serverListenCallback) => {
            const server = http.createServer(requestListener);
            server._socketPathSuffix = 0;
            server.on("listening", () => {
                server._isListening = true;
                if (serverListenCallback) {
                    serverListenCallback();
                }
            });
            server.on("close", () => {
                server._isListening = false;
            })
                .on("error", (err) => {
                    if (err.code === "EADDRINUSE") {
                        console.warn(`EADDRINUSE ${this.getSocketPath(server._socketPathSuffix)} incrementing socketPathSuffix.`);
                        ++server._socketPathSuffix;
                        server.close(() => this.startServer(server));
                    }
                });
            return server;
        };
        this.proxy = (server, event, context, callback) => {
            if (server._isListening) {
                this.forwardRequestToNodeServer(server, event, context, callback);
            }
            else {
                this.startServer(server)
                    .on("listening", () => this.forwardRequestToNodeServer(server, event, context, callback));
            }
        };
        this.socketPathPrefix = socketPathPrefix || "server";
    }
    startServer(server) {
        let socPath = this.getSocketPath(server._socketPathSuffix);
        console.log("Listening on socket path " + socPath);
        return server.listen(socPath);
    }
    getSocketPath(socketPathSuffix) {
        return `/tmp/server-${this.socketPathPrefix}-${socketPathSuffix}.sock`;
    }
    removeStageFromPath(path) {
        if (path) {
            var pathParts = path.split("/");
            var index = pathParts.indexOf(process.env.SERVERLESS_STAGE);
            if (index < 0) {
                return path;
            }
            pathParts = pathParts.splice(index + 1, pathParts.length);
            return "/" + pathParts.join("/");
        }
        return path;
    }
    getPathWithQueryStringParams(event) {
        var transformedPath = this.removeStageFromPath(event.path);
        const queryStringKeys = Object.keys(event.queryStringParameters || {});
        if (queryStringKeys.length === 0) {
            return transformedPath;
        }
        ;
        const queryStringParams = queryStringKeys.map(queryStringKey => `${queryStringKey}=${event.queryStringParameters[queryStringKey]}`).join("&");
        return `${transformedPath}?${queryStringParams}`;
    }
    mapApiGatewayEventToHttpRequest(event, context, socketPath) {
        event.headers["x-apigateway-event"] = JSON.stringify(event);
        event.headers["x-apigateway-context"] = JSON.stringify(context);
        return {
            method: event.httpMethod,
            path: this.getPathWithQueryStringParams(event),
            headers: event.headers,
            socketPath: socketPath
        };
    }
    forwardResponseToApiGateway(server, response, context, callback) {
        let body = "";
        response.setEncoding("utf8")
            .on("data", (chunk) => body += chunk.toString("utf8"))
            .on("end", () => {
                const statusCode = response.statusCode;
                const headers = response.headers;
                Object.keys(headers)
                    .forEach(h => {
                        if (Array.isArray(headers[h])) {
                            headers[h] = headers[h].join(",");
                        }
                    });
                const successResponse = { statusCode, body, headers };
                if (callback) {
                    callback(successResponse);
                }
                else {
                    context.succeed(successResponse);
                }
            });
    }
    forwardConnectionErrorResponseToApiGateway(server, error, context, callback) {
        const errorResponse = {
            statusCode: 502,
            body: "",
            headers: {}
        };
        if (callback) {
            callback(errorResponse);
        }
        else {
            context.succeed(errorResponse);
        }
    }
    forwardRequestToNodeServer(server, event, context, callback) {
        const requestOptions = this.mapApiGatewayEventToHttpRequest(event, context, this.getSocketPath(server._socketPathSuffix));
        const req = http.request(requestOptions, (response) => this.forwardResponseToApiGateway(server, response, context, callback));
        if (event.body) {
            req.write(event.body);
        }
        req.on("error", (error) => this.forwardConnectionErrorResponseToApiGateway(server, error, context, callback))
            .end();
    }
}
exports.Proxy = Proxy;
