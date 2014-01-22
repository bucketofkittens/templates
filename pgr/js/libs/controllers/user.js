/**
 * Контроллер  профиля
 * @param {object} $scope
 * @param {object} $route
 * @param {object} $routeParams
 * @param {object} User
 * @param {object} Needs
 * @param {object} Professions
 * @param {object} States
 * @returns {object}
 */
function UserController($scope, $element, $route, $routeParams, User, Needs, Professions, States, $http, NeedsByUser, $rootScope, GoalsByUser, AuthUser, Leagues, $location, $window) {
    $scope.user = null;
    $scope.newImage = null;
    $scope.bindIn = "";
    $scope.hidden = false;

    $scope.userId = $location.search().user;

    $scope.$on('authUserIdChange', function() {
        $scope.userId = AuthUser.get();
    }); 

    if($location.search().user1) {
        $scope.userId = $location.search().user1;
        $scope.bindIn = "user1";
    }

    if($scope.rightId) {
        $scope.userId = $scope.rightId;
        $scope.bindIn = "user2";
    }

    if($location.search().user1 && $location.search().user2 && $location.search().user1 == $location.search().user2) {
        User.for_main({}, {}, function(data) {
            var index = getRandomInt(0, data.length-1);
            $location.path("/compare").search({user1: $location.search().user1, user2: data[index].sguid})
        });
    }

    /**Событие клика на пользователе в сравнении */
    $scope.onUserClick = function(user, $event) {
        if($scope.compare && user.sguid != AuthUser.get()) {
            if(user.hover == true) {
                user.hover = false;
            } else {
                user.hover = true;
            }
        }
    }

    $scope.changeUser = function(user) {
        if($scope.bindIn == "user2") {
            $location.search({user1: $location.search().user1, user2: user.sguid});
        } else {
            $location.search({user1: user.sguid, user2: $location.search().user2});
        }

        $rootScope.$broadcast('hideSearch');
    }

    $scope.$on('$locationChangeSuccess', function(location) {
        if($scope.bindIn == "user2") {
            $("sub.du, sup.du").remove();
            $scope.userId = $location.search().user2;
            $scope.getUserInfo();
        } else {
            $("sub.du, sup.du").remove();
            $scope.userId = $location.search().user1;
            $scope.getUserInfo();
        }

        if($routeParams.userId1) {
            $("sub.du, sup.du").remove();
            $scope.userId = $routeParams.userId1;
            $scope.getUserInfo();
        }

        if($location.search().user) {
            $("sub.du, sup.du").remove();
            $scope.userId = $location.search().user;
            $scope.getUserInfo();
        }
    });

    $scope.onCompareUser = function() {
        if($scope.workspace.user && $scope.workspace.user.sguid) {
            $location.path("/compare").search({user1: $scope.workspace.user.sguid, user2: $scope.userId});
        } else {
            if($scope.tmpFollows.length > 0) {
                if($scope.tmpFollows[0].user.sguid != $scope.userId) {
                    $location.path("/compare").search({user1: $scope.tmpFollows[0].user.sguid, user2: $scope.userId});
                } else {
                    var index = getRandomInt(0, data.length-1);
                    $location.path("/compare").search({user1: $scope.tmpFollows[0].user.sguid, user2: data[index].sguid});
                }
            } else {
                User.for_main({}, {}, function(data) {
                    var index = getRandomInt(0, data.length-1);
                    $location.path("/compare").search({user1: data[index].sguid, user2: $scope.userId})
                });
                
            }
        }
    }

    $scope.$watch("userId", function (newVal, oldVal, scope) {
        $scope.getUserInfo();
    });

    $scope.$watch("workspace.user.frends", function (newVal, oldVal, scope) {
        $scope.testFollow();
    });

    $scope.professionFn = function(query) {
        return $.map($scope.professions, function(profession) {
            return profession.name;
        });
    }

     /**
     * Событие.
     * Пользователя удалили из друзей
     * @param  {[type]} $event  [description]
     * @param  {[type]} message [description]
     * @return {[type]}         [description]
     */
    $scope.$on('unfollowCallback', function($event, message) {
        if($scope.user.sguid == message.frendId) {
            $scope.user.isFollow = false;
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
        if($scope.user.sguid == message.frendId) {
            $scope.user.isFollow = true;
        }
    });

    /** Событие добавление в друзья */
    $scope.onFollow = function() {
        $rootScope.$broadcast('follow', {userId: AuthUser.get(), frendId: $scope.user.sguid, user: $scope.user});
    }

    /** Событие удаление из друзей */
    $scope.onUnFollow = function() {
        $rootScope.$broadcast('unfollow', {userId: AuthUser.get(), frendId: $scope.user.sguid, user: $scope.user});
    }

    /** Событие перехода к пользователю */
    $scope.onMoveToProfile = function(user) {
        $location.path("/profile/").search({user: user.sguid});;
    }

    /**
     * Информация по пользователю
     * @return {[type]} [description]
     */
    $scope.getUserInfo = function() {
        if(!isNaN(parseInt($scope.userId))) {
            User.query({id: $scope.userId}, function(data) {
                $scope.user = data;

                $scope.user.points = parseInt($scope.user.points);

                if($scope.user.points == null) {
                    $scope.user.points = 0;
                }

                if(isNaN($scope.user.points)) {
                    $scope.user.points = 0;
                }

                if(!$scope.user.avatar) {
                    $scope.user.avatar = "/images/unknown-person.png";
                }

                /**
                 * Указваем формат дня рождения
                 */
                if($scope.user.birthday) {
                    $scope.user.birthday = moment($scope.user.birthday).format("DD/MM/YYYY");
                }
                
                /**
                 * Забираем список друзей пользователя
                 */
                if($scope.user.league) {
                    User.by_league({league_guid: $scope.user.league.sguid}, {}, function(data) {
                        $scope.user.league.users = data;
                    });
                }

                $rootScope.$broadcast('userControllerGetUser', {
                    user: $scope.user
                });

                $rootScope.$broadcast('getSelectedUserData', {
                    user: $scope.user
                });



                $scope.testFollow();
            });
        }
    }

    $scope.$on('updateUserControllerId', function($event, message) {
        if(message.id == $scope.id) {
            if(message.userId) {
                $scope.currentUserId = message.userId;
                $scope.getUserInfo();
            }

            if(!angular.isUndefined(message.isEdit)) {
                $scope.isEdit = message.isEdit;
            }
        }
    });
    

    $scope.$on('updateLegue', function() {
        User.update_legue({id: AuthUser.get()}, {
            points: $scope.user.points
        }, function(data) {
            $rootScope.$broadcast('updateUserLegueAndPoints');
        });
    });
    

    $scope.testFollow = function() {
        if($scope.userId) {
            if($scope.workspace.user && $scope.workspace.user.frends) {
                var item = $scope.workspace.user.frends.filter(function(item) {
                    if(item.user.sguid == $scope.userId) { return item; }
                });
            } else {
                var item = $scope.tmpFollows.filter(function(item) {
                    if(item.user.sguid == $scope.userId) { return item; }
                });
            }
            if($scope.user) {
                if(item.length > 0) {
                    $scope.user.isFollow = true;
                } else {
                    $scope.user.isFollow = false;
                }    
            }
            
        }
    }

    /**
     * Событие обновления лиги у пользователя
     * @return {[type]} [description]
     */
    $scope.$on('updateUserLegueAndPoints', function() {
        User.query({id: $scope.currentUserId}, $.proxy($scope.userLegueAndPointsUpdate_, $scope));
    });

    /**
     * Обновляет данные лиги у пользователя
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
    $scope.userLegueAndPointsUpdate_ = function(data) {
        $scope.user.league = data.league;
        $scope.user.points = data.points;

        $rootScope.workspace.user.league = data.league;
        $rootScope.workspace.user.points = data.points;
    }

    /**
     * Событие при изменении критерия
     * @return {[type]} [description]
     */
    $scope.$on('userCriteriaUpdate', function() {
        $rootScope.$broadcast('updateLegue');
    });

    $scope.$on('updateUser', function() {
        $scope.getUserInfo();
    });

    /**
     * Список годов
     * @param  {[type]} min [description]
     * @param  {[type]} max [description]
     * @return {[type]}     [description]
     */
    this.generateAgesArray = function(min, max) {
        var i = min, ret = [];
        for(i = min; i <= max; i++){
            ret.push(i);
        }
        return ret;
    }

    $scope.ages = this.generateAgesArray(14, 150);

    $scope.onCompare = function(id) {
        $location.path('/compare/'+id);
    }

    $scope.onBack = function($event) {
        $window.history.back();
    }

    /**
     * 
     * @param {type} $event
     * @param {type} elementId
     * @returns {undefined}
     */
    $scope.onEditActivate = function($event, elementId) {
        angular.element(".form-control").attr("disabled", "disabled");
    
        var elm = angular.element("#"+elementId)[0];
        if(elm.getAttribute("disabled")) {
            elm.removeAttribute("disabled");
            elm.focus();
        } else {
            elm.setAttribute("disabled", "disabled");
        }   
    };


    $scope.onElementClick = function($event) {
        var elm = $($event.target);
        $("input[type='text'], input[type='email'], select", ".pmpar").attr("readonly", "readonly");
        $(elm).attr("readonly", false);
        $(elm).focus();
    };
    

    /**
     * [onReadFile description]
     * @param  {[type]} $event
     * @return {[type]}
     */
    $scope.onReadFile = function($event) {
        $rootScope.$broadcast('cropImage');
    }

    /**
     * 
     * @param  {[type]} $event
     * @return {[type]}
     */
    $scope.onUpdateFile = function($event) {
        $("#photo_crop").click();
    }

    $scope.onUpdateGoalImage = function($event) {
        $("#goal_done").html("");
        var data = new FormData();
        data.append("picture", $("#goal_image")[0].files[0]);
        data.append("owner_type", 3);

        $.ajax({
            url: host+'/pictures/'+$("#goal_id").val(),
            data: data,
            cache: false,
            contentType: false,
            processData: false,
            type: 'PUT'
        }).done(function(data) {
            $("#goal_done").html("done");
        });
    }

    $scope.getProfessionByName = function(name) {
        var filtered = $scope.professions.filter(function(value) {
            if(value.name == name) {
                return value;
            }
        });

        return filtered;
    }

    if($scope.workspace && $scope.workspace.user) {
        $scope.authUser = $scope.workspace.user;
        $scope.testFollow();
    }
}