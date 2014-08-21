'use strict';

app.controller('AuthCtrl',
    function ($scope, $location, Auth) {
      if (Auth.signedIn()) {
        $location.path('/');
      }

      $scope.$on('$firebaseSimpleLogin:login', function () {
        $location.path('/');
      });

      $scope.login = function () {
        Auth.login($scope.user).then(function () {
          $location.path('/');
        }, function (error) {
          $scope.error = error.toString();
        })
      };

      $scope.register = function () {
        //returns {} with createUser and user keys
        //do this so we have easy access to obj.user
        //for logging in after successful registration
        var obj = Auth.register($scope.user);

        obj.createUser.then(function (authUser) {
          Auth.login(obj.user);
          $location.path('/');
        }, function (error) {
          $scope.error = error.toString();
        });
      };
    });