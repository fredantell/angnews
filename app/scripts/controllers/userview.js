'use strict';

app.controller('UserViewCtrl', function($scope, $routeParams, $firebase, Comment, User, Post) {
  User.findByUsername($routeParams.username).on('value', function (snapshot) {
    $scope.user = snapshot.val();
    populatePosts($scope.user.posts);
    populateComments($scope.user.comments);
  });
 // $scope.comments = Comment.getCommentsByUsername($routeParams.username);
  $scope.commentedPosts = {};

  function populatePosts(postIDs) {
    $scope.posts = {};
    $scope.commentedPosts = {};
    
    angular.forEach(postIDs, function (postID) {
      $scope.posts[postID] = Post.find(postID).$asObject();
    });
  }

  function populateComments(comments) {
    $scope.comments = {};

    angular.forEach($scope.user.comments, function (comment) {
      var post = Post.find(comment.postId);

      post.$ref().on('value', function (snapshot) {
        $scope.comments[comment.commentId] = $firebase(post.$ref().child('comments').child(comment.commentId)).$asObject();
        $scope.commentedPosts[comment.postId] = snapshot.val();
      });
    });
  }
});