var HttpError=require("./errors").HttpError;
var co=require("co");
var handleRequest = function (handler,cb){
    co(function*(){
        try {
            var response = yield handler();
            cb(null, response);
        } catch (err) {
            console.error(err.name);
            if (err instanceof HttpError) {
                cb(JSON.stringify({apiStatus:"Error",  code: err.status, message: err.message }));
            } else if(err.name && err.name === "ValidationError"){
                cb(JSON.stringify({apiStatus:"Error",  code: 400, message: err.details }));
            }else{
                cb(JSON.stringify({apiStatus:"Error",  code: 500, message: "Unknown Server error" }));
            }
        }
    });
    
}
module.exports=handleRequest;