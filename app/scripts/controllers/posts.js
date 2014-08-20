'use strict';

app.controller('PostCtrl', function($scope) {
  $scope.post = {url: 'http://', title: ''};
  $scope.posts = [];


  $scope.submitPost = function () {
    console.log("submit post called");
    $scope.posts.push($scope.post);
    $scope.post = {url: 'http://', title: ''};

  };
  $scope.deletePost = function($index) {
    $scope.posts.splice($index, 1);
  };
});