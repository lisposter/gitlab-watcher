(function() {
  'use strict';

  var remote = require('remote');
  var fs = require('fs');
  var app = remote.require('app');

  var configPath = app.getPath('userData') + '/config.json';

  angular
    .module('gitlab.config')
    .controller('PrefsCtrl', PrefsCtrl)
    .controller('SubscribeCtrl', SubscribeCtrl);

    function PrefsCtrl($http, $scope, dataservice) {
      var vm = this;
      vm.gitlab = fs.existsSync(configPath) ? require(configPath) : {};

      vm.subscribe = vm.gitlab.repos || {};

      vm.savePrefs = savePrefs;

      function savePrefs() {
        dataservice.saveConfig(vm.gitlab);
      }



    }

    function SubscribeCtrl(dataservice) {
      var vm = this;

      vm.projects = [];
      vm._status = {};
      vm.loadRepos = loadRepos;
      vm.page = {};
      vm.refreshRepos = refreshRepos;
      vm.applySubscription = applySubscription;

      init();

      function init() {
        refreshRepos(1);
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
