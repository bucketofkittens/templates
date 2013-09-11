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
    scope: {
      paralaxValue: '=',
      paralaxUser: '='
    },
    restrict: 'A',
    link: function($scope, element, attrs) {
      /**
      $scope.testPosition = function() {
        var position = {
          x: $(window).width()/100*parseInt(getRandomInt(20, 70)),
          y: $(window).height()/100*parseInt(getRandomInt(20, 70))
        };

        var who = {
          left: $(".who").find("img").position().left,
          top: $(".who").find("img").position().top,
          width: $(".who").find("img").width(),
          height: $(".who").find("img").height()
        };

        var accept = true;
        if(!(position.x < who.left && position.x > who.left+who.width && position.y < who.top && position.y < who.top+who.height)) {
          //accept = false;
        }
        /*angular.forEach($scope.paralaxValue, function(value, key) {
          if(value != $scope.paralaxUser) {
            console.log(value);
          }
        });
        console.log(accept);
        if(accept != true) {
          position = $scope.testPosition();
        } 
        
        $scope.paralaxUser.position = {};
        $scope.paralaxUser.position.left = position.x;
        $scope.paralaxUser.position.top = position.y;
        $scope.paralaxUser.position.width = $(element).width();
        $scope.paralaxUser.position.height = $(element).height();

        return position;
      }
      $scope.$watch('paralaxUser', function(val) {
        var tmpImg = new Image();
        tmpImg.onload =  function() {
          $(element).attr("src", $scope.paralaxUser.user.avatar.full_path);
          
          var position = $scope.testPosition();

          $(element).animate({
            "left": position.x,
            "top": position.y
          }, 2000, function() {
            
          });

          
         };
        tmpImg.src = $scope.paralaxUser.user.avatar.full_path;
      });
      */
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
