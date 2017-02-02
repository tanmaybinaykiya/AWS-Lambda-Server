"use strict";
const starterClass = require("../../../common/starter").Starter;
const app = require("../app").app;
var starter = new starterClass(app, "class-service");
exports.handle = starter.handle;