var classLib = require("../../common/lib/class");

module.exports.createClass = function* (){
    var clazz = classLib.addClass(this.request.body);
    this.status = 200;
    this.body = clazz.toJSON();
};

module.exports.getClasses = function* () {
    console.log("I'm heere");
    //event.queryParams.schoolCode, event.queryParams.institutionCode
    // let request: GetClassesRequest = new GetClassesRequest(this.params.name);
    // let response: GetClassesResponse = yield Handler.getClasses(request);
    // if (response !== null) {
        this.status = 200;
        this.body = {response:"tatti"};
    // } else {
    //     this.status = 204;
    // }
};
