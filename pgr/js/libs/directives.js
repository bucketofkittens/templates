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

      scope.$watch("workspace.user.points", function (newVal, oldVal, scope) {
        if(newVal && newVal > 0) {
          if(scope.centerTextDraw) {
            var stepY = 40;
            scope.centerTextDraw.text = scope.workspace.user.points;
            scope.centerTextDraw.y = stepY;
            scope.centerTextDraw.x = scope.centerTextDraw.getBounds().width/2;
            scope.dashboard.update();

            scope.drawCenterArc_(scope.dashboard, scope.dashboard_size);
          } else {
            scope.drawFullDashboard_();
          }
          
        }
      });

      scope.drawSegmentPoints_ = function(dashboard, dashboard_size, positions, images, specialPosition, dotCorruptions) {
          var container = new createjs.Container();
          var centerImg        = images[0];
          var centerDotImg        = images[1];

          if(specialPosition && specialPosition.x && specialPosition.y) {
              container.x = specialPosition.x;
              container.y = specialPosition.y;
          } else {
              container.x = dashboard_size.width/2-centerImg.width/2;
              container.y = dashboard_size.height/2-centerImg.height/2;
          }
          container.setBounds(positions.x, positions.y, centerImg.width, centerImg.height);

          var centerImgContainer = new createjs.Bitmap(centerImg);
          centerImgContainer.x = 0;
          centerImgContainer.y = 0;

          container.addChildAt(centerImgContainer, 0);
          dashboard.update();

          var centerImgDotContainer = new createjs.Bitmap(centerDotImg);
          centerImgDotContainer.x = dotCorruptions.x;
          centerImgDotContainer.y = dotCorruptions.y;

          if(dotCorruptions.angle) {
              centerImgDotContainer.rotation = dotCorruptions.angle;    
          }

          container.addChildAt(centerImgDotContainer, 1);

          dashboard.addChild(container);
          dashboard.update();
      } 

      scope.drawText_ = function(dashboard, dashboard_size, image) {
          var container = new createjs.Container();
          var centerImg        = image;

          container.x = dashboard_size.width/2-centerImg.width/2;
          container.y = dashboard_size.height/2-centerImg.height/2;
          container.setBounds(0, 0, centerImg.width, centerImg.height);

          var centerImgContainer = new createjs.Bitmap(centerImg);
          centerImgContainer.x = 3;
          centerImgContainer.y = -30;

          container.addChildAt(centerImgContainer, 0);
          dashboard.update();

          dashboard.addChild(container);
          dashboard.update();
      } 

      scope.drawCenterArc_ = function(dashboard, dashboard_size) {
        if(scope.workspace.user && scope.workspace.user.points) {
          var drawing = new createjs.Shape();
          var corruption = 90;
          var oneStep = 100000/360;
          drawing.graphics.beginStroke('red')
                          .setStrokeStyle(63)
                          .arc(
                            dashboard_size.width/2-100,
                            dashboard_size.height/2-103, 
                            149, 
                            degToRad(0+corruption), 
                            degToRad(scope.workspace.user.points/oneStep+corruption)
          );

          drawing.x = 100;
          drawing.y = 100;
          dashboard.addChild(drawing);
          dashboard.update();
        }
      }

      scope.drawCenter_ = function(dashboard, dashboard_size) {
          /**
           * Рисуем центральный круг
           * @type {createjs}
           */
          var circle = new createjs.Shape();
          var centerImg        = new Image();
          centerImg.src    = "/images/db1.png";

          centerImg.onload = function() {
              var container = new createjs.Container();
              container.x = dashboard_size.width/2-centerImg.width/2;
              container.y = dashboard_size.height/2-centerImg.height/2;
              container.setBounds(0, 0, centerImg.width, centerImg.height);

              var centerImgContainer = new createjs.Bitmap(centerImg);
              centerImgContainer.x = 0;
              centerImgContainer.y = 0;

              container.addChild(centerImgContainer);
              //scope.workspace.user.points
              
              var centerText = new createjs.Text("", "25px 'Helvetica Neue Light'", "#000000");
              if(scope.workspace.user && scope.workspace.user.points) {
                var stepY = 40;
                centerText.text = scope.workspace.user.points;
                centerText.y = stepY;
                centerText.x = centerText.getBounds().width/2;
              }

              //centerText.y = stepY;
              //centerText.x = centerText.getBounds().width/2;

              container.addChild(centerText);

              dashboard.addChild(container);
              dashboard.update();

              scope.centerTextDraw = centerText;
          };
      }

      scope.drawDashboard_ = function(dashboard, dashboard_size) {
            scope.drawCenter_(dashboard, dashboard_size);
            var manifest = [
                {src:"db22.png", id:"db2"},
                {src:"db22p.png", id:"db2p"},
                {src:"db3.png", id:"db3"},
                {src:"db3p.png", id:"db3p"},
                {src:"db-t.png", id:"dbt"}
            ];

            var preload = new createjs.LoadQueue(true, "/images/");
            preload.on("complete", function(event) {
                scope.drawSegmentPoints_(
                    dashboard, 
                    dashboard_size, 
                    {x: 0, y: 0}, 
                    [preload.getResult("db2"), preload.getResult("db2p")],
                    null,
                    {x: 9, y: 7}
                );
                scope.drawSegmentPoints_(
                    dashboard, 
                    dashboard_size, 
                    {x: 0, y: 0}, 
                    [preload.getResult("db3"), preload.getResult("db3p")],
                    {x: 200, y: 100},
                    {x: 9, y: 7}
                );
                scope.drawText_(dashboard, dashboard_size, preload.getResult("dbt"));
                scope.drawCenterArc_(dashboard, dashboard_size);
            });
            preload.loadManifest(manifest);
      }

      scope.drawFullDashboard_ = function() {
        scope.dashboard = new createjs.Stage("mydash_draw");
        scope.dashboard_size = { width: 1000, height: 700 };
        scope.drawDashboard_(scope.dashboard, scope.dashboard_size); 
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

