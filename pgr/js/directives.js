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

      $("#main_leagues ul").css("height", $(window).height()*2).css("width", $(window).width());

      attrs.$observe('src', function (v) {
          $(element).addClass("rotate"); 
      });
      attrs.$observe('paralaxEnable', function (v) {
        if(attrs.paralaxEnable == "true") {
          var elements = $(".tags li");

          function setPostion() {
            var position = {
              x: parseInt(getRandomInt(0, 90)),
              y: parseInt(getRandomInt(0, 90))
            };

            return position;
          }

          var position = setPostion();

          $(element).css("left", position.x+"%");
          $(element).css("top", position.y+"%");
        } else { 
          if(!$scope.viewedUsers.currentIndex) {
            $scope.viewedUsers.currentIndex = 0;
          }
          if(!$scope.viewedUsers.cols) {
            $scope.viewedUsers.cols = 0;
          }
          if(!$scope.viewedUsers.calc) {
            $scope.viewedUsers.calc = 0;
          }
          
          var position = {
              x: $scope.viewedUsers.calc*cellsCount,
              y: $scope.viewedUsers.cols*cellsCount
          };
          
          $(element).css("left", position.x+"%");
          $(element).css("top", position.y+"%");

          $scope.viewedUsers.currentIndex += 1;
          $scope.viewedUsers.calc += 1;

          if($scope.viewedUsers.calc == cellsCount) {
            $scope.viewedUsers.calc = 0;
            $scope.viewedUsers.cols += 1;
          }

          if($scope.viewedUsers.currentIndex == userLength) {
            $scope.viewedUsers.currentIndex = 0;
            $scope.viewedUsers.cols = 0;
            $scope.viewedUsers.calc = 0;
          }
        }
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
