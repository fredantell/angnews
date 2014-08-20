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
    'ngTouch',
    'firebase'
])

app.constant('FIREBASE_URL', 'https://luminous-heat-8461.firebaseio.com/')

app.config(function ($routeProvider) {
  $routeProvider
      .when('/', {
        templateUrl: 'views/posts.html',
        controller: 'PostCtrl'
      })
      .when('/posts/:postId', {
        templateUrl: 'views/showpost.html',
        controller: 'PostViewCtrl'
      })
      .when('/register', {
        templateUrl: 'views/register.html',
        controller: 'AuthCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
