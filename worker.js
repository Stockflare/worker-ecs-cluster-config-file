console.log('Start');

var region = process.env.AWS_REGION;
var bucket  = process.env.CONFIG_FILE_BUCKET;
var folder = process.env.CONFIG_FILE_FOLDER;

var aws = require('aws-sdk');
var _ = require('underscore');
var exec = require('child_process').exec;
var s3 = new aws.S3({
  region: region
});
var sqs = new aws.SQS({
  region: region
});
var fs = require('fs');
var mkdirp = require('mkdirp');



var downloadAllFiles = function() {
  if (!fs.existsSync(folder)) {
    mkdirp.sync(folder);
  }

  if (fs.statSync(folder).isDirectory()) {
    var cmd = 'aws --region ' + region + ' s3 sync s3://' + bucket + ' ' + folder;
    console.log('cmd: ', cmd);
    exec(cmd, function(error, stdout, stderr) {
      console.log(stdout);
    });
  }
};


downloadAllFiles();

setInterval(function() {
  console.log('Checking for File Changes');
  downloadAllFiles();

}, 30000);


console.log("Exit");
