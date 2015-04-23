#!/usr/bin/env node

'use strict';

var Spinner = require('cli-spinner').Spinner;
var npminfo = require('../lib/npminfo.js');

var printHelp = function() {
  var help = [
    "",
    "Usage: npminfo [package]",
    "",
    "Example:",
    "",
    "  npminfo express",
    ""
  ].join("\n");
  
  console.log(help);
  process.exit(0);
};

var printNpmInfo = function(info) {
  console.log('');
  console.log(info.name);
  console.log('--------------------------------------------------');
  console.log(info.description);
  console.log('--------------------------------------------------');
  console.log('homepage: ' + info.homepage);

  if (info.github && (info.github != info.homepage)) {
    console.log('github: ' + info.github)
  }
  
  console.log('latest-version: ' + info['latest-version']);
  console.log('modified: ' + info.modified);
  
  if (info.forks) {
    console.log('watchers: ' + info.watchers + ', stars: ' + info.stars + ', forks: ' + info.forks);
  }
  
  console.log('--------------------------------------------------');
  console.log('');
};

function main() {
  if (process.argv.length < 3) {
    printHelp();
  }

  var spinner = new Spinner('%s');
  spinner.setSpinnerString('|/-\\');
  spinner.start();

  npminfo(process.argv[2], function(err, info) {
    spinner.stop('clean');

    if (err) {
      console.error(err);
      process.exit(1);
    }

    printNpmInfo(info);
  });
}

main();