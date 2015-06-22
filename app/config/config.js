'use strict';

var remote = require('remote');
var fs = require('fs');
var app = remote.require('app');

var configPath = app.getPath('userData') + '/config.json';

angular.module('gitlab.config', [])
.controller('PrefsCtrl', ['$http', '$scope', '$utils', function($http, $scope, $utils) {

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

  $scope.subscribe = $scope.gitlab.repos || {};
  $scope._status = {};

  function load(pageNum) {
    pageNum = pageNum || 1;
    return $http.get($scope.gitlab.api + '/projects?order_by=last_activity_at&page=' + pageNum);
  }

  $scope.page = {};
  $scope.refreshRepos = function(pageNum) {
    pageNum = pageNum || 1;
    load(1)
      .success(function(res, status, headers) {
        $scope.projects = res;
        $scope.page = $utils.pageInfo(headers('Link'));
      });
  };

  $scope.loadMore = function(page) {
    load($scope.page.next)
      .success(function(res, status, headers) {
        $scope.projects = $scope.projects.concat(res);
        $scope.page = $utils.pageInfo(headers('Link'));
      });
  };

  $scope.applySubscription = function(status, id, proj) {

    if (status === true) {
      $scope.subscribe[id] = proj;
    } else {
      delete $scope.subscribe[id];
    }

    $scope.gitlab.repos = $scope.subscribe;

    fs.writeFileSync(configPath, JSON.stringify($scope.gitlab) || {});
  };

}]);
