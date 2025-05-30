"use strict";
const pulumi = require("@pulumi/pulumi");
const aws = require("@pulumi/aws");
const awsx = require("@pulumi/awsx");

// Create an AWS resource (S3 Bucket)
const bucket = new aws.s3.BucketV2("my-bucket");

const ownerShipControls = new aws.s3.BucketOwnershipControls("ownership-controls",{
    bucket: bucket.id,
    rule: {
        objectOwnership: "ObjectWriter"
    }
})

const publicAccessBlock = new aws.s3.BucketPublicAccessBlock("public-access-block", {
    bucket: bucket.id,
    BlockPublicAcls: false
})


const website = new aws.s3.BucketWebsiteConfigurationV2("website", {
    bucket: bucket.id,
    indexDocument: {
        suffix: "index.html"
    },
})

// Create an S3 Bucket object
const bucketObject = new aws.s3.BucketObject("index.html", {
    bucket: bucket.id,
    source: new pulumi.asset.FileAsset("./index.html"),
    contentType: "text/html",
    acl: "public-read",
}, {dependsOn: [publicAccessBlock, ownerShipControls, website]});


// Export the name of the bucket
exports.bucketName = bucket.id;
exports.bucketEndpoint = pulumi.interpolate`http://${website.websiteEndpoint}`;