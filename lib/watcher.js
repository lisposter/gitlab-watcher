'use strict';

var BrowserWindow = require('browser-window');

var utils = require('./utils');

var watchingId = null;
var configWindow = null;
var config = {};

module.exports = {
  toggleWatching: function toggleWatching(e) {
    if (watchingId) {
      clearTimeout(watchingId);
    }
    if (e.checked) {
      watching();
    }
  },

  openConfig: function openConfig() {
    configWindow = new BrowserWindow({width: 1024, height: 768});

    configWindow.loadUrl('file://' + __dirname + '/index.html');

    configWindow.openDevTools();

    configWindow.on('closed', function() {
      configWindow = null;
    });
  },

  watching: watching
};

function watching() {
  console.log('debug');
  config = utils.reloadConfig();
  watchingId = setTimeout(watching, config.interval * 1000);
}
