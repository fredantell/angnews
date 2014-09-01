'use strict';

app.factory('User', function ($firebase, FIREBASE_URL, $rootScope) {
  var ref = new Firebase(FIREBASE_URL);

  var users = $firebase(ref.child('users'));
  console.dir(users);

  var User = {
    findByUsername: function (username) {
      if (username) {
        return users.$ref().child(username);
      }
    },
    setCurrentUser: function (username) {
      if (username === null) {return delete $rootScope.currentUser;}
      User.findByUsername(username).on('value', function(snapshot) {
        $rootScope.currentUser = snapshot.val();
      });
    },
    signedIn: function () {
      return $rootScope.currentUser ? true : false;
    },
    getCurrent: function() {
      return $rootScope.currentUser;
    },
    create: function (authUser, username) {

      users[username] = {
        md5_hash: authUser.md5_hash,
        username: username,
        email: authUser.email
      };
      users.$set(username, users[username])
          .then(function() {
            User.setCurrentUser(username);
          });
    }

  };

  return User;
});