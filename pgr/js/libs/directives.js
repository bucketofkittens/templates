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

pgrModule.directive('disablePaste', function() {
  return {
    link: function(scope, element, attrs) {
    }
  }
});



pgrModule.directive('positionGoal', function() {
  return {
    link: function(scope, element, attrs) {
      scope.$watch("goalItem.current_value", function (newVal, oldVal, scope) {
        if(scope.goalItem.current_value) {
          $(element).width(scope.goalItem.current_value / (scope.goalItem.points_summary )*100+"%");
        }
      });
    }
  }
});

pgrModule.directive('positionNeed', function() {
  return {
    link: function(scope, element, attrs) {
      scope.$watch("needItem.current_value", function (newVal, oldVal, scope) {
        if(scope.needItem.current_value) {
          $(element).width(scope.needItem.current_value / (scope.needItem.points_summary )*100+"%");
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

pgrModule.directive('bridge', function($window) {
  return {
    link: function(scope, element, attrs) {
      setInterval(function() {
        var currentItem = $("#content .tab .mypro.acrd .crits ul li h5.current");

        if(currentItem.size() > 0) {
          $(element).show();
          $(element).css("top",$(currentItem).offset().top-71);
          $(element).css("height",58);
          $(element).css("left", 260);
          if($(currentItem).offset().top < 120) {
            $(element).hide();
          } else {
            $(element).show();
          }
        } else {
          $(element).hide();
        }
      }, 10);
    }
  }
})

pgrModule.directive('icheck', function($window) {
  return {
    link: function(scope, element, attrs) {
      $(element).iCheck({
        checkboxClass: 'icheckbox_minimal'
      });
    }
  }
})

pgrModule.directive('caruselPosition', function($window) {
  return {
    link: function(scope, element, attrs) {
      scope.$watch("position", function (newVal, oldVal, scope) {
        $(element).css("left", "-"+60*scope.position+"px");
      });
    }
  }
})

pgrModule.directive('setWidth', function() {
  return {
    priority: 0,
    link: function(scope, element, attrs) {
      $(".gallery").height($(window).height() - 115);
      $(".gallery > div").height($(window).height() - 115);
      var getSize = 0;
      var pElement = $(element).parent().parent();
      var parentElement = $(element).parent();
      getSize = pElement.height() / 3;

      if(scope.userItem.league) {
        if(
          !scope.userItem.league || 
          scope.userItem.league.name == "10" ||
          scope.userItem.league.name == "9" ||
          scope.userItem.league.name == "8") {
          getSize = getSize / 3;
        }

        if(
          scope.userItem.league.name == "7" || 
          scope.userItem.league.name == "6" ||
          scope.userItem.league.name == "5") {
          getSize = getSize / 3 * 2;
        }
      }

      $(element).width(getSize);
      $(element).height(getSize);

      parentElement.width(getSize);
      parentElement.height(getSize);

      setTimeout(function() {
        parentElement.addClass("show");
        pElement.isotope( 'insert', parentElement);
      }, randomRange(100, 500));

      scope.$watch("userItem.hover", function() {
        if(scope.userItem.hover) {
          var newSize = $(window).height()/100*30;
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
            parentElement.css("left", 0);
          }
          if(parentElement.offset().top < newSize / 2) {
            parentElement.css("top", 0);
          }
          if(parentElement.offset().top + newSize >  $(window).height()) {
            parentElement.css("top", "-"+newSize/1.5+"px");
          }
          if(parentElement.offset().left + newSize > $(window).width()) {
            parentElement.css("left", "-"+newSize/2+"px");
          }

          if(!scope.userItem.isUpdateSize) {
            scope.userItem.isUpdateSize = true;
            scope.userItem.oldSize =  oldSize;
          }
        } else {
          if(scope.userItem.isUpdateSize) {
            var newSize = scope.userItem.oldSize;
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

pgrModule.directive('setWidthSmall', function() {
  return {
    link: function(scope, element, attrs) {
      scope.$watch("userItem.hover", function() {
        if(scope.userItem.hover) {
          //$(element).clone().addClass("clone").insertAfter($(element));
        } else {
          //$(".clone").remove();
        }
      });
    }
  }
})

function randomRange(l,h){
  var range = (h-l);
  var random = Math.floor(Math.random()*range);
  if (random === 0){random+=1;}
  return l+random;
}

(function(angular) {
    'use strict';
    
    var INTERVAL_DELAY = 150;
  
    angular.module('ngScrollEvent', [])
    .directive('ngScrollEvent', ['$parse', '$window', function($parse, $window) {
        return function(scope, element, attr) {
          var fn = $parse(attr.ngScrollEvent);
    
            var interval,
            handler,
            el = element[0],
            scrollEvent = 'scroll',
            scrollPosition = {
                x: 0,
                y: 0
            };
    
            var bindScroll = function() {
                handler = function(event) {
                    scrollPosition.x = el.scrollLeft;
                    scrollPosition.y = el.scrollTop;
    
                    startInterval(event);
                    unbindScroll();
                    scrollTrigger(event, false);
                };

                element.bind(scrollEvent, handler);
            };
    
            var startInterval = function(event) {
                interval = $window.setInterval(function() {
                    if(scrollPosition.x == el.scrollLeft && scrollPosition.y == el.scrollTop) {
                        $window.clearInterval(interval);
                        bindScroll();
                        scrollTrigger(event, true);
                    } else {
                        scrollPosition.x = el.scrollLeft;
                        scrollPosition.y = el.scrollTop;
                    }
                }, INTERVAL_DELAY);
            };
    
            var unbindScroll = function() {
                // be nice to others, don't unbind their scroll handlers
                element.unbind(scrollEvent, handler);
            };
    
            var scrollTrigger = function(event, isEndEvent) {
                scope.$apply(function() {
                  fn(scope, {$event: event, isEndEvent: isEndEvent});
                });
            };
    
            bindScroll();
        };
    }]);
})(angular);