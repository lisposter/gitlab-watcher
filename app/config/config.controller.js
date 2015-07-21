(function() {
  'use strict';

  angular
    .module('gitlab.config')
    .controller('PrefsCtrl', PrefsCtrl)
    .controller('SubscribeCtrl', SubscribeCtrl);

    function PrefsCtrl($http, $scope, dataservice) {
      var vm = this;
      vm.gitlab = dataservice.loadConfig();
      vm.subscribe = vm.gitlab.repos || {};
      vm.savePrefs = savePrefs;

      function savePrefs() {
        dataservice.saveConfig(vm.gitlab);
      }
    }

    function SubscribeCtrl(dataservice) {
      var vm = this;
      vm.gitlab = dataservice.loadConfig();
      vm.projects = [];
      vm._status = {};
      vm.page = {};
      vm.loadRepos = loadRepos;
      vm.refreshRepos = refreshRepos;
      vm.applySubscription = applySubscription;

      init();

      function init() {
        refreshRepos(1);
        vm._status = Object.keys(vm.gitlab.repos).reduce(function(memo, curr) {
          console.log(curr);
          memo[curr] = true;
          return memo;
        }, {});
      }

      function refreshRepos(pageNum) {
        pageNum = pageNum || 1;
        return loadRepos(pageNum);
      }

      function loadRepos(page) {
        return dataservice.loadRepos(vm.page.next)
          .then(function(res) {
            vm.projects = vm.projects.concat(res.repos);
            vm.page = res.pager;
          });
      }

      function applySubscription(status, id, proj) {
        if (status === true) {
          vm.subscribe[id] = proj;
        } else {
          delete vm.subscribe[id];
        }

        vm.gitlab.repos = vm.subscribe;

        dataservice.saveConfig(vm.gitlab);
      }
    }

})();
