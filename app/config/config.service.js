(function() {
  'use strict';

  const fs = require('fs');
  const remote = require('remote');
  const app = remote.require('app');

  const configPath = app.getPath('userData') + '/config.json';
  const gitlab = fs.existsSync(configPath) ? require(configPath) : {};

  angular
    .module('gitlab.config')
    .factory('dataservice', dataservice);

    function dataservice($http) {
      return {
        loadConfig: loadConfig,
        saveConfig: saveConfig,
        loadRepos: loadRepos
      };

      /**
       * load app config
       * @return {Object} App config
       */
      function loadConfig() {
        return fs.existsSync(configPath) ? require(configPath) : {};
      }

      /**
       * save app config
       * @param  {Object} config config info
       */
      function saveConfig(config) {
        if (config.token) {
          $http.defaults.headers.common['PRIVATE-TOKEN'] = config.token;
        }

        // write into config
        fs.writeFileSync(configPath, JSON.stringify(config) || {});
      }

      /**
       * load repos
       * @param  {Number||String} pageNum the page number want to load
       * @return {Promise}         Resolved data
       */
      function loadRepos(pageNum) {
        pageNum = pageNum || 1;
        return $http.get(gitlab.api + '/projects?order_by=last_activity_at&page=' + pageNum)
          .then(loadComplete);

        /**
         * processing response data
         * @param  {Object} response response object from $http.get()
         * @return {Object}          repos and pager info
         */
        function loadComplete(response) {
          return {
            repos: response.data,
            pager: getPageNum(response.headers('Link'))
          };
        }


        /**
         * get pager info
         * @param  {String} string from response's http header
         * @return {Object}        Pager info
         */
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
