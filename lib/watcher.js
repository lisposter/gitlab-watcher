'use strict';

const path = require('path');
const BrowserWindow = require('browser-window');
const request = require('request');
const notifier = require('node-notifier');
const async = require('async');
const _ = require('lodash');

const utils = require('./utils');

var watchingId = null;
var configWindow = null;
var config = utils.reloadConfig() || {};

// for cache last time's issue
var CACHE = {};

module.exports = {
  toggleWatching: toggleWatching,
  openConfig: openConfig,
  watching: watching
};

function toggleWatching(e) {
  // reload config incase of changed
  config = utils.reloadConfig();
  if (watchingId) {
    clearTimeout(watchingId);
  }
  if (e.checked) {
    watching();
  }
}

function openConfig() {
  configWindow = new BrowserWindow({width: 1024, height: 768});

  configWindow.loadUrl('file://' + path.resolve(__dirname, '../index.html'));

  configWindow.openDevTools();

  configWindow.on('closed', function() {
    configWindow = null;
  });
}

function watching() {
  fetchIssues();

  watchingId = setTimeout(watching, config.interval * 1000);
}

function fetchIssues(callback) {
  async.eachLimit(Object.keys(config.repos) || [], 10, function(item, callback) {
    var opts = {
      url: config.api + '/projects/' + item + '/issues?state=opened&order_by=created_at',
      headers: {
        'PRIVATE-TOKEN': config.token
      }
    };

    request(opts, function(err, res, body) {
     // console.log(body);
      var _result = JSON.parse(body);
      if (err) {
        return callback(err);
      }

      if (!CACHE[item]) {
        CACHE[item] = _result;
      } else {
        for (var i = 0; i <= _result.length - 1; i++) {
          if (_.some(CACHE[item], 'id', _result[i].id)) {
            break;
          }
          notify(_result[i]);

          CACHE[item].unshift(_result[i]);
        }
      }
      callback(null, JSON.parse(body));
    });
  }, function(err) {
    if (err) {
      return;
    }
    //callback(null, {});
  });
}


function notify(issue) {
  notifier.notify({
    title: issue.title,
    message: issue.description,
    icon: issue.author.avatar_url,
    open: config.url + '/' + config.repos[issue.project_id] + '/issues/' + issue.iid
  }, function(err, res) {
    console.log(err, res);
  });
}
