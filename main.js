'use strict';

var app = require('app');

var menu = require('./lib/menu');
var watcher = require('./lib/watcher');

app.on('ready', function(){
  menu.tray();
  menu.app();

  // start watcher
  watcher.watching();
});
