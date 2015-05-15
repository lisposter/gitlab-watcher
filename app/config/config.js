'use strict';

var remote = require('remote');
var fs = require('fs');
var app = remote.require('app');

var configPath = app.getPath('userData') + '/config.json';

angular.module('gitlab.config', [])
.controller('PrefsCtrl', ['$http', '$scope', function($http, $scope) {

  $scope.gitlab = fs.existsSync(configPath) ? require(configPath) : {};

  $scope.savePrefs = function() {
    fs.writeFileSync(configPath, JSON.stringify($scope.gitlab) || {});
  };

}]);
