'use strict';

var remote = require('remote');
var app = remote.require('app');
var fs = require('fs');

angular.module('gitlab', ['ngRoute', 'gitlab.config', 'ngMaterial'])

.config(['$mdThemingProvider', '$mdIconProvider', '$routeProvider', '$locationProvider', function($mdThemingProvider, $mdIconProvider, $routeProvider, $locationProvider) {

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
}])

.run(['$http', '$rootScope', function($http, $rootScope) {
  var configPath = app.getPath('userData') + '/config.json';
  var gitlab = fs.existsSync(configPath) ? require(configPath) : {};

  if (gitlab.token) {
    $http.defaults.headers.common['PRIVATE-TOKEN'] = gitlab.token;
  }
}])

.directive('scrollEnd', function() {
    return function(scope, elm, attr) {
        var raw = elm[0];

        elm.bind('scroll', function() {
          console.log('heh');
            if (raw.scrollTop + raw.offsetHeight >= raw.scrollHeight) {
                scope.$apply(attr.scrollEnd);
            }
        });
    };
})

.factory('$utils', [function() {
  return {
    pageInfo: function(string) {
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
  };
}]);
