'use strict';

app.factory('Comment', function($firebase, User, Post) {

  function linkCommentToPostAndUser(postId, comment) {
    var username = User.getCurrent().username;
    var postCommentsRef = Post.find(postId).$ref().child('comments');
    var userCommentsRef = User.findByUsername(username).child('comments');
    var commentObj = {text: comment, postId: postId, username: username};

    return $firebase(postCommentsRef).$push(commentObj).then(function(ref) {
      //add uuid for comment to object
      $firebase(ref).$set('commentId', ref.name());

      //associate same comment obj with user
      $firebase(userCommentsRef).$set(ref.name(), commentObj).then(function(ref) {
        $firebase(ref).$set('commentId', ref.name());
      });
    });
  }

  var Comment = {
    create: function(postId, comment) {
      if (!User.signedIn()) {return false;}  //only proceed if user is signed in
      linkCommentToPostAndUser(postId, comment);
    },
    delete: function(postId, commentId) {
      //will need to delete the comment from the post as well as the user
      //get postId from $routeParams
      //get commentId from ng-repeat html anchor
      var username = User.getCurrent().username;
      var postCommentsRef = Post.find(postId).$ref().child('comments');
      var userCommentsRef = User.findByUsername(username).child('comments');

      return $firebase(postCommentsRef).$remove(commentId).then(function(ref) {
        $firebase(userCommentsRef).$remove(commentId);
      });
    },
    getCommentsByUsername: function(username) {
      var userCommentsRef = User.findByUsername(username).child('comments');
      return $firebase(userCommentsRef).$asArray();
    }
  };

  return Comment;
});