process.env.SERVERLESS_STAGE = "dev";
process.env.AWS_ACCESS_KEY_ID = "blahAKIAJPCJUTYCLYKYMLYA";
process.env.AWS_SECRET_ACCESS_KEY = "blahu3Jx7g3zyBiKAXPX2e/Atebj7E1Gehh8jcxpJzUF";
process.env.IS_LOCAL = true;

var bcrypt = require("co-bcryptjs");
var co = require("co");
var user = require("./src/common/lib/user");
var institution = require("./src/common/lib/institution");
var dao = require("./src/common/lib/dao");

function* createTables() {
    yield dao.createTables();
}

function* createSuperAdmin() {
    console.log("Creating SuperAdmin");
    var returnUser = yield user.addUser({
        password: "password",
        role: "SECS",
        email: "superadmin@secureslice.com",
        mobile: 9823012345,
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
        email: "admin@usc.com",
        role: "admin",
        mobile: 9823054321,
        institutionShortCode: "USC",
        schoolCode: "CSE",
    })
    console.log(returnUser);
}

function* createInstitution() {
    yield institution.createInstitution({
        name: "University of Southern California",
        shortCode: "USC",
        adminemail: "admin@usc.com",
        addressline1: "UNKNOWN",
        city: "New York",
        state: "California",
        zip: 1234567,
        country: "USA"
    });
}

function* createSchool() {

}

function* createParent() {
    console.log("Creating Parent");
    var returnUser = yield user.addUser({
        password: "password",
        role: "parent",
        email: "parent@gmail.com",
        mobile: 9823054321,
        firstname: "Lorem",
        lastname: "Parent",
        institutionShortCode: "USC",
        schoolCode: "CSE",
        // familyCustomerId: "124567"
    })
    console.log(returnUser);
}

function* createStudent() {

}

function genSalt() {
    co(function* () {
        try {
            yield createTables();
            // yield createSuperAdmin();
            // yield createAdmin();
            // yield createInstitution();
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