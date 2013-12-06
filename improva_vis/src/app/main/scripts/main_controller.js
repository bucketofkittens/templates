function MainController($scope, $location) {

  $scope.share = '<div class="addthis_toolbox addthis_default_style addthis_32x32_style" addthis:url="http://www.improva.com" addthis:title="Improva" addthis:description="Everybody can achieve everything"><a class="addthis_button_facebook"></a><a class="addthis_button_google_plusone_share"></a><a class="addthis_button_twitter"></a><a class="addthis_button_compact"></a><a class="addthis_counter addthis_bubble_style"></a></div><script type="text/javascript">var addthis_config = {"data_track_addressbar":true};</script><script type="text/javascript" src="//s7.addthis.com/js/300/addthis_widget.js#pubid=ra-528613a528ff4e9e"></script>';

  $scope.goToWelcome = function() {
    $location.path('/');
  };

  $scope.goToMain = function() {
    $location.path('/main');
  };

  $scope.goToTerms = function() {
    $location.path('/terms');
  };

  $scope.goToAbout = function() {
    $location.path('/about');
  };

  $scope.shareFacebook = function(url, title, descr, image) {
    var winWidth = 600;
    var winHeight = 600;
    var winTop = (screen.height / 2) - (winHeight / 2);
    var winLeft = (screen.width / 2) - (winWidth / 2);
    window.open('http://www.facebook.com/sharer.php?s=100&p[title]=' + title + '&p[summary]=' + descr + '&p[url]=' + url + '&p[images][0]=' + image, 'sharer', 'top=' + winTop + ',left=' + winLeft + ',toolbar=0,status=0,width=' + winWidth + ',height=' + winHeight);
    return false;
  };

  $scope.shareGoogle = function(url) {
    var winWidth = 600;
    var winHeight = 600;
    var winTop = (screen.height / 2) - (winHeight / 2);
    var winLeft = (screen.width / 2) - (winWidth / 2);
    window.open('https://plus.google.com/share?url='+ url, 'top=' + winTop + ',left=' + winLeft + ',toolbar=0,status=0,width=' + winWidth + ',height=' + winHeight);
    return false;
  };

}

MainController.$inject = ['$scope', '$location'];