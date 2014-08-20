'use strict';

/**
 * @ngdoc overview
 * @name angnewsApp
 * @description
 * # angnewsApp
 *
 * Main module of the application.
 */
var app = angular.module('angNewsApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
])

app.config(function ($routeProvider) {
  $routeProvider
      .when('/', {
        templateUrl: 'views/posts.html',
        controller: 'PostCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
