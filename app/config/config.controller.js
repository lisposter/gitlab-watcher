(function() {
  'use strict';

  var remote = require('remote');
  var fs = require('fs');
  var app = remote.require('app');

  var configPath = app.getPath('userData') + '/config.json';

  angular
    .module('gitlab.config')
    .controller('PrefsCtrl', PrefsCtrl);

    function PrefsCtrl($http, $scope, dataservice) {
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

      vm.page = {};
      vm.refreshRepos = function(pageNum) {
        pageNum = pageNum || 1;
        dataservice.loadRepos(1)
          .then(function(res) {
            vm.projects = res.repos;
            vm.page = res.pager;
          });
      };

      vm.loadMore = function(page) {
        dataservice.loadRepos(vm.page.next)
          .then(function(res) {
            vm.projects = vm.projects.concat(res.repos);
            vm.page = res.pager;
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
