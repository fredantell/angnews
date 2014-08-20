'use strict';

app.factory('Post', function ($resource) {
  return $resource('https://luminous-heat-8461.firebaseio.com/posts/:id.json');
});