var secrets = require('./secrets.js');
var request = require('request');
var fs = require('fs');

console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, cb) {
  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': 'request',
      'Authorization': 'token ' + secrets.GITHUB_TOKEN
    }
  };

  request.get(options, function(err, res, body) {

    if (!err && res.statusCode == 200 ) {
        var contributors = JSON.parse(body);
        cb(err, contributors);
    }
    else {
        console.log(err);
    }
  });
}

function downloadImageByURL(url, filePath) {
  request.get(url)
  .on('error', function (err) {
    throw err;
  })
  .on('response', function (response) {
    console.log("Images downloaded!!");
  })
  .pipe(fs.createWriteStream(filePath))
}

getRepoContributors("jquery", "jquery", function(err, result) {

  fs.mkdir('./avatars/', function(err){
      if (err) {
      return console.error(err);
      }
  });
  for (var contr of result) {
    var filePath = "";
    filePath = './avatars/' + contr.login + '.jpg';
    downloadImageByURL(contr.avatar_url, filePath);
  }
});

