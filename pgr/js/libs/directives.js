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

pgrModule.directive('masonry', function(User) {
  return {
    link: function($scope, element, attrs) {
      $scope.initIso = function() {
        $scope.masonryContainer = $('#masonry');
        $scope.masonryContainer.isotope({
          itemSelector: '.iso-item',
          rowHeight: 70,
          layoutMode: "perfectMasonry",
          perfectMasonry: {
              layout: 'horizontal',
              columnWidth: 70,
              rowHeight: 70
         }
        });  
      }

      $scope.getPublishedUser = function() {
        User.for_main_from_limit({limit: $scope.limit, skip: $scope.skip}, {}, function(data) {
            var newArray = [];
            angular.forEach(data, function(value, key) {
                value.points = parseInt(value.points);
                $scope.total_count = value.total_count;
                if(isNaN(value.points)) {
                    value.points = 0;
                }
                value.size = 280;
                if(!value.points || (value.points > 0 && value.points <= 30000)) {
                    value.size = 70;
                }
                if((value.points > 30000 && value.points <= 60000)) {
                    value.size = 140;
                }
                if((value.points > 60000 && value.points <= 80000)) {
                    value.size = 210;
                }
                value.size += "px";
                newArray.push(value);
            });
            newArray.shuffle();
            $scope.users = $scope.users.concat(newArray);

            $scope.view_count += $scope.limit;
            var isiPad = navigator.userAgent.match(/iPad/i) != null;
            if(isiPad) {
                $scope.total_count = 60;
            }
            if($scope.view_count < $scope.total_count) {
                $scope.skip += $scope.limit;
                $scope.getPublishedUser();
            } else {

            }
        });
      }

      /**
       * Забираем список пользователей
       */
      $scope.getPublishedUser();
      $scope.initIso();
    }

    
  }
})

pgrModule.directive('masonryItem', function() {
  return {
    link: function(scope, element, attrs) { 
      imagesLoaded(element, function( instance ) {
        setTimeout(function() {
          $(element).addClass("iso-item");
          scope.masonryContainer.isotope("insert", $(element));
        }, randomRange(1000, 3000));
        setTimeout(function() {
          $(element).addClass("all");
        }, 5000);
      });
    }
  }
})

