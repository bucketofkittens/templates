/**
 * Директива для валидации паролей.
 * Кривая как моя жизнь, зато работает
 * @return {[type]} [description]
 */
pgrModule.directive('sameAs', [function() {
  return {
    require: 'ngModel',
    link: function(scope, elm, attrs, ctrl) {
      ctrl.$parsers.unshift(function(viewValue) {
        if (viewValue === scope[attrs.sameAs].password) {
          ctrl.$setValidity('sameAs', true);
          return viewValue;
        } else {
          ctrl.$setValidity('sameAs', false);
          return undefined;
        }
      });
    }
  };
}]);

pgrModule.directive('paralaxImage', function ($parse) {
     return function($scope, element, attrs) {
        attrs.$observe('src', function(val){
          var position = {
            x: getRandomInt(20, 70)+"%",
            y: getRandomInt(20, 70)+"%"
          }
          $(element).animate({
            "left": position.x,
            "top": position.y
          }, 2000)
        });
    }
});

pgrModule.directive('errSrc', function() {
  return {
    link: function(scope, element, attrs) {
      scope.$watch(attrs.src, function (newVal, oldVal, scope) {
        if(!attrs.src) {
          element.attr('src', attrs.errSrc);
        }
      });
    }
  }
});

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
