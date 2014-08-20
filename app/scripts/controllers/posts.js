'use strict';

app.controller('PostCtrl', function($scope, Post) {
  $scope.post = {url: 'http://', title: ''};
  $scope.posts = Post.get();

  $scope.submitPost = function () {
    Post.save($scope.post, function(ref) {
      $scope.posts[ref.name] = $scope.post;
      $scope.post = {url: 'http://', title: ''};
    });
  };

  $scope.deletePost = function(postuuid) {
    Post.delete({id: postuuid}, function() {
      delete $scope.posts[postuuid];
    });
  };
});