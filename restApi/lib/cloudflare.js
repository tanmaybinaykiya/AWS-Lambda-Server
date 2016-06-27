var CFClient = require('cloudflare');
var client = new CFClient({
    email: process.env.cloudflareEmail,
    key: process.env.cloudflareKey
});

var createSubdomain = function (institutionShortCode) {
    if (process.env.SERVERLESS_STAGE !== "prod" || process.env.SERVERLESS_STAGE !== "beta") {
        return new Promise(function (resolve, reject) {
            resolve();
        });
    }

    if (process.env.SERVERLESS_STAGE === "beta") {
        institutionShortCode = institutionShortCode + "-beta";
    }
    var DNSRecord = CFClient.DNSRecord.create({
        "type": "CNAME",
        "name": institutionShortCode,
        "content": process.env.s3dns,
        "proxied": true,
        "proxiable": true,
        "leakedOrigin": false,
        "zone_id": "66221526cbd9df3d231698f5c085a73a"
    });
    return client.addDNS(DNSRecord);
}

module.exports = {
    createSubdomain
} 