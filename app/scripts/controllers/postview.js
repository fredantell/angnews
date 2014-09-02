'use strict';

app.controller('PostViewCtrl', function($scope, $location, $routeParams, Post, Comment) {
  $scope.post = Post.find($routeParams.postId).$asObject();
  $scope.addComment = function() {
    Comment.create($routeParams.postId, $scope.comment.text);
    $scope.comment = '';
  };
  $scope.deleteComment = function(commentId) {
    Comment.delete($routeParams.postId, commentId);
    $location.path('/posts/' + $routeParams.postId);
  };
});