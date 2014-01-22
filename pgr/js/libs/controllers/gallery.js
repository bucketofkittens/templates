/**
 * Универсальная галлерея
 * @param {[type]} $scope    [description]
 * @param {[type]} localize  [description]
 * @param {[type]} Leagues   [description]
 * @param {[type]} User      [description]
 * @param {[type]} AuthUser  [description]
 * @param {[type]} $element  [description]
 * @param {[type]} $location [description]
 */
function GalleryController($scope, localize, Leagues, User, AuthUser, $element, $location, $timeout, $rootScope, $routeParams) {

    /**
     * Через сколько минисекунд картинка становится большой
     * @type {Number}
     */
    $scope.showTick = 1000;

    /**
     * Определяем является пользователь другом или нет
     * @param  {object} user Пользователь
     * @return {object}      none
     */
    $scope.testUser = function(user) {
        if($scope.workspace.user) {
            var frend = $scope.workspace.user.frends.filter(function(data) {
                if(data.user.sguid === user.sguid) {
                    return data;
                }
            });
        } else {
            var frend = $scope.tmpFollows.filter(function(data) {
                if(data.user.sguid === user.sguid) {
                    return data;
                }
            });
        }

        user.isFrend = frend.length > 0 ? true : false;

        return user;
    }

    /**
     * Событие когда мы получили данные авторизированного пользователя
     * @return {[type]} [description]
     */
    $scope.$on('authUserGetData', function() {
        $scope.testFollow();
    });

    /**
     * Событие.
     * Пользователя удалили из друзей
     * @param  {[type]} $event  [description]
     * @param  {[type]} message [description]
     * @return {[type]}         [description]
     */
    $scope.$on('unfollowCallback', function($event, message) {
        if($scope.users) {
            var user = $scope.users.filter(function(data) {
                if(data.sguid == message.frendId) {
                    return data;
                }
            });
            if(user.length > 0) {
                $scope.testUser(user[0]);
            }    
        }
    });

    /**
     * Событие.
     * Пользователя добавили в друзья
     * @param  {[type]} $event  [description]
     * @param  {[type]} message [description]
     * @return {[type]}         [description]
     */
    $scope.$on('followCallback', function($event, message) {
        if($scope.users) {
            var user = $scope.users.filter(function(data) {
                if(data.sguid == message.frendId) {
                    return data;
                }
            });
            if(user.length > 0) {
                $scope.testUser(user[0]);
            }    
        }
    });


    /**
     * Событие при наведении на элемент плитки
     * @param  {object} user 
     * @return {object}      
     */
    $scope.onUserMouseEnter = function(user, $event) {
//        if(!user.hover) {
//            user.hovered = true;
//
//            $timeout(function() {
//                if(user.hovered) {
//                    angular.forEach($scope.users, function(item, key) {
//                        if(item != user) {
//                            item.hovered = false;
//                            item.hover = false;
//                        }
//                    });
//                    user.hover = user.hovered ? true : false;
//                }
//            }, $scope.showTick);
//        }
    }

    /**
     * 
     * @param  {object} user 
     * @return {object}      
     */
    $scope.onUserMouseLeave = function(user, $event) {
//        user.hovered = false;
//
//        $timeout(function() {
//            user.hover = false;
//        }, $scope.showTick);
    }

    /**
     * Событие клика на пользователе на плитке
     * @param  {object} user 
     * @param  {object} $event
     * @return {object} 
     */
    $scope.onUserClick = function(user, $event) {
        var target = $event.toElement ? $event.toElement : $event.target;
        if(!target.classList.contains('navigate')) {
            angular.forEach($scope.users, function(item, key) {
                if(item != user) {
                    item.big = false;
                }
            });

            user.big = user.big ? false : true;

            $rootScope.$broadcast('galleryElementClick', {item: user, event: $event});
        }
    }

    /**
     * Событие перехода к пользователю
     * @param  {object} user
     * @return {object}     
     */
    $scope.onMoveToProfile = function(user) {
        $location.path("/profile/").search({user: user.sguid});
    }

    $scope.onMoveToCompare = function(user) {
        if($scope.workspace.user && $scope.workspace.user.sguid) {
            $location.path("/compare").search({user1: $scope.workspace.user.sguid, user2: user.sguid});
        } else {
            if($scope.tmpFollows.length > 0) {
                if($scope.tmpFollows[0].user.sguid != user.sguid) {
                    $location.path("/compare").search({user1: $scope.tmpFollows[0].user.sguid, user2: user.sguid});    
                } else {
                    var index = getRandomInt(0, $scope.users.length-1);
                    $location.path("/compare").search({user1: $scope.tmpFollows[0].user.sguid, user2: $scope.users[index].sguid});
                }
                
            } else {
                var index = getRandomInt(0, $scope.users.length-1);
                $location.path("/compare").search({user1: $scope.users[index].sguid, user2: user.sguid});
            }
        }
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
     * Проходимся по списку всех пользователей что бы определить друзей
     * @return {object}
     */
    $scope.testFollow = function() {
        if($scope.workspace.user && $scope.workspace.user.frends) {
            angular.forEach($scope.workspace.user.frends, function(value, key) {
                angular.forEach($scope.users, function(v2, k2) {
                    if(v2.sguid == value.user.sguid) {
                        v2.isFrend = true;
                    } else {
                        if(v2.isFrend != true) {
                            v2.isFrend = false;   
                        }
                    }
                });
            });    
        } else {
            angular.forEach($scope.tmpFollows, function(value, key) {
                angular.forEach($scope.users, function(v2, k2) {
                    if(v2.sguid == value.user.sguid) {
                        v2.isFrend = true;
                    } else {
                        if(v2.isFrend != true) {
                            v2.isFrend = false;   
                        }
                    }
                });
            }); 
        }
    }

    $scope.$watch("users", function (newVal, oldVal, scope) {
        if($scope.users && $scope.users.length > 0) {
            $scope.testFollow();
        }
    });
}