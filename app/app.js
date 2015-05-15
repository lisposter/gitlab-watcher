'use strict';

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
}]);
