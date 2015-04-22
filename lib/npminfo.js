'use strict';

var request = require("request");

module.exports = function(packageName, cb) {
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

    var githubUrl = null;
    var githubUrlMacher = /.*github\.com[:\/]([\w-]+)\/([\w-]+).*/;
    if (npmObj.repository && npmObj.repository.url && npmObj.repository.url.match(githubUrlMacher)) {
      githubUrl = npmObj.repository.url.replace(githubUrlMacher, 'https://github.com/$1/$2');
      // var githubApi = npmObj.repository.url.replace(githubUrlMacher, 'https://api.github.com/repos/$1/$2');
    }

    var info = {
      name: npmObj.name,
      'latest-version': npmObj['dist-tags'].latest,
      description: npmObj.description,
      homepage: (npmObj.homepage && npmObj.homepage.match(/^https?:\/\//)) ? npmObj.homepage : npmUrl,
      modified: npmObj.time.modified
    };

    if (githubUrl) {
      info['github'] = githubUrl;
    }

    cb(info);

  });
};