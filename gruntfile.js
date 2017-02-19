module.exports = function (grunt) {
    "use strict";

    grunt.initConfig({
        copy: {
            js: {
                files: [{
                    src: ["src/services/auth-service/**/*.js", "src/common/**/*.js"],
                    dest: "functions/auth-service/"
                }, {
                    src: ["src/services/class-service/**/*.js", "src/common/**/*.js"],
                    dest: "functions/class-service/"
                }, {
                    src: ["src/services/institution-service/**/*.js", "src/common/**/*.js"],
                    dest: "functions/institution-service/"
                }, {
                    src: ["src/services/school-service/**/*.js", "src/common/**/*.js"],
                    dest: "functions/school-service/"
                }, {
                    src: ["src/services/student-service/**/*.js", "src/common/**/*.js"],
                    dest: "functions/student-service/"
                }, {
                    src: ["src/services/user-service/**/*.js", "src/common/**/*.js", "src/common/**/*.ejs"],
                    dest: "functions/user-service/"
                }, {
                    src: ["src/services/billing-service/**/*.js", "src/common/**/*.js"],
                    dest: "functions/billing-service/"
                }]
            },
            package: {
                files: [{
                    src: ["package.json"],
                    dest: "functions/"
                }]
            },
            serverless: {
                files: [{
                    cwd: 'serverless',
                    src: '**',
                    dest: "functions/",
                    expand: true
                }]
            }
        },
        clean: {
            functions: {
                src: ["functions/*", "!functions/node_modules"]
            }
        }
    });

    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-contrib-clean");
    grunt.loadNpmTasks("grunt-contrib-copy");

    grunt.registerTask("default", [
        "copy",
    ]);

    grunt.registerTask("cleanDeploy", [
        "clean",
        "copy",
    ]);

};