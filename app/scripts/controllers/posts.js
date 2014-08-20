'use strict';

app.controller('PostCtrl', function($scope, $location, Post) {
  $scope.post = {url: 'http://', title: ''};
  $scope.posts = Post.all;

  $scope.submitPost = function () {
    Post.create($scope.post).
        then(function(ref) {
          $scope.post = {url: 'http://', title: ''};
          $location.path('/posts/' + ref.name());
        });
  };

  $scope.deletePost = function(post) {
    Post.delete(post);
  };
});