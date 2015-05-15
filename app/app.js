'use strict';

angular.module('gitlab', ['ngRoute', 'gitlab.config'])

.config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {
  $routeProvider
   .when('/prefs/', {
    templateUrl: 'app/config/config.html',
    controller: 'PrefsCtrl'
  })

  .otherwise('/prefs/');
}]);
