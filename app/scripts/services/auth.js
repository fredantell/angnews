'use strict';

app.factory('Auth',
    function ($firebaseSimpleLogin, FIREBASE_URL, $rootScope, User) {
      var ref = new Firebase(FIREBASE_URL);

      var auth = $firebaseSimpleLogin(ref);

      var Auth = {
        register: function (user) {
          return auth.$createUser(user.email, user.password);
        },
        signedIn: function () {
          return $rootScope.currentUser ? true : false;
        },
        getCurrent: function() {
          return $rootScope.currentUser;
        },
        login: function (user) {
          //var userRef = ref.child('users').child(user.username);
          var loginProm = auth.$login('password', user);
          loginProm.then(function(userObj){
            User.setCurrentUser(user.username);
          });
          return loginProm;
        },
        logout: function () {
          auth.$logout();
          User.setCurrentUser(null);
        }
      };

      $rootScope.signedIn = function () {
        return Auth.signedIn();
      };

      return Auth;
    });