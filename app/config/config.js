(function() {
  'use strict';

  var remote = require('remote');
  var fs = require('fs');
  var app = remote.require('app');

  var configPath = app.getPath('userData') + '/config.json';

  angular
    .module('gitlab.config', [])
    .controller('PrefsCtrl', PrefsCtrl);

    function PrefsCtrl($http, $scope, $utils) {
      var vm = this;
      vm.gitlab = fs.existsSync(configPath) ? require(configPath) : {};

      vm.subscribe = vm.gitlab.repos || {};

      vm.savePrefs = savePrefs;

      function savePrefs() {
        if (vm.gitlab.token) {
          $http.defaults.headers.common['PRIVATE-TOKEN'] = $scope.gitlab.token;
        }

        // write into configsave
        fs.writeFileSync(configPath, JSON.stringify($scope.gitlab) || {});
      }

      vm.subscribe = vm.gitlab.repos || {};
      vm._status = {};

      function load(pageNum) {
        pageNum = pageNum || 1;
        return $http.get(vm.gitlab.api + '/projects?order_by=last_activity_at&page=' + pageNum);
      }

      vm.page = {};
      vm.refreshRepos = function(pageNum) {
        pageNum = pageNum || 1;
        load(1)
          .success(function(res, status, headers) {
            vm.projects = res;
            vm.page = $utils.pageInfo(headers('Link'));
          });
      };

      vm.loadMore = function(page) {
        load(vm.page.next)
          .success(function(res, status, headers) {
            vm.projects = vm.projects.concat(res);
            vm.page = $utils.pageInfo(headers('Link'));
          });
      };

      vm.applySubscription = function(status, id, proj) {

        if (status === true) {
          vm.subscribe[id] = proj;
        } else {
          delete vm.subscribe[id];
        }

        vm.gitlab.repos = vm.subscribe;

        fs.writeFileSync(configPath, JSON.stringify(vm.gitlab) || {});
      };

  }

})();
