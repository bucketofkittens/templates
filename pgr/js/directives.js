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

pgrModule.directive('backImg', function() {
  return {
    link: function(scope, element, attrs) {
      element.css({
          'background-image': 'url(' + attrs.backImg +')',
          'background-size' : '100% 100%'
      });
    }
  }
})

pgrModule.directive('setWidth', function() {
  return {
    link: function(scope, element, attrs) {
      var getSize = 0;
      var pElement = $(element).parent().parent();
      var parentElement = $(element).parent();
      getSize = pElement.height() / 2;

      if(
        !scope.userItem.league || 
        scope.userItem.league.name == "10" ||
        scope.userItem.league.name == "9" ||
        scope.userItem.league.name == "8") {
        getSize = pElement.height() / 6;
      }

      if(
        scope.userItem.league.name == "7" || 
        scope.userItem.league.name == "6" ||
        scope.userItem.league.name == "5") {
        getSize = pElement.height() / 3;
      } 

      $(element).width(getSize);
      $(element).height(getSize);

      $(element).parent().width(getSize);
      $(element).parent().height(getSize);

      scope.$watch("userItem.hover", function() {
        if(scope.userItem.hover) {
          var newSize = $(element).height()*1.5;
          var oldSize = $(element).height();
          var parentElement = $(element).parent();
          var delta = (oldSize-newSize)/2;

          $(element).width(newSize);
          $(element).height(newSize);

          parentElement.width(newSize);
          parentElement.height(newSize);

          parentElement.css("left", delta);
          parentElement.css("top", delta);

          if(parentElement.offset().left < newSize / 2) {
            parentElement.css("left", newSize/2);
          }
          if(parentElement.offset().left + newSize > $(window).width()) {
            parentElement.css("left", "-"+newSize/2+"px");
          }

          scope.userItem.isUpdateSize = true;
        } else {
          if(scope.userItem.isUpdateSize) {
            var newSize = $(element).height()/1.5;
            var parentElement = $(element).parent();

            $(element).width(newSize);
            $(element).height(newSize);

            parentElement.width(newSize);
            parentElement.height(newSize);  

            parentElement.css("left", 0);
            parentElement.css("top", 0);
          }
        }
      });
    }
  }
})