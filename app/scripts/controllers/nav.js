'use strict';

app.controller('NavCtrl', function($scope, $location, Post, Auth) {
  $scope.post = {url: 'http://', title: ''};

  $scope.submitPost = function () {
    Post.create($scope.post).
        then(function(postId) {
          $scope.post = {url: 'http://', title: ''};
          $location.path('/posts/' + postId);
        });
  };

  $scope.signedIn = function() {
    return Auth.signedIn();
  };

  $scope.logout = function() {
    Auth.logout();
  };

});