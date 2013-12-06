App.directive('mainBodyIpad', ['$timeout', function ($timeout) {
  return {
    restrict: 'E',
    templateUrl: function() {
      if (navigator.userAgent.toLowerCase().indexOf("iphone") == -1) {
        return 'src/components/directives/main_body_ipad/main_body_ipad.html';
      } else {
        return 'src/components/directives/main_body_ipad/iphone_main_body_ipad.html';
      }
    },
    scope: {

    },
    link: function ($scope, elem, attrs) {
      var retina = window.devicePixelRatio > 1;

      $scope.links = [
        'dashboard',
        'profile',
        'goals',
        'tasks',
        'notes',
        'money'
      ];

      $scope.text = {
        'dashboard':'improva has structured "Happiness" and "Balanced Life" to the set of simple indicators. Now you can measure and track impact of your achievements in every aspect of your life.',
        'profile':'Identify where you are currently on the scale. It helps you consider each area of your life and assets what is off balance.',
        'goals':'Set goals to promote long-term vision and short-term motivation. It can gives returns in all areas of personal life. Knowing precisely what you want to achieve makes clear what to concentrate and improve on.',
        'tasks':'Record all the tasks you need to accomplish. Finishing tasks will give you a sense of accomplishment and spur motivation. Leave time for fun!',
        'notes':'Save everything cool and exciting you. Organize multiple notes by attaching them to tasks and goals.',
        'money':'Set your actual budget. Track all your expenses and income. Use forecast to plan your spent.'
      };

      $scope.featureHide = false;

//      if (retina) {
        $scope.appScreenshotUrl = 'src/assets/images/screenshots/dashboard@2x.jpeg';
//      } else {
//        $scope.appScreenshotUrl = 'src/assets/images/screenshots/dashboard.png';
//      }
      $scope.appIconUrl = 'src/assets/images/icons/app/dashboard.png';

      $timeout(function(){
        var activeSlide = $(elem).find('.flex-active-slide')[0];
        var currentSlide = $(activeSlide).next()[0];
        $(currentSlide).css('color', 'rgba(54, 55, 75, 1)');
      }, 0);

      $scope.toggle = function(){
        var activeSlide = $(elem).find('.flex-active-slide')[0];
        var link = $(activeSlide).attr('id');

        $scope.featureHide = true;
        $timeout(function(){
//          if (retina) {
            $scope.appScreenshotUrl = 'src/assets/images/screenshots/'+link+'@2x.jpeg';
//          } else {
//            $scope.appScreenshotUrl = 'src/assets/images/screenshots/'+link+'.png';
//          }
//          $scope.appIconUrl = 'src/assets/images/icons/app/'+link+'.png';
          $scope.featureHide = false;
        }, 0);
      };

//      var appIcon = $(elem).find('#app-icon');
//      var line = $(elem).find('#line');
      var appScreenshot = $(elem).find('#app-screenshot');

      $scope.$watch('appIconUrl', function(value){
//        appIcon.css('background-image', 'url("'+value+'")');
      });

      $scope.$watch('lineUrl', function(value){
//        line.css('background-image', 'url("'+value+'")');
      });

      $scope.$watch('appScreenshotUrl', function(value) {
        appScreenshot.css('background-image', 'url("'+value+'")');
        appScreenshot.css('-webkit-background-size', 'cover');
        appScreenshot.css('-moz-background-size', 'cover');
        appScreenshot.css('-o-background-size', 'cover');
        appScreenshot.css('background-size', 'cover');
      });
    }
  }
}]);