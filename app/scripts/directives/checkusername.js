'use strict';

app.directive('checkUsername', function($firebase, User) {
  var usernameRegexp = /^[^.$\[\]#\/\s]+$/;

  var controller = function() {};
  var linker = function(scope, elm, attrs, ctrl) {
      ctrl.$parsers.unshift(function(viewValue) {
        //Clear error messages if the field is empty
        if (viewValue.length === 0) {
          ctrl.$setValidity('taken', true);
          ctrl.$setValidity('invalid', true);
          return viewValue;
        }

        //If username fails the regex by containing invalid symbols
        if (!usernameRegexp.test(viewValue)) {
          ctrl.$setValidity('taken', true);
          ctrl.$setValidity('invalid', false);

          return undefined;
        }
        User.findByUsername(viewValue).on('value', function(snapshot) {
          var exists = snapshot.val() !== null;

          if (exists) {
            ctrl.$setValidity('taken', false);
            ctrl.$setValidity('invalid', true);

            return undefined;
          } else {
            ctrl.$setValidity('taken', true);
            ctrl.$setValidity('invalid', true);

            return viewValue;
          }
        });
      });
  };

  return {
    require: 'ngModel',
    link: linker
  };
});