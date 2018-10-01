var secrets = require('./secrets.js');
var request = require('request');

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




getRepoContributors("jquery", "jquery", function(err, result) {

  for (var contr of result) {
    console.log("Errors:", err);
    console.log("Result:", contr.avatar_url);
  }
});

