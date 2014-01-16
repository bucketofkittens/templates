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

pgrModule.directive('mydash', function() {
  return {
    link: function(scope, element, attrs) {
      scope.centerTextDraw = null;
      scope.db2Draw = null;

      scope.updatePointText_ = function() {
        if(scope.workspace.user && scope.workspace.user.points) {
          scope.centerTextDraw.setText(scope.workspace.user.points);
          scope.centerTextDraw.offsetY("-"+(scope.dashboard_size.height/2-30));
          scope.centerTextDraw.offsetX(scope.centerTextDraw.width()/2);

          scope.centerTextDraw.getLayer().draw();  
        }
      }

      scope.$watch("workspace.user.points", function (newVal, oldVal, scope) {
        if(newVal && newVal > 0) {
          if(scope.centerTextDraw) {
            scope.updatePointText_();
          } else {
            scope.drawFullDashboard_();
          }
          
          scope.drawCenterArc_(scope.db2Draw);
        }
      });

      scope.drawSegmentPoints_ = function(positions, images, specialPosition, dotCorruptions) {
          var containerParams = {
            x: specialPosition ? specialPosition.x : scope.dashboard_size.width/2-images[0].width/2,
            y: specialPosition ? specialPosition.y : scope.dashboard_size.height/2-images[0].height/2,
            width: images[0].width,
            height: images[0].height
          };
          var container = new Kinetic.Layer(containerParams);

          var centerImgContainer =  new Kinetic.Image({
              image: images[0],
              x: 0,
              y: 0,
              name: "image1"
          });

          var centerImgDotContainer = new Kinetic.Image({
              image: images[1],
              x: dotCorruptions ? dotCorruptions.x : 0,
              y: dotCorruptions ? dotCorruptions.y : 0,
              name: "image2"
          });

          container.add(centerImgContainer);
          container.add(centerImgDotContainer);

          centerImgContainer.setZIndex(0);
          centerImgDotContainer.setZIndex(2);

          scope.dashboard.add(container);

          return container;
      } 

      scope.drawText_ = function(image) {
          var containerParams = {
            x: scope.dashboard_size.width/2-image.width/2,
            y: scope.dashboard_size.height/2-image.height/2,
            width: image.width,
            height: image.height
          };
          var container = new Kinetic.Layer(containerParams);

          var centerImgContainer =  new Kinetic.Image({
              image: image,
              x: 3,
              y: -30,
              name: "image4"
          });

          container.add(centerImgContainer);
          scope.dashboard.add(container);
      } 

      scope.drawCenterArc_ = function(container) {
        if(scope.workspace.user && scope.workspace.user.points && container) {
          var corruption = 90;
          var oneStep = 100000/360;
          var newAngle = degToRad(scope.workspace.user.points/oneStep+corruption);
          var baseAngle = degToRad(0+corruption);

          var arc = new Kinetic.Shape({
              drawFunc: function(context) {
                var x = scope.dashboard.getWidth()/2-315;
                var y = scope.dashboard.getHeight()/2-167;
                var radius = 149;
                var startAngle = baseAngle;
                var endAngle = newAngle;
                context.beginPath();
                context.arc(x, y, radius, startAngle, endAngle);
                context.fillStrokeShape(this);
            },
            stroke: 'c0d2e9',
            strokeWidth: 63
          });

          container.add(arc);

          arc.setZIndex(1);
          
          container.draw();
        }
      }

      scope.drawCenter_ = function(image) {
          var container = new Kinetic.Layer();

          var centerImgContainer = new Kinetic.Image({
              image: image,
              x: scope.dashboard_size.width/2-image.width/2,
              y: scope.dashboard_size.height/2-image.height/2,
              name: "image"
          });

          container.add(centerImgContainer);
          
          var centerText = new Kinetic.Text({
            text: '',
            fontSize: 25,
            fontFamily: 'Helvetica Neue Light',
            fill: '#000000',
            x: scope.dashboard_size.width/2
          });

          container.add(centerText);
          scope.dashboard.add(container);

          scope.centerTextDraw = centerText;
          scope.pointsLayer = container;

          scope.updatePointText_();
      }

      scope.drawDashboard_ = function() {
            var manifest = [
                {src:"db22.png", id:"db2"},
                {src:"db22p.png", id:"db2p"},
                {src:"db3.png", id:"db3"},
                {src:"db3p.png", id:"db3p"},
                {src:"db-t.png", id:"dbt"},
                {src:"db1.png", id:"db"}
            ];

            var preload = new createjs.LoadQueue(true, "/images/");
            preload.on("complete", function(event) {
                scope.drawCenter_(preload.getResult("db"));

                var cont = scope.drawSegmentPoints_( 
                    {x: 0, y: 0}, 
                    [preload.getResult("db2"), preload.getResult("db2p")],
                    null,
                    {x: 9, y: 7}
                );
                scope.db2Draw = cont;
                scope.drawSegmentPoints_(
                    {x: 0, y: 0}, 
                    [preload.getResult("db3"), preload.getResult("db3p")],
                    {x: 200, y: 100},
                    {x: 9, y: 7}
                );
                scope.drawText_(preload.getResult("dbt"));
                scope.drawCenterArc_(cont);
            });
            preload.loadManifest(manifest);
      }

      scope.drawFullDashboard_ = function() {
        scope.dashboard = new Kinetic.Stage({
          container: 'mydash_draw',
          width: 1000,
          height: 700
        });
        scope.dashboard_size = { width: 1000, height: 700 };
        scope.drawDashboard_(); 
      }

      $(window).on("load", function() {
        if(!scope.dashboard) {
          scope.drawFullDashboard_();
        }
      });

      $(document).ready(function() {
        if(!scope.dashboard) {
          scope.drawFullDashboard_(); 
        }
      });
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

