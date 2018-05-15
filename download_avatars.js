var request = require('request')
var secrets = require('./secrets')
var fs = require('fs')

var repoOwner = process.argv[2] //Command line argument defined
var repoName = process.argv[3]


function getRepoContributors(repoOwner, repoName, cb) {
  if (process.argv.length !== 4) { //if repoOwner and repoName not specified - end function
    console.log("Please specify repo owner and repo name")
    return;
  };
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
  request.get(url) //get image url
    .on('error', function(err) {
      throw err;
    })
    .on('response', function(response) {
      console.log('Response Status Code: ', response.statusCode + response.headers['content-type']);
    })
    .pipe(fs.createWriteStream(filePath)); //take in specfified filepath
}

// console.log('Welcome to the GitHub Avatar Downloader!')

getRepoContributors(repoOwner, repoName, function(err, result) {
  var data = JSON.parse(result) //parse object
  data.forEach(function(x) {
    downloadImageByURL(x.avatar_url, 'avatars/' + x.login) //download file
  })
  // console.log("Errors:", err);
  // console.log("Result:", result);
});
