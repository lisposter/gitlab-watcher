'use strict';

var app = require('app');

var menu = require('./lib/menu');
var watcher = require('./lib/watcher');

// hide dock icon
app.dock.hide();

app.on('ready', function(){
  menu.tray();
  menu.app();

  // start watcher
  // watcher.watching();
});

// prevent app close when all windows are closed
app.on('will-quit', function(e) {
  e.preventDefault();
});
