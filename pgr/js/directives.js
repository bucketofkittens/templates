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

pgrModule.directive('paralaxImage', function () {
  return {
    link: function($scope, element, attrs) {
      
      attrs.$observe('paralaxEnable', function (v) {
        if(attrs.paralaxEnable == "true") {
          var elements = $(".tags li");

          function setPostion() {
            var position = {
              x: parseInt(getRandomInt(0, 90)),
              y: parseInt(getRandomInt(10, 90))
            };

            return position;
          }

          var position = setPostion();

          $(element).css("left", position.x+"%");
          $(element).css("top", position.y+"%");
        } else {
          
          $(element).css("left", "0%");
          $(element).css("top", "0%");
        }
      });
    }
  } 
});

pgrModule.directive('leaguePosition', function () {
  return {
    link: function($scope, element, attrs) {
      attrs.$observe('selectedLeague', function (v) {
        console.log(attrs.selectedLeague);
      });
    }
  } 
});

pgrModule.directive('errSrc', function() {
  return {
    link: function(scope, element, attrs) {
      attrs.src = '';
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
