/**
 * Контроллер панели друзей
 * @param {object} $scope       
 * @param {object} $rootScope   
 * @param {object} User         
 * @param {object} $location   
 * @param {object} $routeParams 
 * @param {object} AuthUser     
 */
function FollowController($scope, $rootScope, User, $location, $routeParams, AuthUser) {
    $scope.compareState = 1;
    
    $scope.onCompare = function(user) {
        var noCl = false;
        if($location.search().user1) {
            if($scope.compareState == 1) {
                if($location.search().user2 != user.sguid && $location.search().user1 != user.sguid) {
                    $scope.compareState = 2;
                    $location.path("/compare").search(
                        {
                            user1: $location.search().user2, 
                            user2: user.sguid
                        }
                    );
                } else {
                    noCl = true;
                }
            } else {
                if($location.search().user1 != user.sguid && $location.search().user2 != user.sguid) {
                    $scope.compareState = 1;
                    $location.path("/compare").search(
                        {
                            user1: $location.search().user2, 
                            user2: user.sguid
                        }
                    );
                } else {
                    noCl = true;
                }
            }
        } else {
            if($scope.workspace.user && $scope.workspace.user.sguid) {
                if($scope.workspace.user.frends.length > 0) {
                    $location.path("/compare").search(
                        {
                            user1: $scope.workspace.user.frends[0].user.sguid, 
                            user2: user.sguid
                        }
                    );
                } else {
                    $location.path("/compare").search(
                        {
                            user1: $scope.workspace.user.sguid, 
                            user2: user.sguid
                        }
                    );
                }
                    
            } else {
                if($scope.tmpFollows[0].user.sguid != user.sguid) {
                    $location.path("/compare").search({user1: $scope.tmpFollows[0].user.sguid, user2: user.sguid});
                } else {
                    User.for_main({}, {}, function(data) {
                        var index = getRandomInt(0, data.length-1);
                        $location.path("/compare").search({user1: data[index].sguid, user2: user.sguid})
                    });
                }
            }
        }
        if(!noCl) {
            $rootScope.$broadcast('loaderShow');    
        }
    };

    /**
     * Получаем список друзей. Или временный или же из массива пользователя.
     */
    $scope.setAuthUserData = function() {
        if($scope.workspace.user && $scope.workspace.user.sguid) {
            $scope.frends = $scope.workspace.user.frends;
        } else {
            $scope.frends = $scope.tmpFollows;
        }
    }

    $scope.$on('login', function() {
        $scope.setAuthUserData();
    });

    $scope.$on('authUserGetData', function() {
        $scope.setAuthUserData();
    });

    $scope.$on('frendLoad', function() {
        $scope.setAuthUserData();
    });

    $scope.$on('getTmpFollowsCallback_', function() {
        $scope.frends = $scope.tmpFollows;
    });

    $scope.onUnfollow = function(user) {
        $rootScope.$broadcast('unfollow', {userId: AuthUser.get(), frendId: user.sguid});
    }

    $scope.onCompareToMain = function(user) {
        if($scope.rootUser.sguid) {
            $location.path("/profile/"+$scope.rootUser.sguid+"/"+user.sguid);
        } else {
            $location.path("/profile/").search({user: user.sguid});
        }
    }

    $scope.onMoveToUser = function() {

        if($scope.workspace.user && $scope.workspace.user.sguid) {
            $location.path("/compare").search({user1: $scope.workspace.user.sguid, user2: $scope.workspace.user.frends[0].user.sguid});
        } else {
            if($scope.tmpFollows.length > 1) {
                $location.path("/compare").search({user1: $scope.tmpFollows[0].user.sguid, user2: $scope.tmpFollows[1].user.sguid});
            } else {
                $location.path("/compare").search({user1: $scope.tmpFollows[0].user.sguid, user2: $scope.tmpFollows[0].user.sguid});
            }
        }
    }

    /**
     * Забираем информацию о пользователю
     */
    $scope.setAuthUserData();
}