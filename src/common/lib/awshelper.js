var AWS         = require("aws-sdk");
var uuid        = require("node-uuid");
var getImageUploadURL = function (bucket) {
    var imageId = uuid.v4();
    var s3 = new AWS.S3();
    var params = {Bucket: bucket, Key: imageId, Expires: 600, ContentType: "application/octet-stream"};
    var url = s3.getSignedUrl("putObject", params);
    return {id:imageId,url:url};    
}

var getImageDownloadURL = function(bucket, imageId){
    var s3 = new AWS.S3();
    var params = {Bucket: bucket, Key: imageId, Expires: 600, ContentType: "application/octet-stream"};
    return s3.getSignedUrl("getObject", params);
}

module.exports = {
    getImageUploadURL,
    getImageDownloadURL
} 