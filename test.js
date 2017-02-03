
process.env.SERVERLESS_STAGE = "dev";
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
        email: "superadmin3@secureslice.com",
        mobile: 9823012345,
        firstname: "Super",
        lastname: "Admin",
        // institutionShortCode: "ISS",
        // familyCustomerId: 124567
    })
    console.log(returnUser);
}

function* createAdmin() {
    console.log("Creating Admin");
    var returnUser = yield user.addUser({
        password: "password",
        role: "admin",
        email: "admin@secureslice.com",
        mobile: 9823054321,
        firstname: "Dumbledore",
        lastname: " ",
        institutionShortCode: "ISS",
        // familyCustomerId: 124567
    })
    console.log(returnUser);
}

function* createInstitution() {
    yield institution.createInstitution({
        "name": "Arkhum Asylum",
        "shortCode": "ISS",
        "adminemail": "whyso@serious.com",
        "addressline1": "UNKNOWN",
        "city": "Gotham",
        "state": "NEW YORK",
        "zip": 1234567,
        "country": "USA"
    });
}

function* createSchool() {

}

function* createParent() {
    console.log("Creating Parent");
    var returnUser = yield user.addUser({
        password: "password",
        role: "parent",
        email: "parent@secureslice.com",
        mobile: 9823054321,
        firstname: "Sirius",
        lastname: "Black",
        institutionShortCode: "ISS",
        schoolCode: "LHS2",
        familyCustomerId: "124567"
    })
    console.log(returnUser);
}

function* createStudent() {

}

function genSalt() {
    co(function* () {
        try {
            yield createTables();
            yield createSuperAdmin();
            yield createAdmin();
            yield createInstitution();
            yield createSchool();
            yield createParent();
            yield createStudent();


            // var result = yield dao.getUser("superadmin@secureslice.com");
            // console.log("Result: ", result);
        } catch (err) {
            console.error(err);
        }

    });
}
genSalt();