process.env.SERVERLESS_STAGE = "dev";
var bcrypt = require("co-bcryptjs");
var co = require("co");
var user = require("./src/common/lib/user");
var institution = require("./src/common/lib/institution");
var dao = require("./src/common/lib/dao");

function* setup() {
    console.log("Creating Tables");
    yield dao.createTables();

    console.log("Creating SuperAdmin");
    var returnUser = yield user.addUser({
        password: "password",
        role: "superadmin",
        email: "superadmin@secureslice.com",
        mobile: 9823012345,
        firstname: "Super",
        lastname: "Admin",
        // institutionShortCode: "ISS",
        // familyCustomerId: 124567
    })
    console.log(returnUser);

    console.log("Creating Admin");
    var returnUser = yield user.addUser({
        password: "password",
        role: "admin",
        email: "admin@secureslice.com",
        mobile: 9823054321,
        firstname: "Admin",
        lastname: " ",
        // institutionShortCode: "ISS",
        // familyCustomerId: 124567
    })
    console.log(returnUser);

}

function genSalt() {
    co(function* () {
        try {
            yield setup();
            // var createInst = {
            //     "shortCode": "SH",
            //     "adminemail": "holmes@sherlock.en",
            //     "addressline1": "212B Baker street",
            //     "city": "London",
            //     "state": "Greater London",
            //     "zip": 1234567,
            //     "country": "England"
            // };
            // yield institution.createInstitution(createInst);

            // var result = yield dao.getUser("superadmin@secureslice.com");
            // console.log("Result: ", result);
        } catch (err) {
            console.error(err);
        }

    });
}
genSalt();