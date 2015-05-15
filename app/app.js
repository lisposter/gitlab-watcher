'use strict';

var remote = require('remote');
var app = remote.require('app');
var fs = require('fs');

angular.module('gitlab', ['ngRoute', 'gitlab.config', 'ngMaterial'])

.config(['$mdThemingProvider', '$mdIconProvider', '$routeProvider', '$locationProvider', function($mdThemingProvider, $mdIconProvider, $routeProvider, $locationProvider) {

  $routeProvider
   .when('/prefs/', {
      templateUrl: 'app/config/config.html',
      controller: 'PrefsCtrl'
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
}]);
