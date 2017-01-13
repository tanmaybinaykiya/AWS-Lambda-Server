//TODO do not run this, this is just to copy as index to functions folder on compile
"use strict";
var starterClass = require("./common/starter");
var app = require("../app").app;

starterClass.init(app, "user-service");

exports.handle = starterClass.handle;