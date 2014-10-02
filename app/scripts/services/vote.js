'use strict';

app.factory('Vote', ['$firebase', 'FIREBASE_URL', 'User', 'Post', function($firebase, FIREBASE_URL, User, Post) {
  var postsRef = new Firebase(FIREBASE_URL + 'posts');
  var usersRef =new Firebase(FIREBASE_URL + 'users');

  var Vote = {
    upVote: function(postId) {
      //exit immediately if User isn't signed in.
      if (!User.signedIn()) {return;}

      var userRef = usersRef.child(User.getCurrent().username);
      var postRef = postsRef.child(postId);
      var userFire = $firebase(userRef).$asObject();
      var postFire = $firebase(postRef).$asObject();

      //On any vote:
      //1) Write to up/downvote on post under username key and value
      //2) Write to up/downvote on user under postId key and value
      //3) Remove the opposite vote from both post and user
      //4) Write to the post under score either adding or subtracting
      post.$child('upvotes').$child(user.username).$set(user.username).then(function () {
        user.$child('upvotes').$child(postId).$set(postId);
        post.$child('downvotes').$remove(user.username);
        user.$child('downvotes').$remove(postId);

        post.$child('score').$transaction(function (score) {
          if (!score) {
            return 1;
          }

          return score + 1;
        });
      });
    }
      },
      downVote: function (postId) {
    if (User.signedIn()) {
      var user = User.getCurrent();
      var post = posts.$child(postId);

      post.$child('downvotes').$child(user.username).$set(user.username).then(function () {
        user.$child('downvotes').$child(postId).$set(postId);
        post.$child('upvotes').$remove(user.username);
        user.$child('upvotes').$remove(postId);

        post.$child('score').$transaction(function (score) {
          if (score === undefined || score === null) {
            return -1;
          }

          return score - 1;
        });
      });
    }
  },
  clearVote: function (postId, upVoted) {
    if (User.signedIn()) {
      var user = User.getCurrent();
      var username = user.username;
      var post = posts.$child(postId);

      post.$child('upvotes').$remove(username);
      post.$child('downvotes').$remove(username);
      user.$child('upvotes').$remove(postId);
      user.$child('downvotes').$remove(postId);
      post.$child('score').$transaction(function (score) {
        if (upVoted) {
          return score - 1;
        } else {
          return score + 1;
        }
      });
    }
  },
  upVoted: function (post) {
    if (User.signedIn() && post.upvotes) {
      return post.upvotes.hasOwnProperty(User.getCurrent().username);
    }
  },
  downVoted: function (post) {
    if (User.signedIn() && post.downvotes) {
      return post.downvotes.hasOwnProperty(User.getCurrent().username);
    }
  }

  return Vote;
}]);