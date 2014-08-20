'use strict';

app.controller('PostCtrl', function($scope, Post) {
  $scope.post = {url: 'http://', title: ''};
  $scope.posts = Post.all;

  $scope.submitPost = function () {
    Post.create($scope.post).
        then(function() {
            $scope.post = {url: 'http://', title: ''};
        });
  };

  $scope.deletePost = function(post) {
    Post.delete(post);
  };
});