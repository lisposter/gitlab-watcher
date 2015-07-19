(function() {
  'use strict';

  const fs = require('fs');
  var remote = require('remote');
  var app = remote.require('app');

  const configPath = app.getPath('userData') + '/config.json';
  var gitlab = fs.existsSync(configPath) ? require(configPath) : {};

  angular
    .module('gitlab.config')
    .factory('dataservice', dataservice);

    function dataservice($http) {
      return {
        loadRepos: loadRepos
      };

      function loadRepos(pageNum) {
        pageNum = pageNum || 1;
        return $http.get(gitlab.api + '/projects?order_by=last_activity_at&page=' + pageNum)
          .then(loadComplete);

        function loadComplete(response) {
          return {
            repos: response.data,
            pager: getPageNum(response.headers('Link'))
          };
        }

        function getPageNum(string) {
          if (!string) {
            return;
          }
          var obj = {};
          string.split(',').forEach(function(itm) {
            if (itm.indexOf('rel="next"') > 0) {
              obj.next = /page=(\d+)/.exec(itm)[1];
            }
          });
          return obj;
        }
      }
    }
})();