pgrModule.directive('mydash', function(User) {
  return {
    link: function(scope, element, attrs) {
      scope.centerTextDraw = null;
      scope.db2Draw = null;
      scope.needsLine = [];
      scope.carreeMax = 0;

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

          if(scope.workspace.user && scope.workspace.needs && scope.workspace.needs.length > 0) {
            scope.setNeeds();
          }
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
          centerImgDotContainer.setZIndex(3);

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
          var baseAngle = degToRad(corruption);

          var centerRX = scope.dashboard.getWidth()/2-316;
          var centerRY = scope.dashboard.getHeight()/2-167;
          var endX = centerRX + Math.cos(newAngle) * 149;
          var endY = centerRY + Math.sin(newAngle) * 149;

          var arc = new Kinetic.Shape({
              drawFunc: function(context) {
                var ctx = context.canvas.getContext()._context;
                var x = centerRX;
                var y = centerRY;
                var radius = 149;
                var startAngle = baseAngle;
                var endAngle = newAngle;

                var gradient = context.createLinearGradient(
                  endX, 
                  endY,
                  scope.dashboard.getWidth()/2-316,
                  scope.dashboard.getHeight()/2-167
                );
                gradient.addColorStop(0, '#3e445c');
                gradient.addColorStop(1, '#c1d3ea');

                ctx.beginPath();
                ctx.arc(x, y, radius, startAngle, endAngle, false);
                ctx.strokeStyle = gradient;
                ctx.lineWidth = 61;
                ctx.stroke();
                ctx.closePath();
                ctx.beginPath();
                ctx.moveTo(centerRX + Math.cos(newAngle-0.02) * 149, centerRY + Math.sin(newAngle-0.02) * 149);
                ctx.lineTo(centerRX + Math.cos(newAngle+0.1) * 149,centerRY + Math.sin(newAngle+0.1) * 149);
                ctx.lineTo(centerRX + Math.cos(newAngle) * 180,centerRY + Math.sin(newAngle) * 180);
                ctx.fillStyle = gradient;
                ctx.strokeStyle = gradient;
                ctx.lineWidth = 2;
                ctx.stroke();
                ctx.fill();
                ctx.closePath();
                ctx.beginPath();
                ctx.moveTo(centerRX + Math.cos(newAngle-0.02) * 149, centerRY + Math.sin(newAngle-0.02) * 149);
                ctx.lineTo(centerRX + Math.cos(newAngle+0.1) * 149,centerRY + Math.sin(newAngle+0.1) * 149);
                ctx.lineTo(centerRX + Math.cos(newAngle) * 120,centerRY + Math.sin(newAngle) * 120);
                ctx.fillStyle = gradient;
                ctx.strokeStyle = gradient;
                ctx.lineWidth = 2;
                ctx.stroke();
                ctx.fill();
                ctx.closePath();
            },
          });

          container.add(arc);
          arc.setZIndex(1);
          container.draw();
        }
      }

      scope.drawNeed_ = function(container, params) {
        if(container) {
          var corruption = params.corruption;
          var radius =  params.radius;
          var oneStep =  params.need_max/params.segment;
          if(params.need_max - params.need_value < 500) {
            var oneStep =  params.need_max/params.segmentMax;
          }
          var newAngle = degToRad(params.need_value/oneStep+corruption);
          var baseAngle = degToRad(corruption);

          var centerRX = scope.dashboard.getWidth()/2-params.centerX;
          var centerRY = scope.dashboard.getHeight()/2-params.centerY;
          var endX = centerRX + Math.cos(newAngle) * radius;
          var endY = centerRY + Math.sin(newAngle) * radius;

          var arc = new Kinetic.Shape({
              drawFunc: function(context) {
                var ctx = context.canvas.getContext()._context;
                var x = centerRX;
                var y = centerRY;
                var startAngle = baseAngle;
                var endAngle = newAngle;
                var gradient = context.createLinearGradient(
                  centerRX + Math.cos(newAngle) * radius-params.gradientX, 
                  centerRY + Math.sin(newAngle) * radius-params.gradientY,
                  endX,
                  endY
                );

                gradient.addColorStop(0, '#c1d3ea');
                gradient.addColorStop(1, '#3e445c');

                ctx.beginPath();
                ctx.rotate(degToRad(-1.5));
                ctx.arc(x, y, radius, startAngle, endAngle, false);
                ctx.strokeStyle = gradient;
                ctx.lineWidth = 61;
                ctx.stroke();
                ctx.closePath();

                if(params.need_max - params.need_value > 500) {
                  ctx.beginPath();
                  ctx.moveTo(centerRX + Math.cos(newAngle-0.02) * radius, centerRY + Math.sin(newAngle-0.02) * radius);
                  ctx.lineTo(centerRX + Math.cos(newAngle+0.1) * radius,centerRY + Math.sin(newAngle+0.1) * radius);
                  ctx.lineTo(centerRX + Math.cos(newAngle) * (radius+30),centerRY + Math.sin(newAngle) * (radius+30));
                  ctx.fillStyle = gradient;
                  ctx.strokeStyle = gradient;
                  ctx.lineWidth = 2;
                  ctx.stroke();
                  ctx.fill();
                  ctx.closePath();
                  ctx.beginPath();
                  ctx.moveTo(centerRX + Math.cos(newAngle-0.02) * radius, centerRY + Math.sin(newAngle-0.02) * radius);
                  ctx.lineTo(centerRX + Math.cos(newAngle+0.1) * radius,centerRY + Math.sin(newAngle+0.1) * radius);
                  ctx.lineTo(centerRX + Math.cos(newAngle) * (radius-30),centerRY + Math.sin(newAngle) * (radius-30));
                  ctx.fillStyle = gradient;
                  ctx.strokeStyle = gradient;
                  ctx.lineWidth = 2;
                  ctx.stroke();
                  ctx.fill();
                  ctx.closePath();
                }

            },
          });

          container.add(arc);
          arc.setZIndex(params.zIndex);
          container.draw();
          scope.needsLine.push(arc);
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
          
          var centerText = new Kinetic.Text({
            text: '',
            fontSize: 25,
            fontFamily: 'Helvetica Neue Light',
            fill: '#000000',
            x: scope.dashboard_size.width/2
          });

          container.add(centerImgContainer);
          container.add(centerText);

          scope.dashboard.add(container);

          scope.centerTextDraw = centerText;
          scope.pointsLayer = container;

          scope.updatePointText_();
      }

      scope.$watch("workspace.needs", function (newVal, oldVal, scope) {
        if(newVal && newVal.length > 0 && scope.workspace.user && scope.workspace.user.sguid) {
          scope.setNeeds();
        }
      });

      scope.$watch("workspace.user", function (newVal, oldVal, scope) {
        if(newVal && newVal.sguid > 0 && scope.workspace.needs && scope.workspace.needs.length > 0) {
          scope.setNeeds();
        }
      });

      scope.setNeeds = function() {
          if(scope.db3Draw) {
            scope.clearNeeds();
            scope.db3Draw.draw();  
          }

          User.goals_points({id: scope.workspace.user.sguid}, {}, function(goalsData) {
            var needsData = {};
            var needs = JSON.parse(JSON.stringify(scope.workspace.needs));
            angular.forEach(needs, function(needItem, needKey) {
                needsData[needItem.sguid] = 0;

                angular.forEach(needItem.goals, function(goalItem, goalKey) {
                    goalItem.current_value = parseInt(goalsData[goalItem.sguid]);
                    if(goalsData[goalItem.sguid]) {
                        needsData[needItem.sguid] += parseInt(goalsData[goalItem.sguid]);
                    }
                });
                
                if(needItem.name == "Career") {
                    var max = 0;
                    var carreerMax = {};
                    var moneyPoints = 0;
                    var moneyMax = 0;

                    angular.forEach(needItem.goals, function(goal) {
                        if (goal.current_value > max && goal.name != "Money") {
                          max = goal.current_value;
                          carreerMax = {goal: goal.sguid, points: goal.current_value, max: goal.points_summary};
                        }
                        if(goal.name == "Money") {
                          moneyPoints = goal.current_value;
                          moneyMax = goal.points_summary;
                        }

                    });

                    scope.carreeMax = parseInt(carreerMax.max + moneyMax);
                    needsData[needItem.sguid] = parseInt(carreerMax.points + moneyPoints);
                    console.log(scope.carreeMax);
                    console.log(carreerMax.points + moneyPoints);
                }

                needItem.current_value = needsData[needItem.sguid];
            });

            scope.drawNeed_(scope.db3Draw, {
                corruption: 358,
                radius: 253,
                need_max: scope.findNeedBySguid("169990243011789824").points_summary,
                need_value: needsData["169990243011789824"],
                centerX: 205,
                centerY: 97,
                segment: 33,
                gradientX: 50,
                gradientY: 150,
                zIndex: 1,
                segmentMax: 46
             });
            scope.drawNeed_(scope.db3Draw, {
                corruption: 303,
                radius: 260,
                need_max: scope.carreeMax,
                need_value: needsData["169990243011789827"],
                centerX: 210,
                centerY: 92,
                segment: 33,
                gradientX: 120,
                gradientY: 100,
                zIndex: 2,
                segmentMax: 45
             });
            scope.drawNeed_(scope.db3Draw, {
                corruption: 190,
                radius: 245,
                need_max: scope.findNeedBySguid("169990243011789825").points_summary,
                need_value: needsData["169990243011789825"],
                centerX: 228,
                centerY: 102,
                segment: 41,
                gradientX: -10,
                gradientY: -110,
                zIndex: 3,
                segmentMax: 48
             });
            scope.drawNeed_(scope.db3Draw, {
                corruption: 135,
                radius: 255,
                need_max: scope.findNeedBySguid("169990243011789826").points_summary,
                need_value: needsData["169990243011789826"],
                centerX: 218,
                centerY: 107,
                segment: 40,
                gradientX: -100,
                gradientY: -100,
                zIndex: 4,
                segmentMax: 46
             });
          });
      }

      scope.clearNeeds = function() {
        angular.forEach(scope.needsLine, function(value, key){
          value.remove();
        });
      }

      scope.findNeedBySguid = function(sguid) {
        return scope.workspace.needs.filter(function(value) {
          if(value.sguid == sguid)  {
            return value;
          }
        })[0];
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
                var cont2 =scope.drawSegmentPoints_(
                    {x: 0, y: 0}, 
                    [preload.getResult("db3"), preload.getResult("db3p")],
                    {x: 200, y: 100},
                    {x: 9, y: 7}
                );
                scope.db3Draw = cont2;

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

