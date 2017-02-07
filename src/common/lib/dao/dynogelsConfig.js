var dynogels = require("dynogels");
dynogels.log.level("info");
var models = require("./models");

if (process.env.IS_LOCAL) {
    console.log("IS LOCAL");
    dynogels.AWS.config.update({ region: 'us-east-1' });
    var opts = {
        apiVersion: "2012-08-10",
        credentials: new dynogels.AWS.Credentials(process.env.AWS_ACCESS_KEY_ID, process.env.AWS_SECRET_ACCESS_KEY),
        region: "us-east-1",
        endpoint: "http://localhost:8000"
    };
    dynogels.dynamoDriver(new dynogels.AWS.DynamoDB(opts));
} else {
    dynogels.dynamoDriver(new dynogels.AWS.DynamoDB());
}

module.exports = dynogels;