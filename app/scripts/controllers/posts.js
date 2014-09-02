'use strict';

app.controller('PostCtrl', function($scope, $location, Post) {
  $scope.post = {url: 'http://', title: ''};

  if ($location.path === '/') {
    $scope.posts = Post.all;
  }

  $scope.deletePost = function(post) {
    Post.delete(post);
  };
});