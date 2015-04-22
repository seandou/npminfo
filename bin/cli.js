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

});
