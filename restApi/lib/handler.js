var HttpError = require("./errors").HttpError;
var co = require("co");
var handleRequest = function () {
    var args = Array.prototype.slice.call(arguments);
    var cb = args[0];
    var handlers = Array.prototype.slice.call(arguments, 1);
    co(function* () {
        console.log("ZZZZZZZZZZZZ1");
        try {
            console.log("ZZZZZZZZZZZZ2");
            var context = {};
            console.log("ZZZZZZZZZZZZ3");
            for (var i = 0; i < handlers.length; i++) {
                console.log("ZZZZZZZZZZZZ4" + i);
                yield handlers[i](context);
            }
            console.log("ZZZZZZZZZZZZ6");
            console.log("context.body", context.body);
            cb(null, context.body);
            console.log("ZZZZZZZZZZZZ7");
        } catch (err) {
            console.error("ERRRRRR", err);
            if (err instanceof HttpError) {
                cb(JSON.stringify({ apiStatus: "Error", code: err.status, message: err.message }));
            } else if (err.name && err.name === "ValidationError") {
                cb(JSON.stringify({ apiStatus: "Error", code: 400, message: err.details }));
            } else {
                cb(JSON.stringify({ apiStatus: "Error", code: 500, message: "Unknown Server error" }));
            }
        }
    });

}
module.exports = handleRequest;