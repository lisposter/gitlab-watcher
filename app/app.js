(function() {
  'use strict';

  const remote = require('remote');
  const app = remote.require('app');
  const fs = require('fs');

  angular
    .module('gitlab', [
      'ngRoute', 'gitlab.config', 'ngMaterial'
    ])

    .config(appConfig)
    .run(appInit)
    .directive('scrollEnd', scrollEnd);

    function appConfig($mdThemingProvider, $mdIconProvider, $routeProvider, $locationProvider) {
      $routeProvider
       .when('/prefs/', {
          templateUrl: 'app/config/config.html',
          controller: 'PrefsCtrl',
          controllerAs: 'vm'
        })
        .otherwise('/prefs/');

      $mdThemingProvider.theme('default')
        .primaryPalette('blue')
        .accentPalette('red');

      $mdIconProvider
        .icon("menu"       , "resources/menu.svg"        , 24);
    }

    function appInit($http, $rootScope) {
      var configPath = app.getPath('userData') + '/config.json';
      var gitlab = fs.existsSync(configPath) ? require(configPath) : {};

      if (gitlab.token) {
        $http.defaults.headers.common['PRIVATE-TOKEN'] = gitlab.token;
      }
    }

    function scrollEnd() {
      return function(scope, elm, attr) {
          var raw = elm[0];

          elm.bind('scroll', function() {
            console.log('heh');
              if (raw.scrollTop + raw.offsetHeight >= raw.scrollHeight) {
                  scope.$apply(attr.scrollEnd);
              }
          });
      };
    }

})();
