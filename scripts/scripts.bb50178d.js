"use strict";var app=angular.module("angNewsApp",["ngAnimate","ngCookies","ngResource","ngRoute","ngSanitize","ngTouch","firebase"]);app.constant("FIREBASE_URL","https://luminous-heat-8461.firebaseio.com/"),app.config(["$routeProvider",function(a){a.when("/",{templateUrl:"views/posts.html",controller:"PostCtrl"}).when("/posts/:postId",{templateUrl:"views/showpost.html",controller:"PostViewCtrl"}).when("/users/:username",{templateUrl:"views/showuser.html",controller:"UserViewCtrl"}).when("/register",{templateUrl:"views/register.html",controller:"AuthCtrl"}).when("/login",{templateUrl:"views/login.html",controller:"AuthCtrl"}).otherwise({redirectTo:"/"})}]),app.controller("PostCtrl",["$scope","$location","Post",function(a,b,c){a.post={url:"http://",title:""},"/"===b.path()&&(a.posts=c.all),a.deletePost=function(a){c.delete(a)}}]),app.controller("PostViewCtrl",["$scope","$location","$routeParams","Post","Comment",function(a,b,c,d,e){a.post=d.find(c.postId).$asObject(),a.addComment=function(){e.create(c.postId,a.comment.text),a.comment=""},a.deleteComment=function(a){e.delete(c.postId,a),b.path("/posts/"+c.postId)}}]),app.controller("NavCtrl",["$scope","$location","Post","Auth",function(a,b,c,d){a.post={url:"http://",title:""},a.submitPost=function(){c.create(a.post).then(function(c){a.post={url:"http://",title:""},b.path("/posts/"+c)})},a.signedIn=function(){return d.signedIn()},a.logout=function(){d.logout()}}]),app.controller("AuthCtrl",["$scope","$location","Auth","User",function(a,b,c,d){c.signedIn()&&b.path("/"),a.$on("$firebaseSimpleLogin:login",function(){b.path("/")}),a.login=function(){var e=d.findByUsername(a.user.username);e.on("value",function(d){var e=d.val();e.password=a.user.password,c.login(e).then(function(){b.path("/")},function(b){a.error=b.toString()})})},a.register=function(){var e=c.register(a.user);e.then(function(e){d.create(e,a.user.username),c.login(a.user),b.path("/")},function(b){a.error=b.toString()})}}]),app.controller("UserViewCtrl",["$scope","$routeParams","$firebase","Comment","User","Post",function(a,b,c,d,e,f){function g(b){a.posts={},a.commentedPosts={},angular.forEach(b,function(b){a.posts[b]=f.find(b).$asObject()})}function h(){a.comments={},angular.forEach(a.user.comments,function(b){var d=f.find(b.postId);d.$ref().on("value",function(e){a.comments[b.commentId]=c(d.$ref().child("comments").child(b.commentId)).$asObject(),a.commentedPosts[b.postId]=e.val()})})}e.findByUsername(b.username).on("value",function(b){a.user=b.val(),g(a.user.posts),h(a.user.comments)}),a.commentedPosts={}}]),app.factory("Post",["$firebase","FIREBASE_URL","User",function(a,b,c){var d=new Firebase(b+"posts"),e=a(d).$asArray(),f={all:e,create:function(b){if(c.signedIn()){var d=c.getCurrent();return b.owner=d.username,e.$add(b).then(function(b){var e=b.name();a(b).$set("postId",e);var f=c.findByUsername(d.username),g=a(f.child("posts"));return g.$set(e,e),e})}},find:function(b){return a(d.child(b))},"delete":function(b){if(c.signedIn()){var d=c.getCurrent();if(b.owner!==d.username)return!1;var f=function(){var e=c.findByUsername(d.username);a(e.child("posts")).$remove(b.postId)};return e.$remove(b).then(f)}}};return f}]),app.factory("Auth",["$firebaseSimpleLogin","FIREBASE_URL","$rootScope","User",function(a,b,c,d){var e=new Firebase(b),f=a(e),g={register:function(a){return f.$createUser(a.email,a.password)},signedIn:function(){return c.currentUser?!0:!1},getCurrent:function(){return c.currentUser},login:function(a){var b=f.$login("password",a);return b.then(function(){d.setCurrentUser(a.username)}),b},logout:function(){f.$logout(),d.setCurrentUser(null)}};return c.signedIn=function(){return g.signedIn()},g}]),app.factory("User",["$firebase","FIREBASE_URL","$rootScope",function(a,b,c){var d=new Firebase(b),e=a(d.child("users"));console.dir(e);var f={findByUsername:function(a){return a?e.$ref().child(a):void 0},setCurrentUser:function(a){return null===a?delete c.currentUser:void f.findByUsername(a).on("value",function(a){c.currentUser=a.val()})},signedIn:function(){return c.currentUser?!0:!1},getCurrent:function(){return c.currentUser},create:function(a,b){e[b]={md5_hash:a.md5_hash,username:b,email:a.email},e.$set(b,e[b]).then(function(){f.setCurrentUser(b)})}};return f}]),app.factory("Comment",["$firebase","User","Post",function(a,b,c){function d(d,e){var f=b.getCurrent().username,g=c.find(d).$ref().child("comments"),h=b.findByUsername(f).child("comments"),i={text:e,postId:d,username:f};return a(g).$push(i).then(function(b){a(b).$set("commentId",b.name()),a(h).$set(b.name(),i).then(function(b){a(b).$set("commentId",b.name())})})}var e={create:function(a,c){return b.signedIn()?void d(a,c):!1},"delete":function(d,e){var f=b.getCurrent().username,g=c.find(d).$ref().child("comments"),h=b.findByUsername(f).child("comments");return a(g).$remove(e).then(function(){a(h).$remove(e)})},getCommentsByUsername:function(c){var d=b.findByUsername(c).child("comments");return a(d).$asArray()}};return e}]),app.directive("checkUsername",["$firebase","User",function(a,b){var c=/^[^.$\[\]#\/\s]+$/,d=function(a,d,e,f){f.$parsers.unshift(function(a){return 0===a.length?(f.$setValidity("taken",!0),f.$setValidity("invalid",!0),a):c.test(a)?void b.findByUsername(a).on("value",function(b){var c=null!==b.val();return c?(f.$setValidity("taken",!1),void f.$setValidity("invalid",!0)):(f.$setValidity("taken",!0),f.$setValidity("invalid",!0),a)}):(f.$setValidity("taken",!0),void f.$setValidity("invalid",!1))})};return{require:"ngModel",link:d}}]),app.filter("hostnameFromUrl",function(){return function(a){var b=document.createElement("a");return b.href=a,b.hostname}});