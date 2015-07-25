'use strict';

const app = require('app');
const fs = require('fs');

var configPath = app.getPath('userData') + '/config.json';
var config = {};

module.exports = {
  reloadConfig: function reloadConfig() {
    return fs.existsSync(configPath) ? JSON.parse(fs.readFileSync(configPath).toString()) : config;
  }
};
