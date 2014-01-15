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



pgrModule.directive('scroller', function($window) {
  return {
    link: function(scope, element, attrs) {
      var footerSize = 60;
      $(element).height($(window).height()-$(element).offset().top-footerSize);
      $(window).resize(function() {
        $(element).height($(window).height()-$(element).offset().top-footerSize);
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

pgrModule.directive('masonry', function() {
  return {
    link: function(scope, element, attrs) {
      scope.$on('addUsersToMasonry', function(event, message) {
        
      });

      scope.masonryContainer = document.querySelector('#masonry');
      scope.pckry = new Packery(scope.masonryContainer, {
          itemSelector: '.item',
          gutter: 0,
          isHorizontal: true,
          isInitLayout: false,
          isLayoutInstant: true,
          columnWidth: 70,
          rowHeight: 70
      });
      scope.pckry.layout();

      
    }
  }
})

pgrModule.directive('masonryItem', function() {
  return {
    link: function(scope, element, attrs) {
      scope.pckry.addItems(element[0]);
      scope.pckry.layout();

      setTimeout(function() {
        $(element).addClass("all");
      }, 2000);
    }
  }
})

pgrModule.directive('setWidth', function() {
  return {
    link: function(scope, element, attrs) {
      scope.$watch("userItem.big", function() {
        if(scope.userItem && scope.userItem.big) {

          var newSize = $(window).height()/100*30;
          var oldSize = $(element).height();
          var parentElement = $(element).parent();
          var delta = (oldSize-newSize)/2;

          $(element).width(newSize);
          $(element).height(newSize);

          parentElement.width(newSize);
          parentElement.height(newSize);

          parentElement.css("margin-left", delta);
          parentElement.css("margin-top", delta);

          if(parentElement.offset().left < newSize / 2) {
            parentElement.css("margin-left", 0);
          }
          if(parentElement.offset().top < newSize / 2) {
            parentElement.css("margin-top", 0);
          }
          if(parentElement.offset().top + newSize >  $(window).height()) {
            parentElement.css("margin-top", "-"+newSize/1.5+"px");
          }
          if(parentElement.offset().left + newSize > $(window).width()) {
            parentElement.css("margin-left", "-"+newSize/2+"px");
          }

          if(!scope.userItem.isUpdateSize) {
            scope.userItem.isUpdateSize = true;
            scope.userItem.oldSize =  oldSize;
          }
        } else {
          if(scope.userItem && scope.userItem.isUpdateSize) {

            var newSize = scope.userItem.oldSize;
            var parentElement = $(element).parent();

            $(element).width(newSize);
            $(element).height(newSize);

            parentElement.width(newSize);
            parentElement.height(newSize);  

            parentElement.css("margin-left", 0);
            parentElement.css("margin-top", 0);
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

