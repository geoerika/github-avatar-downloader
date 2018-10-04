var secrets = require('./secrets.js');
var request = require('request');
var fs = require('fs');

var repOwner = process.argv[2];
var repName = process.argv[3];


console.log('Welcome to the GitHub Avatar Downloader!');

//function to find all repo contributors

function getRepoContributors(repoOwner, repoName, cb) {

  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': 'request',
      'Authorization': 'token ' + secrets.GITHUB_TOKEN
    }
  };
  if (repoOwner && repoName) {
    request.get(options, function(err, res, body) {

      if (!err && res.statusCode == 200 ) {
        var contributors = JSON.parse(body);
        cb(err, contributors);
      }
      else {
        console.log(err);
      }
    })
  } else {
    console.log("Please include both repoOwner and repoName!!!");
  }
};

//function to download an image on the local disk knowing its url

function downloadImageByURL(url, filePath) {

  request.get(url)
  .on('error', function (err) {
    throw err;
  })
  .on('response', function (response) {
    console.log("Images downloaded!!");
  })
  .pipe(fs.createWriteStream(filePath))
};

getRepoContributors(repOwner, repName, function(err, result) {

    fs.mkdir('./avatars/', function(err1) {
      console.log(err1);
    });
    for (var contr of result) {
      var filePath = "";
      filePath = './avatars/' + contr.login + '.jpg';
      downloadImageByURL(contr.avatar_url, filePath);
    }
});