'use strict';

app.controller('NavCtrl', function($scope, $location, Post, Auth) {
  $scope.post = {url: 'http://', title: ''};

  $scope.submitPost = function () {
    Post.create($scope.post).
        then(function(ref) {
          $scope.post = {url: 'http://', title: ''};
          $location.path('/posts/' + ref.name());
        });
  };

  $scope.signedIn = function() {
    return Auth.signedIn();
  };

  $scope.logout = function() {
    Auth.logout();
  };

});