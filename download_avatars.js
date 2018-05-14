var request = require('request')
var secrets = require('./secrets')
var fs = require('fs')

var repoOwner = process.argv[2]
var repoName = process.argv[3]

function getRepoContributors(repoOwner, repoName, cb) {

  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': 'request',
      'Authorization': 'token ' + secrets.GITHUB_TOKEN
    }
  };
var avatarURL = '';
var avatarPath = '';
  request.get(options, function(err, res, body) {
    cb(err, body);
  });

}

function downloadImageByURL(url, filePath) {
  request.get(url)
         .on('error', function (err) {
           throw err;
         })
         .on('response', function(response) {
           console.log('Response Status Code: ', response.statusCode + response.headers['content-type']);
         })
         .pipe(fs.createWriteStream(filePath));
}

// console.log('Welcome to the GitHub Avatar Downloader!')

getRepoContributors(repoOwner, repoName, function(err, result) {
var data = JSON.parse(result)
data.forEach(function(x){
  downloadImageByURL(x.avatar_url, 'avatars/' + x.login )
})
  // console.log("Errors:", err);
  // console.log("Result:", result);
});
