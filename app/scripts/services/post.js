'use strict';

app.factory('Post', function ($firebase, FIREBASE_URL, User) {
  var ref = new Firebase(FIREBASE_URL + 'posts');

  var posts = $firebase(ref).$asArray();

  var Post = {
    all: posts,
    create: function(post) {
      if (User.signedIn()) {
        var user = User.getCurrent();
        post.owner = user.username;

        return posts.$add(post).then(function (ref) {
          var postId = ref.name();

          //not setting my currentUser to a ref like this line assumes.
          //It's set to a snapshot of the user object in the backend under users/
          var userRef = User.findByUsername(user.username);
          var usersPosts = $firebase(userRef.child('posts'));
          usersPosts.$set(postId, postId);
          //user.$child('posts').$child(postId).$set(postId); // Will def break! :)
          return postId;
        });
      }
    },
    find: function(postId) {
      return $firebase(ref.child(postId)).$asObject();
    },
    delete: function(post) {
      return posts.$remove(post);
    }
  };

  return Post;
});