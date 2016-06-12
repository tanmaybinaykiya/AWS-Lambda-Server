process.env.SERVERLESS_STAGE="dev";
var bcrypt = require("co-bcryptjs");
var co = require("co");
var user = require("./restApi/lib/user");
function genSalt(){
    co(function* () {
        try{
            
            console.log(process.env.SERVERLESS_STAGE);
            console.log("Creating user" , user);
            var returnUser=yield user.addUser({
                password:"Kiran123",
                role:"superadmin",
                email:"saikiran@secureslice.com",
                mobile     : 9591962440,
                firstname    : "Saikiran",
                lastname    : "Daripelli"
            })
            console.log(returnUser);
        }catch(err){
            console.error(err);
        }
        
    });
}
genSalt();