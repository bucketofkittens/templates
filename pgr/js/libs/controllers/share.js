/**
 * Share в социальных сетях
 * @param {[type]} $scope [description]
 */
function ShareController($scope) {
    
    /**
     * Share facebook
     * @param  {[type]} url   [description]
     * @param  {[type]} title [description]
     * @param  {[type]} descr [description]
     * @param  {[type]} image [description]
     * @return {[type]}       [description]
     */
    $scope.shareFacebook = function(url, title, descr, image) {
        console.log("fb");
        var winWidth = 600;
        var winHeight = 600;
        var winTop = (screen.height / 2) - (winHeight / 2);
        var winLeft = (screen.width / 2) - (winWidth / 2);
        window.open('http://www.facebook.com/sharer.php?s=100&p[title]=' + title + '&p[summary]=' + descr + '&p[url]=' + url + '&p[images][0]=' + image, 'sharer', 'top=' + winTop + ',left=' + winLeft + ',toolbar=0,status=0,width=' + winWidth + ',height=' + winHeight);
        return false;
    };

    /**
     * Share google
     * @param  {[type]} url [description]
     * @return {[type]}     [description]
     */
    $scope.shareGoogle = function(url) {
        var winWidth = 600;
        var winHeight = 600;
        var winTop = (screen.height / 2) - (winHeight / 2);
        var winLeft = (screen.width / 2) - (winWidth / 2);
        window.open('https://plus.google.com/share?url='+ url, 'top=' + winTop + ',left=' + winLeft + ',toolbar=0,status=0,width=' + winWidth + ',height=' + winHeight);
        return false;
    };
}