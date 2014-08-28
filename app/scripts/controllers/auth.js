'use strict';

app.controller('AuthCtrl',
    function ($scope, $location, Auth, User) {
      if (Auth.signedIn()) {
        $location.path('/');
      }

      $scope.$on('$firebaseSimpleLogin:login', function () {
        $location.path('/');
      });

      $scope.login = function () {
        //query for user, when that comes back, use the info to do the below login
        var userRef = User.findByUsername($scope.user.username);
        userRef.on('value', function(snapshot) {
          var usrObj = snapshot.val();
          usrObj.password = $scope.user.password;
          Auth.login(usrObj).then(function () {
            $location.path('/');
          }, function (error) {
            $scope.error = error.toString();
          });
        });
      };

      $scope.register = function () {
        var prom = Auth.register($scope.user);

        prom.then(function (authUser) {
          User.create(authUser, $scope.user.username);
          Auth.login($scope.user);
          $location.path('/');
        }, function (error) {
          $scope.error = error.toString();
        });
      };
    });