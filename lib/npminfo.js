'use strict';

var request = require("request");

module.exports = function(packageName, cb) {
  npmInfo(packageName, function(err, info) {
    if (err) return cb(err);

    var githubRepoUri = info.githubRepoUri;
    delete info.githubRepoUri;

    if (githubRepoUri) {
      githubRepoInfo(githubRepoUri, function(err, githubInfo) {
        if (err) {
          return cb(null, info);
        }

        info['github'] = 'https://github.com' + githubRepoUri;
        info['modified'] = githubInfo.modified;
        info['forks'] = githubInfo.forks;
        info['watchers'] = githubInfo.watchers;
        info['stars'] = githubInfo.stars;

        cb(null, info);
      });
    } else {
      cb(null, info);
    }
  });
};

var npmInfo = function(packageName, cb) {
  var npmUrl = "https://www.npmjs.com/package/" + packageName;
  var registryUrl = "http://registry.npmjs.org/" + packageName;

  request(registryUrl, function(err, res, body) {
    if (err) return cb(err);

    if (body == '') {
      return cb('Can not found package: ' + packageName);
    }

    var npmObj = JSON.parse(body);
    if (npmObj.error) {
      return cb(npmObj.error);
    }

    var githubRepoUri = null;
    var githubUrlMacher = /.*github\.com[:\/]([\w-]+)\/([\w-]+).*/;
    if (npmObj.repository && npmObj.repository.url && npmObj.repository.url.match(githubUrlMacher)) {
      githubRepoUri = npmObj.repository.url.replace(githubUrlMacher, '/$1/$2');
    }

    var info = {
      name: npmObj.name,
      'latest-version': npmObj['dist-tags'].latest,
      description: npmObj.description,
      homepage: (npmObj.homepage && npmObj.homepage.match(/^https?:\/\//)) ? npmObj.homepage : npmUrl,
      modified: npmObj.time.modified,
      githubRepoUri: githubRepoUri
    };

    cb(null, info);
  });
};

var githubRepoInfo = function(uri, cb) {
  var api = 'https://api.github.com/repos' + uri;
  var options = {
    url: api,
    headers: {
      'User-Agent': 'npminfo request'
    }
  };

  request(options, function(err, res, body) {
    if (err) return cb(err);

    var data = JSON.parse(body);
    if (data.error) {
      return cb(data.error);
    }

    cb(null, {
      modified: data.updated_at,
      forks: data.forks_count,
      watchers: data.subscribers_count,
      stars: data.stargazers_count
    });
  });
};