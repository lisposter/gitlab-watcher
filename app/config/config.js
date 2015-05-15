'use strict';

var remote = require('remote');
var fs = require('fs');
var app = remote.require('app');

var configPath = app.getPath('userData') + '/config.json';

angular.module('gitlab.config', [])
.controller('PrefsCtrl', ['$http', '$scope', function($http, $scope) {

  /*
    Basic
   */
  $scope.gitlab = fs.existsSync(configPath) ? require(configPath) : {};

  $scope.savePrefs = function() {
    if ($scope.gitlab.token) {
      $http.defaults.headers.common['PRIVATE-TOKEN'] = $scope.gitlab.token;
    }

    fs.writeFileSync(configPath, JSON.stringify($scope.gitlab) || {});
  };


  /*
    Repos
   */

  $scope.refreshRepos = function() {
    $http.get($scope.gitlab.api + '/projects')
      .success(function(res) {
        $scope.projects = res;
      });
  };

}]);
