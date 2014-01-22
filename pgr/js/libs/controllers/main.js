/**
 * Контроллер главной страницыMainC
 * @param {object} $scope
 * @param {object} Leagues
 * @param {object} User
 * @param {object} AuthUser
 * @param {object} $rootScope
 * @param {object} $location
 * @param {object} $timeout
 * @returns {MainController}
 */
function MainController($scope, Leagues, User, $rootScope, $location, $timeout, AuthUser, $cookieStore) {

    window.onorientationchange = function() {
        angular.forEach($scope.users, function(value, key) {
            value.big = false;
        });
    };

    $(document).on("click touchstart", function(event) {
        event.stopPropagation();
        if(
            !$(event.target).hasClass("wr") 
            && $(event.target).parents(".sub2").size() == 0) {
            $("#zoom_element").removeClass("show");
        }
        $scope.$apply(function() {
            if(
                !$(event.target).hasClass("wr") 
                && $(event.target).parents(".sub2").size() == 0  ) {
                $scope.zoomElement = null;
            }
        });
    });
    
    /**
     * Событие перехода к пользователю
     * @param  {object} user
     * @return {object}     
     */
    $scope.onMoveToProfile = function(user) {
        $location.path("/profile/").search({user: user.sguid});
    }

    $scope.onMoveToCompare = function(user) {
        $location.path("/compare").search({user1: user.sguid, user2: $scope.workspace.user.sguid});
    }

    /**
     * Событие перехода к сравнению
     * @param  {object} user
     * @return {object}
     */
    $scope.onCompareToUser = function(user) {
        $location.path("/profile/"+$scope.rootUser.sguid+"/"+user.sguid)
    }

    /**
     * Событие добавление в друзья
     * @param  {object} user   
     * @return {object}        
     */
    $scope.onFollow = function(user) {
        $rootScope.$broadcast('follow', {userId: AuthUser.get(), frendId: user.sguid, user: user});
    }

    /**
     * Событие удаление из друзей
     * @param  {object} user
     * @return {object}      
     */
    $scope.onUnFollow = function(user) {
        $rootScope.$broadcast('unfollow', {userId: AuthUser.get(), frendId: user.sguid, user: user});
    }

    
    /**
     * Настройки masonry
     * @type {Object}
     */
    $scope.opts = {
        layoutMode: "perfectMasonry",
        perfectMasonry: {
            layout: 'horizontal',
            columnWidth: 70,
            rowHeight: 70
       }
    };

    /**
     * Событие скроллинга мышкой
     * @param  {object} $event  [description]
     * @param  {Number} $delta  [description]
     * @param  {Number} $deltaX [description]
     * @param  {Number} $deltaY [description]
     * @return {object}         [description]
     */
    $scope.onWheel = function($event, $delta, $deltaX, $deltaY) {
        var contentWidth = $("#masonry").width();
        var windowWidth = $(window).width();

        if(contentWidth > windowWidth) {
            var step = $event.wheelDeltaY ? $event.wheelDeltaY/2 : $event.deltaY * 40;

            if(!$scope.scrollDelta) {
                $scope.scrollDelta = 0;
            }
            
            if($scope.scrollDelta + step <= 0) {
                if(Math.abs($scope.scrollDelta + step) + windowWidth <= contentWidth+50) {
                    $scope.scrollDelta = $scope.scrollDelta + step;
                }    
            }
        }
    }

    /**
     * Скроллинг плинки на ipad
     * @param  {[type]} $event [description]
     * @return {[type]}        [description]
     */
    $scope.onDragLeft = function($event) {
        if(!$scope.scrollDelta) {
            $scope.scrollDelta = 0;
        }

        $scope.scrollDelta = $scope.scrollDelta + $event.gesture.velocityX*10;
    }

    /**
     * Скроллинг плинки на ipad
     * @param  {[type]} $event [description]
     * @return {[type]}        [description]
     */
    $scope.onDragRight = function($event) {
        if(!$scope.scrollDelta) {
            $scope.scrollDelta = 0;
        }

        $scope.scrollDelta = $scope.scrollDelta - $event.gesture.velocityX*10;
        
    }

    $scope.onLogin = function() {
      $location.path('/login/');
    };

    $scope.$on('galleryElementClick', function($event, message) {
        console.log(message.item);
        if(message.item) {
          $scope.zoomElement = message.item;
          $scope.zoomElement.x = $(message.event.target).parent().position().left;
          $scope.zoomElement.y = $(message.event.target).parent().position().top;
          $scope.zoomElement.width = $(message.event.target).parent().width();
          $scope.zoomElement.height = $(message.event.target).parent().height();
        }
    });
}