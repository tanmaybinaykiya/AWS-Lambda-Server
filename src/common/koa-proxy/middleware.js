module.exports = function (options) {

    return function* eventContext(next) {
        console.log("********************* eventContext *********************");
        console.log("state: ", this.state);
        console.log("req: ", this.request);
        console.log("options: ", options);
        console.log("********************* eventContext *********************");
        options = options || {}; // defaults: {reqPropKey: "apiGateway", deleteHeaders: true}
        this.state = this.state || {};
        const reqPropKey = options.reqPropKey || "apiGateway";
        const deleteHeaders = options.deleteHeaders === undefined ? true : options.deleteHeaders;
        var req = this.request;
        if (!req.headers["x-apigateway-event"] || !req.headers["x-apigateway-context"]) {
            console.error("Missing x-apigateway-event or x-apigateway-context header(s)");
            yield next;
        } else {
            this.state[reqPropKey] = {
                event: JSON.parse(req.headers["x-apigateway-event"]),
                context: JSON.parse(req.headers["x-apigateway-context"])
            };

            if (deleteHeaders) {
                delete req.headers["x-apigateway-event"];
                delete req.headers["x-apigateway-context"];
            }
            yield next;
        }
    };

};
