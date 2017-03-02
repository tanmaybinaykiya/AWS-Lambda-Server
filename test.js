process.env.AWS_ACCESS_KEY_ID = "AKIAJPCJUTYCLYKYMLYA";
process.env.AWS_SECRET_ACCESS_KEY = "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";
process.env.IS_LOCAL = true;
process.env.SERVERLESS_STAGE = "dev";
process.env.JWT_SECRET = "12345678";
process.env.SENDGRIDKEY = "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"

var bcrypt = require("co-bcryptjs");
var co = require("co");
var user = require("./src/common/lib/user");
var institution = require("./src/common/lib/institution");
var schoolLib = require("./src/common/lib/school");
var dao = require("./src/common/lib/dao/utils");

function* createTables() {
    console.log("Creating tables");
    yield dao.createTables();
}

function* createSuperAdmin() {
    console.log("Creating SuperAdmin");
    var returnUser = yield user.addUser({
        password: "password",
        role: "SECS",
        email: "tanmay+superadmin@secureslice.com",
        mobile: "+919538209368",
        firstname: "SuperLorem",
        lastname: "IpsumAdmin",
    })
    console.log(returnUser);
}

function* createAdmin() {
    console.log("Creating Admin");
    var returnUser = yield user.addUser({
        firstname: "Lorem",
        lastname: "Admin",
        password: "password",
        email: "tanmay+admin@secureslice.com",
        role: "admin",
        mobile: "+919538209368",
        institutionShortCode: "USC"
    })
    console.log(returnUser);
}

function* createInstitution() {
    yield institution.createInstitution({
        name: "New Institution",
        shortCode: "USC",
        adminemail: "tanmay@secureslice.com",
        addressline1: "UNKNOWN",
        city: "New York",
        state: "California",
        zip: 1234567,
        country: "USA"
    });
}

function* createParent() {
    console.log("Creating Parent");
    var returnUser = yield user.addUser({
        password: "password",
        role: "parent",
        email: "tanmay+parent@secureslice.com",
        mobile: "+919538209368",
        firstname: "Lorem",
        lastname: "Parent",
        institutionShortCode: "USC",
        schoolCode: "CSE",
        // familyCustomerId: "124567"
    })
    console.log(returnUser);
}

function genSalt() {
    co(function* () {
        try {
            console.log("genSalt");
            // yield createTables();
            // yield createSuperAdmin();
            // yield createAdmin();
            yield createInstitution();
            // yield createSchool();
            // yield createParent();
            // yield createStudent();


            // var result = yield dao.getUser("superadmin@secureslice.com");
            // console.log("Result: ", result);
        } catch (err) {
            console.error(err);
        }

    });
}
genSalt();