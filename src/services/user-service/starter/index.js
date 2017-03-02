//TODO do not run this, this is just to copy as index to functions folder on compile
"use strict";
const starterClass = require("../../../common/starter").Starter;
const app = require("../app").app;
var starter = new starterClass(app, "user-service");
exports.handle = starter.handle;