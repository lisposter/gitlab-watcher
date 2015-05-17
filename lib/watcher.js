'use strict';

var path = require('path');
var BrowserWindow = require('browser-window');
var request = require('request');
var notifier = require('node-notifier');

var utils = require('./utils');

var watchingId = null;
var configWindow = null;
var config = utils.reloadConfig() || {};

module.exports = {
  toggleWatching: function toggleWatching(e) {

    // reload config incase of changed
    config = utils.reloadConfig();
    if (watchingId) {
      clearTimeout(watchingId);
    }
    if (e.checked) {
      watching();
    }
  },

  openConfig: function openConfig() {
    configWindow = new BrowserWindow({width: 1024, height: 768});

    configWindow.loadUrl('file://' + path.resolve(__dirname, '../index.html'));

    configWindow.openDevTools();

    configWindow.on('closed', function() {
      configWindow = null;
    });
  },

  watching: watching
};

function watching() {

  fetchIssues();

  watchingId = setTimeout(watching, config.interval * 1000);
}

function fetchIssues() {
  var opts = {
    url: config.api + '/issues?state=opened&order_by=created_at',
    headers: {
      'PRIVATE-TOKEN': config.token
    }
  };

  request(opts, function(err, res, body) {
    // TODO, using latest one for dev test
    //console.log(JSON.parse(body).shift());
    // var issue = JSON.parse(body).shift();
    // notifier.notify({
    //   title: issue.title,
    //   message: issue.description,
    //   icon: issue.author.avatar_url
    // }, function(err, res) {
    //   console.log(err, res);
    // });
  });
}
