'use strict';

app.factory('Comment', function($firebase, User, Post) {

  function linkCommentToPostAndUser(postId, comment) {
    var postCommentsRef = Post.find(postId).$ref().child('comments');
    var userCommentsRef = User.findByUsername(User.getCurrent().username).child('comments');
    var commentObj = {comment: comment, postId: postId};

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
      linkCommentToPostAndUser(postId, comment);
    }
  };

  return Comment;
});