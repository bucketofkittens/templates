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
      var userLength = $scope.viewedUsers.length;
      var cellsCount = 10;
      var step = 2;

      if($(window).width() < 1100) {
        step = 1.5;
      }
      
      attrs.$observe('src', function (v) {
          $(element).addClass("rotate"); 
      });
      attrs.$observe('paralaxEnable', function (v) {
        var elements = $(".tags li");

        function setPostion() {
          var position = {
            x: parseInt(getRandomInt(0, $(window).width()-100)),
            y: parseInt(getRandomInt(0, $(window).height()*2-100))
          };
           return position;
        }

        var position = setPostion(0);
        $(element).css("left", position.x+"px");
        $(element).css("top", position.y+"px");

        $("#main_leagues ul").css("height", $(window).height()*step).css("width", $(window).width());
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
