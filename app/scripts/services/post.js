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
          $firebase(ref).$set("postId", postId); //add postId as a key for easier access

          //need to grab a ref and $firebase it so I can use $set
          var userRef = User.findByUsername(user.username);
          var usersPosts = $firebase(userRef.child('posts'));
          usersPosts.$set(postId, postId);
          return postId;
        });
      }
    },
    find: function(postId) {
      return $firebase(ref.child(postId));
    },
    delete: function(post) {
      //check to see if user is owner
      //delete from user's list
      //delete from posts array
      if (!User.signedIn()) {return;} //must be signed in to delete
      var userObj = User.getCurrent(); //retrieve snapshot obj from $rootScope.currentUser

      //abort if user doesn't own post
      if (post.owner !== userObj.username) {return false;}

      //Remove the post from user's ownership in DB
      var remPostFromUser = function() {
        var userRef = User.findByUsername(userObj.username);
        $firebase(userRef.child('posts')).$remove(post.postId);
      };

      return posts.$remove(post).then(remPostFromUser);
    }
  };

  return Post;
});