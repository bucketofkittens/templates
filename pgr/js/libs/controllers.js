'use strict';

/**
 * Контроллер определяет показывать ли теневую подгрузку или нет
 * @param {[type]} $scope [description]
 */
function ShadowCtrl($scope, $rootScope) {

    /**
     * При клике на тенюшку, убрием modal окно
     * @param  {[type]} $event [description]
     * @return {[type]}        [description]
     */
    $scope.onHideModal = function() {
        $rootScope.$broadcast('hideShadow');
        $rootScope.$broadcast('hideModal');
    }

    /**
     * Показывать
     * @return {undefined} 
     */
    $scope.$on('showShadow', function() {
        $scope.show = true;
    });

    /**
     * Не показывать
     * @return {undefined} 
     */
    $scope.$on('hideShadow', function() {
        $scope.show = false;
    });
}

/**
 * Контроллер аватарки
 * @param {Object} $scope
 * @param {Object} $rootScope
 * @param {Object} $location
 * @returns {undefined}
 */
function AvatarCtrl($scope, $rootScope, $location) {
    /**
     * Открываем окно авторизации
     * @returns {undefined}
     */
    $scope.onLogin = function() {
        $location.path("/login/");
    };

    /**
     * Переход на страницу профиля
     * @return {undefined}
     */
    $scope.onOpenProfileAuthUser = function() {
        $location.path("/my_profile/").search({});
    };
}

/**
 * Навигационное меню сверху
 * @param {type} $scope
 * @param {type} localize
 * @param {type} $location
 * @param {type} AuthUser
 * @param {type} $rootScope
 * @param {type} $route
 * @returns {undefined}
 */
function NavCtrl($scope, localize, $location, AuthUser, $rootScope, $route) {
    /**
     * Клик на ссылку навигации
     * @param {type} $event
     * @param {type} nav
     * @returns {undefined}
     */
    $scope.onNavClick = function($event, nav) {
        if(nav.link) {
            $location.path(nav.link.replace('#', ''));
        }
    };

    $rootScope.controller = $route.controller;

    /**
     * Событие вызываемое при загрузке файлов локализации.
     * Нужно для создания массива верхнего меню, локализованного
     * @return {[type]} [description]
     */
    $scope.$on('localizeResourcesUpdates', function() {
        $scope.generateNav();

        angular.forEach($scope.navs, function(value, key) {
            if(value.link && $location.path().split("/")[1] === value.link.split("/")[1]) {
                $scope.navs[key].current = true;
            } 
        });
    });

    /**
     * Генерация пунктов меню
     * @returns {undefined}
     */
    $scope.generateNav = function() {
        $scope.navs = [
            {
                name: localize.getLocalizedString("_GRAPHS_"), 
                link: '#/graphs', 
                current: false
            }
        ];
    };

    /**
     * Событие вызываемое при переходе по роутингу
     * @param  {[type]}   event   [description]
     * @param  {Function} next    [description]
     * @param  {[type]}   current [description]
     * @return {[type]}           [description]
     */
    $scope.$on('$routeChangeSuccess', function(event, next, current) {
        angular.forEach($scope.navs, function(value, key) {
            if($scope.navs[key].link) {
                $scope.navs[key].current = $scope.navs[key].link.split("/")[1] === $location.path().split("/")[1] ? true : false;
            }
        });
    });
    
    /**
     * Событие авторизации.
     */
    $scope.$on('login', function() {
        $scope.generateNav();
    });
}

/**
 * Контроллер страницы профиля
 * @param {type} $scope
 * @param {type} $routeParams
 * @param {type} AuthUser
 * @param {type} $route
 * @param {type} $rootScope
 * @param {type} $location
 * @returns {undefined}
 */
function ProfileController($scope, $routeParams, AuthUser, $route, $rootScope, $location) {
    $scope.comments = 0;

    $scope.onShowComments = function(criteria, user) {
        if($scope.comments == 0) {
            $scope.comments = 1;   
        }

        $rootScope.$broadcast('openComments', { criteria: criteria,  user: $routeParams.userId1 });
    }

    $scope.$on('closeComments', function() {
        $scope.comments = 0;
    });
    
}

/**
 * [QuickUserChangeCtrl description]
 * @param {[type]} $scope     [description]
 * @param {[type]} User       [description]
 * @param {[type]} AuthUser   [description]
 * @param {[type]} $rootScope [description]
 * @param {[type]} $location  [description]
 */
function QuickUserChangeCtrl($scope, User, AuthUser, $rootScope, $location, $route, $cookieStore) {
    $scope.users = [];

    $scope.onMoveUserClick = function($event, nextUser) {
        AuthUser.set(nextUser.sguid);
        
        $scope.workspace.user = nextUser;
        $scope.authUserId = nextUser.sguid;

        $cookieStore.remove("openGoal");
        $cookieStore.remove("openNeed");

        window.location.reload();
    }

    User.get_all({}, {}, function(data) {
        data.sort(function(a, b){
            if(a.login < b.login) return -1;
            if(a.login > b.login) return 1;
            return 0;
        })
        var users = [];
        angular.forEach(data, function(value, key){
            if(value.published == 1) {
                users.push(value);
            }
        });
        angular.forEach(users, function(value, key){
            value.fullname = value.login + ", " + value.name;
        });
        $scope.users = users;
    }); 
}

function RightUserController($scope, $location) {
    $scope.compare = true;
    if($location.search().user2) {
        $scope.rightId = $location.search().user2;
    }
}

function LeftUserController($scope, $location) {
    $scope.compare = true;
}

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

    $scope.userId = $routeParams.userId1;

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
    });

    $scope.$on('$routeChangeSuccess', function(event, next, current) {
        if($routeParams.userId1) {
            $("sub.du, sup.du").remove();
            $scope.userId = $routeParams.userId1;
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
        $location.path("/profile/"+user.sguid).search({});
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

/**
 * 
 * @param {[type]} $scope
 * @param {[type]} Goals
 * @param {[type]} Criterion
 */
function NeedsAndGoalsController($scope, Goals, Criterion, AuthUser, UserCriteriaValue, $rootScope, CriterionByGoal, UserCriteriaValueByUser, $routeParams, Needs, User, $element, $cookieStore) {
    $scope.needs = [];
    $scope.currentGoal = null;

    $rootScope.$broadcast('loaderShow');

    $scope.$watch('workspace.needs', function (newVal, oldVal, scope) {
        if($scope.workspace.needs) {
            $scope.needs = JSON.parse(JSON.stringify($scope.workspace.needs));
            angular.forEach($scope.needs, function(value, key){
                value.current = true;
            });
            if($scope.allOpen) {
                $scope.openAllNeeds($scope.needs);
            }
        }
    });

    $scope.$watch('user', function (newVal, oldVal, scope) {
        if($scope.user && $scope.user.sguid) {
            $scope.bindUserNeedsValues();
            angular.forEach($scope.needs, function(value, key){
                angular.forEach(value.goals, function(v2, k2) {
                    if(v2.current) {
                        $scope.getCriteriumByGoal(v2, value); 
                    }
                });
            });
        }
    });
    
    $scope.bindUserNeedsValues = function() {
        User.goals_points({id: $scope.user.sguid}, {}, function(goalsData) {
            var needsData = {};
            angular.forEach($scope.needs, function(needItem, needKey) {
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

                    angular.forEach(needItem.goals, function(goal) {
                        if (goal.current_value > max && goal.name != "Money") {
                          max = goal.current_value;
                          carreerMax = {goal: goal.sguid, points: goal.current_value};
                        }
                        if(goal.name == "Money") {
                          moneyPoints = goal.current_value;
                        }
                    });
                    needsData[needItem.sguid] = parseInt(carreerMax.points + moneyPoints);
                }

                needItem.current_value = needsData[needItem.sguid];
            });
            $rootScope.$broadcast('needUserValueLoaded', {
                needsValues: needsData,
                userId: $scope.user.sguid
            });
            $rootScope.$broadcast('goalUserValueLoaded', {
                goalsValues: goalsData,
                userId: $scope.user.sguid
            });

            $rootScope.$broadcast('loaderHide');

            var openGoal = $cookieStore.get("openGoal");
            if(!$scope.persistState) {
                openGoal = null;
            }

            if($scope.openFirst && !openGoal) {
                $scope.openCriteriumList({}, $scope.needs[0], $scope.needs[0].goals[0], $scope.needs);
            }

            if(openGoal && $scope.persistState) {
                var openNeed = $cookieStore.get("openNeed");

                var need = $scope.needs.filter(function(value) {
                    if(value.sguid == openNeed) {
                        return value;
                    }
                })[0];

                var goal = need.goals.filter(function(value) {
                    if(value.sguid == openGoal) {
                        return value;
                    }
                })[0];

                $scope.openCriteriumList({}, need, goal, $scope.needs);
                setTimeout(function() {
                    $("#content .tab .mypro.acrd").scrollTop($("#content .tab .mypro.acrd .crits ul li h5.current").offset().top - 200); 
                }, 0);
            }
        });
        /*});*/
    }

    $scope.addEmptyElement = function(goal) {
        angular.forEach(goal.criteriums, function(criteriumsItem, criteriumsKey) {
            if(criteriumsItem.criteria_values) {
                criteriumsItem.criteria_values.splice(0, 0, {
                    name: "none",
                    position: 0,
                    sguid: "none",
                    value: 0,
                }); 
            }
        });
    }

    /**
     * Забираем список критериев для goals
     * @param  {[type]} goal [description]
     * @return {[type]}      [description]
     */
    $scope.getCriteriumByGoal = function(goal, need) {
        $rootScope.$broadcast('loaderShow');

        $scope.currentGoal = goal;
        $scope.currentNeed = need;

        CriterionByGoal.query({id: goal.sguid}, function(data) {
            goal.criteriums = data;

            /**
             * добавляем пустой элемент
             */
            $scope.addEmptyElement(goal);

            /**
             * забираем значения для текущего пользователя
             */
            $scope.getCriteriumValueByUser(goal);

            $rootScope.$broadcast('loaderHide');

            setTimeout(function() {
                $("#content .crits ul li ul li .criterion li .bord .crp .tab").css("height", $("#content .crits ul li .cr").height());
            });
        }); 
    }

    /**
     * получаем данные по колбаскам для текущего пользователя
     * @param  {[type]} goal [description]
     * @return {[type]}      [description]
     */
    $scope.getCriteriumValueByUser = function(goal) {
        UserCriteriaValueByUser.query({id: $scope.user.sguid}, {}, function(d) {

            angular.forEach(d, function(userCriteriaItem, userCriteriaKey) {
                var fCriteria = goal.criteriums.filter(function(value) {
                    return value.sguid == userCriteriaItem.criteria_sguid;
                })[0];
                
                if(fCriteria) {
                    fCriteria.user_criteria_sguid = userCriteriaItem.criteria_value_sguid;
                    fCriteria.user_criteria_id = userCriteriaItem.sguid;

                    $rootScope.$broadcast('criteriaUserValueLoaded', {
                        fCriteria: fCriteria,
                        userId: $scope.user.sguid
                    });

                    var currentElement = $('li[data-id="'+fCriteria.sguid+'"] li[data-id="'+userCriteriaItem.criteria_value_sguid+'"]', $($element));
                    $scope.setCriteriaPosition(currentElement);
                }
            });
        });
    }

    /**
     * Скрываем все goals
     * @param  {object} массив всех needs
     * @return {object} 
     */
    $scope.closeAllGoals = function(needs) {
        angular.forEach(needs, function(value, key){
            angular.forEach(value.goals, function(v2, k2) {
                v2.current = false;
            });
        });
    }

    $scope.closeAllNeeds = function(needs) {
        angular.forEach(needs, function(value, key){
            value.current = false;
        });
    }

    /**
     * Открываем все needs
     * @param  {object} массив всех needs
     * @return {object}
     */
    $scope.openAllNeeds = function(needs) {
        angular.forEach(needs, function(value, key){
            value.current = true;   
        });
    }

    $scope.$on('criteriaOpen', function($event, message) {
        if(message.user.sguid != $scope.user.ssguid) {
            var goal = {};
            var need = {};
            angular.forEach($scope.needs, function(value, key) {
                angular.forEach(value.goals, function(value2, key2){
                    if(value2.sguid == message.goalId) {
                        goal = value2;
                        need = value;
                    }
                });
            });

            $scope.openCriteriumList({}, need, goal, $scope.needs, false);
        }
    });

    /**
     * 
     * @param  {[type]} goalId [description]
     * @return {[type]}        [description]
     */
    $scope.openCriteriumList = function ($event, need, goal, needs, noEvent) {
        if(!goal.current) {
            $scope.closeAllGoals(needs);
        
            goal.current = true;

            $scope.syncOpenAndClose($event, goal);

            $scope.getCriteriumByGoal(goal, need);

            if($scope.persistState) {
                $cookieStore.put("openGoal", goal.sguid);
                $cookieStore.put("openNeed", need.sguid);
            }
            $rootScope.$broadcast('criteriaOpened');
        } else {
            $scope.closeAllGoals(needs);
            $scope.syncOpenAndClose($event, goal);

            goal.current = false;
        }
        if(noEvent !== false) {
            //$rootScope.$broadcast('criteriaOpen', {user: $scope.user, goalId: goal.sguid});    
        }
    };

    $scope.syncOpenAndClose = function($event, goal) {
        var element = $($event.currentTarget);
        var id = element.attr("data-goalid");
        var items = $("a[data-goalid='"+id+"']");
        var hasCurrent = $(element).hasClass("current");

        $.each(items, function(key, value) {
            if($(value).attr("user-id") != $scope.user.sguid) {
                if(
                    goal.current && !$(value).hasClass("current") ||
                    !goal.current && $(value).hasClass("current")) {
                    setTimeout(function() {
                        $(value).click();
                    }, 0);    
                }
            }
        });
    }

    $scope.$on('openCriteriumList', function($event, message) {
        if(message.currentUserId != $scope.currentUserId) {
            $scope.openCriteriumList(message.event, message.need, message.goal, message.currentUserId);
        }
    });

    /**
     * 
     * @param  {[type]} criteria [description]
     * @return {[type]}          [description]
     */
    $scope.onCriteriaSelect = function(criteriaValue, criteria, $event, needItem, goalItem) {
        if(!$($event.target).hasClass("current") && $scope.user.sguid == AuthUser.get()) {
            if(criteriaValue.sguid !== "none") {
                UserCriteriaValue.create({}, $.param({
                    "user_guid": AuthUser.get(),
                    "criteria_guid": criteria.sguid,
                    "criteria_value_guid": criteriaValue.sguid
                }), function(data) {
                    criteria.user_criteria_id = data.message.sguid;
                    $rootScope.$broadcast('userCriteriaUpdate');
                });
            } else {
                if(criteria.user_criteria_id) {
                    UserCriteriaValue.del({id: criteria.user_criteria_id}, {}, function(data) {
                        $rootScope.$broadcast('userCriteriaUpdate');
                    }); 
                } else {
                    $rootScope.$broadcast('userCriteriaUpdate');
                }
            }

            var target = $event.target.tagName == "LI" ? $($event.target) : $($event.target).parent();
            $scope.setCriteriaPosition(target);
            $scope.updateNeedsAndAreaPoints(criteriaValue, criteria, needItem, goalItem, true);
        }
        
    }

    /**
     * 
     * @param  {[type]} criteria [description]
     * @return {[type]}          [description]
     */
    $scope.onPointsSet = function(currentValue, criteriaValue, needItem, goalItem) {
        if(currentValue != criteriaValue) {
            var delta = criteriaValue - currentValue;
            needItem.current_value = parseInt(needItem.current_value) + parseInt(delta);
            goalItem.current_value = parseInt(goalItem.current_value) + parseInt(delta);

            if(needItem.name == "Career") {
                var max = 0;
                var carreerMax = {};
                var moneyPoints = 0;

                angular.forEach(needItem.goals, function(goal) {
                    if (goal.current_value > max && goal.name != "Money") {
                      max = goal.current_value;
                      carreerMax = {goal: goal.sguid, points: goal.current_value};
                    }
                    if(goal.name == "Money") {
                      moneyPoints = goal.current_value;
                    }
                });

                needItem.current_value = parseInt(carreerMax.points + moneyPoints);
            }

            var newPoints = 0;
            angular.forEach($scope.needs, function(value, key){
                if(value.current_value) {
                    newPoints += value.current_value;    
                }
            });

            $scope.workspace.user.points = newPoints;

            User.update_legue({id: $scope.workspace.user.sguid}, function(data) {
                $scope.workspace.user.league = data.message;
            });
        }
    }

    /**
     * 
     * @param  {[type]} criteria [description]
     * @return {[type]}          [description]
     */
    $scope.getAffects = function(depend_guids, goalItem, deps) {
        var criteriums = 1;
        angular.forEach(depend_guids, function(value, key){
            var sguid = value;

            var fsCriterium = goalItem.criteriums.filter(function (criterium) { 
                return criterium.sguid == sguid;
            })[0];

            var fsCriteriumValue = fsCriterium.criteria_values.filter(function(value) {
                if(fsCriterium.old_user_criteria_sguids && deps) {
                    return value.sguid == fsCriterium.old_user_criteria_sguids;
                } else {
                    return value.sguid == fsCriterium.user_criteria_sguid;
                }
                
            })[0];

            if(fsCriteriumValue && fsCriteriumValue.value) {
                criteriums *= fsCriteriumValue.value;
            }

        });
        return criteriums;
    }

    /**
     * Обновляет данные needs и area на фронте
     * @param  {[type]} criteriaValue [description]
     * @param  {[type]} criteria      [description]
     * @param  {[type]} needItem      [description]
     * @param  {[type]} goalItem      [description]
     * @return {[type]}               [description]
     */
    $scope.updateNeedsAndAreaPoints = function(criteriaValue, criteria, needItem, goalItem, oneCall) {
        
        var fCriterium = goalItem.criteriums.filter(function (criterium) { 
            return criterium.sguid == criteria.sguid;
        });

        var currentValue = 0;
        
        if(fCriterium[0].user_criteria_sguid) {
            var fCriteriumValue = fCriterium[0].criteria_values.filter(function(value) {
                return value.sguid == fCriterium[0].user_criteria_sguid;
            }
        );

        if(criteria["depend_guids"].length == 0) {
          currentValue = fCriteriumValue[0].value;
        } else {
          var criteriums = $scope.getAffects(criteria["depend_guids"], goalItem, true);
          currentValue = fCriteriumValue[0].value*criteriums;
        }
        }

        if(!criteria["affects?"]) {
            if(criteria["depend_guids"].length == 0) {
              $scope.onPointsSet(currentValue, criteriaValue.value, needItem, goalItem);
            } else {
              var criteriums = $scope.getAffects(criteria["depend_guids"], goalItem);
              $scope.onPointsSet(currentValue, criteriaValue.value*criteriums, needItem, goalItem);
            }
        }

        if(criteria["affects?"]) {
        angular.forEach(criteria["affect_guids"], function(value, key){
          var sguid = value;

          var fsCriterium = goalItem.criteriums.filter(function (criterium) {
            return criterium.sguid == sguid;
          })[0];

          var fsCriteriumValue = fsCriterium.criteria_values.filter(function(value) {
            return value.sguid == fsCriterium.user_criteria_sguid;
          })[0];

          if(fsCriteriumValue) {
            $scope.updateNeedsAndAreaPoints(fsCriteriumValue, fsCriterium, needItem, goalItem);
          }
        });
        }

        if(fCriterium[0].user_criteria_sguid) {
            fCriterium[0].old_user_criteria_sguids = fCriterium[0].user_criteria_sguid;
        } else {
            fCriterium[0].old_user_criteria_sguids = 'none';
        }
            fCriterium[0].user_criteria_sguid = criteriaValue.sguid;

        if(oneCall) {
            $scope.updateNeedsAndAreaPoints(criteriaValue, criteria, needItem, goalItem);
        }
    }

    /**
     * перемещает текущее положение колбасок
     * @param {[type]} elm [description]
     */
    $scope.setCriteriaPosition = function(elm) {
        var parentLi  = elm,
            parentUl  = parentLi.parent(),
            slider = parentUl.parent().find("span");

        parentUl.find("li").removeClass("current");
        parentLi.addClass("current");

        if(parentLi.index() != 0) {
            var size = parentUl.get(0).clientWidth - parentLi.get(0).offsetLeft - parentLi.get(0).clientWidth;
            if (size <  15) {
                size = 0;
            }
            slider.css("width", size + "px").css("right", "-15px");
        } else {
            slider.css("width", "95%").css("right", "-1%");
        }
        
        var isCurrent = false;
        $.each(parentUl.find("li"), function(key, value) {
            if(value == parentLi.get(0)) {
                isCurrent = true;
            }

            if(!isCurrent) {
                $(value).addClass("white-text");
            } else {
                $(value).removeClass("white-text");
            }
            
        });
    }

    /**
     * выставляет колбаски на коль
     * @param {[type]} elm [description]
     */
    $scope.setCriteriaPositionNull = function(elm) {
        var parentLi  = elm.parent(),
            parentUl  = parentLi.parent(),
            slider = parentUl.parent().find("span");

        parentUl.find("li").removeClass("current").removeClass("white-text");
        parentUl.find("li:eq(0)").addClass("current");

        slider.css("width", "5%");
    }

    $scope.onShowGoals = function($event, needItem, sendEvent) {
        needItem.current = needItem.current ? false : true;
        if(sendEvent !== false) {
            $rootScope.$broadcast('showGoals', {user: $scope.user, needItem: needItem});
        }
    }

    $scope.$on('showGoals', function($event, message) {
        if(message.user.sguid != $scope.user.sguid) {
            var need = $scope.needs.filter(function(item) {
                if(item.sguid == message.needItem.sguid) {
                    return item;
                }
            })[0];
            $scope.onShowGoals({}, need, false);
        }
    });
}


/**
 * форма модального окна авторизации
 * @param {[type]} $scope [description]
 */
function LoginController($scope, Sessions, $rootScope, User, Social, $facebook, $location, $window, ImprovaLogin, $routeParams) {
    $scope.show = false;
    $scope.improva = 0;

    $scope.signup = false;
    $scope.captha = "";

    $scope.login = {
        login: "",
        password: ""
    }

    $scope.improvaForm = {
        login: "",
        password: ""
    }

    $scope.user = {
        login: "",
        email: "",
        password: ""
    }

    $scope.user_create = 0;

    $scope.$on('openLoginModal', function() {
        $scope.show = true;
    });

    $scope.$on('hideModal', function() {
        $scope.show = false;
    });

    $scope.improvaError = "";

    $scope.$on('socialLogined', function() {
    });

    $scope.onSuccessRegistration = 0;

    if($routeParams.onSuccess) {
        $scope.onSuccessRegistration = 1;
    }

    $scope.onCancelSuccess = function() {
        $scope.onSuccessRegistration = 0;
    }

    $scope.onCancelCreate = function() {
        $scope.user_create = 0;
        $location.path("/login/");
    }

    $scope.onSignStateChange = function() {
        $scope.signup = $scope.signup ? false : true;
    }

    $scope.improvaLogin = function() {
        $scope.improva = 1;
    }

    $scope.onCancelImprova = function() {
        $scope.improva = 0;
    }

    $scope.onImprovaSign = function() {
        $rootScope.$broadcast('loaderShow');
        ImprovaLogin.isset({}, {email: $scope.improvaForm.email, password: $scope.improvaForm.password}, function(dataImprova) {
            if(!dataImprova.authorized) {
                $scope.improvaError = "No user";
                $rootScope.$broadcast('loaderHide');
            } else {
                Sessions.signin({}, $.param({
                    "email": dataImprova.email,
                    "password": ""
                }), function(data) {
                    if(data.success) {
                        $rootScope.$broadcast('onSignin', {sguid: data.guid});
                        $rootScope.$broadcast('loaderHide');
                    } else {
                        User.create(
                            {user: JSON.stringify({
                                "login": dataImprova.email,
                                "email": dataImprova.email,
                                "password": "",
                                "confirmed": "1"
                            })}
                            ,function(data) {
                                if(data.success) {
                                    var user = {
                                        "name": dataImprova.name
                                    }

                                    if(dataImprova.birthday) {
                                        user["birthday"] = dataImprova.birthday;
                                    }

                                    User.updateUser({"id": data.message.guid},  {user: JSON.stringify(user)}, function(data) {
                                            Sessions.signin({}, $.param({
                                                "email": dataImprova.email,
                                                "password": ""
                                            }), function(data) {
                                                if(data.success) {
                                                    $rootScope.$broadcast('onSignin', {sguid: data.guid});
                                                    $rootScope.$broadcast('loaderHide');
                                                }
                                            });
                                        }
                                    );
                                    
                                } else {
                                    $rootScope.$broadcast('loaderHide');
                                }
                            }
                        );
                    }
                });
            }
        });
    }

    /**
     * Вызывается при нажатии ok в форме авторизации
     * @param  {[type]} $event [description]
     * @return {[type]}        [description]
     */
    $scope.onSingin = function(data) {

        Sessions.signin({}, $.param({
            "email": $scope.login.email,
            "password": $scope.login.password
        }), function(data) {
            if(data.success) {
                $rootScope.$broadcast('onSignin', {sguid: data.guid, isSocial: true});
                $scope.show = false;
            } else {
                $scope.error = data.message;
            }
        });
    }

    $scope.onKeyPress = function($event) {
        if(!$scope.LoginForm.$invalid) {
            $scope.onSingin();
        }
    }

    $scope.onKeyPressReg = function($event) {
        if(!$scope.RegForm.$invalid) {
            $scope.onAddUser();
        }
    }

    $scope.errorValidate = "";

    /**
     * 
     * @param {type} $event
     * @returns {undefined}
     */
    $scope.onAddUser = function ($event) {
        $rootScope.$broadcast('loaderShow');

        var phpquery = $.ajax({url:"test.php",
          type: "POST",
          async: false,
          data:{recaptcha_challenge_field:Recaptcha.get_challenge(),recaptcha_response_field:Recaptcha.get_response()},
          success:function(resp) {
            if(resp == "0") {
                $scope.errorValidate = "Text invalid";
                $rootScope.$broadcast('loaderHide');
            } else {
                User.create(
                    {user: JSON.stringify({
                        "name": $scope.user.email.split("@")[0],
                        "login": $scope.user.email,
                        "email": $scope.user.email,
                        "password": $scope.user.password
                    })}
                    ,function(data) {
                        $rootScope.$broadcast('loaderHide');
                        if(!data.success) {
                            $scope.errors = "";
                            $scope.errorEmail = "";
                            angular.forEach(data.errors, function(value, key) {
                                if(value && value == 'login: ["is already taken"]') {
                                    $scope.errorEmail = "Exists specified email.";
                                }
                            });
                        } else {
                            $scope.user_create = 1;
                        }
                    }
                );
            }
          }
        });
    }
    

    /**
     * 
     * @param  {[type]} $event [description]
     * @return {[type]}        [description]
     */
    $scope.regiostrationOpen = function($event) {
        $rootScope.$broadcast('registrationModalShow');
    }

    $scope.socialFacebookLogin = function() {
        FB.login(function(response) {
            if(!response.authResponse) {
                $scope.$apply(function() {
                    $rootScope.$broadcast('loaderHide');
                });
            }
        }, { scope: 'email' });
    };

    $scope.socialGooglePlusLogin = function() {
        gapi.auth.authorize({
            client_id: socialsAccess.googlePlus.applicationId[window.location.hostname], 
            scope: socialsAccess.googlePlus.scopes, 
            immediate: false
        }, handleAuthResult);
    };

    $scope.socialMicrosoftLiveLogin = function() {
        WL.login({
            scope: ["wl.signin", "wl.basic", "wl.emails", "wl.birthday"]
        }).then(
            function (session) {
                WL.api({
                    path: "me",
                    method: "GET"
                }, function(dataWL) {
                    Social.login({}, {email: dataWL.emails.account}, function(data) {
                        var updateUser = {};
                        console.log(dataWL);
                        if(data.was_created) {
                            updateUser["name"] = dataWL.first_name;
                            if(dataWL.birth_day) {
                                updateUser["birthday"] = dataWL.birth_day+"/"+dataWL.birth_month+"/"+dataWL.birth_year;
                            }
                        }
                        $rootScope.$broadcast('onSignin', {
                            sguid: data.guid, 
                            isSocial: true,
                            update: updateUser
                        });
                        $rootScope.$broadcast('loaderHide');
                        socialsAccess.live.isLoggined = true;
                    });
                });
            },
            function (sessionError) {
                Social.login({}, {email: response.email}, function(data) {
                    $rootScope.$broadcast('onSignin', {sguid: data.guid, isSocial: true});
                    $rootScope.$broadcast('loaderHide');
                    socialsAccess.facebook.isLoggined = true;
                });
            }
        );
    };

    $scope.$on('fb.auth.authResponseChange', function(data, d) {
        FB.api('/me', {fields: 'name,id,location,birthday,email'}, function(response) {
            Social.login({}, {email: response.email}, function(data) {
                var updateUser = {};
                if(data.was_created) {
                    updateUser["name"] = data.name;
                }
                
                $rootScope.$broadcast('onSignin', {
                    sguid: data.guid, 
                    isSocial: true, 
                    update: updateUser
                });
                $rootScope.$broadcast('loaderHide');
                socialsAccess.facebook.isLoggined = true;
            });
        });
    });
}

function LoaderController($scope) {
    var opts = {
      lines: 9, // The number of lines to draw
      length: 3, // The length of each line
      width: 24, // The line thickness
      radius: 34, // The radius of the inner circle
      corners: 0, // Corner roundness (0..1)
      rotate: 0, // The rotation offset
      direction: 1, // 1: clockwise, -1: counterclockwise
      color: ['#4a5875'], // #rgb or #rrggbb or array of colors
      speed: 0.7, // Rounds per second
      trail: 90, // Afterglow percentage
      shadow: false, // Whether to render a shadow
      hwaccel: true, // Whether to use hardware acceleration
      className: 'spinner', // The CSS class to assign to the spinner
      zIndex: 2e9, // The z-index (defaults to 2000000000)
      top: 'auto', // Top position relative to parent in px
      left: 'auto' // Left position relative to parent in px
    };
    var target = document.getElementById('loader');
    var spinner = new Spinner(opts).spin(target);

    $scope.$on('loaderShow', function() {
        $("#modal-shadow").css("height", $("#content").outerHeight(true)+$("header").outerHeight(true));
        $("#modal-shadow").addClass("show");
    });

    $scope.$on('loaderHide', function() {
        $("#modal-shadow").removeClass("show");
    });
}

function ContentController($scope, $rootScope, $route, $location) {
    
}

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
                $scope.compareState = 2;
                if($location.search().user2 != user.sguid) {
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
                $scope.compareState = 1;
                if($location.search().user1 != user.sguid) {
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

    $scope.$on('logout', function() {
        $scope.frends = [];
    });

    $scope.onUnfollow = function(user) {
        $rootScope.$broadcast('unfollow', {userId: AuthUser.get(), frendId: user.sguid});
    }

    $scope.onCompareToMain = function(user) {
        if($scope.rootUser.sguid) {
            $location.path("/profile/"+$scope.rootUser.sguid+"/"+user.sguid);
        } else {
            $location.path("/profile/"+user.sguid);
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
function MainController($scope, Leagues, User, $rootScope, $location, $timeout, AuthUser) {
    /**
     * Забираем список пользователей
     * @return {object} 
     */
    $scope.getPublishedUser = function() {
        User.for_main({}, {}, function(data) {
            var users = [];
            data.shuffle();
            angular.forEach(data, function(value, key){
                value.points = parseInt(value.points);
                if(isNaN(value.points)) {
                    value.points = 0;
                }
                if(!value.league) {
                    value.league = {name: "10"};
                }
                if(value.avatar) {
                    users.push(value);
                }
            });
            $scope.users = users;
        });
    }

    /**
     * Забираем список пользователей
     */
    $scope.getPublishedUser();
    

    /**
     * Событие перехода к пользователю
     * @param  {object} user
     * @return {object}     
     */
    $scope.onMoveToProfile = function(user) {
        $location.path("/profile/"+user.sguid);
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
        $location.path("/profile/"+$scope.rootUser.sguid+"/"+user.sguid);
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
        layoutMode: "masonryHorizontal"
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
        var contentWidth = $(".isotope").width();
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
    $scope.onDrag = function($event) {
        if(!$scope.scrollDelta) {
            $scope.scrollDelta = 0;
        }
        $scope.scrollDelta = $event.gesture.deltaX;
    }

    $scope.onLogin = function() {
      $location.path('/login/');
    };
    
}

/** Контроллер графика */
function GraphsController($scope, $rootScope, $route, $location, Leagues, User) {
    setInterval(function() {
        var key = 0;
        $.each($("#graphs tr"), function(key, value){ 
            key += 1;
            $.each($(value).find("td"), function(keyd, valued){
                var a = 10;
                var points = $(valued).attr("data-points");
                var step = ($(valued).attr("data-step"))*10000;
                if(points) {
                    if(points != 0) {
                        $(valued).find("a").css("top", (step-points)/100+"%");
                        $(valued).find("a").attr("data-sp", (step-points)/100);
                    } else {
                        $(valued).find("a").css("top", "100%");
                    }
                } else {
                    $(valued).find("a").css("top", "100%");
                }
                $(valued).find("a").css("z-index", key);
            })
        })
    }, 100);

    Leagues.query({}, {}, function(data){
        $scope.leagues = data;

        angular.forEach($scope.leagues, function(value, key){
            User.by_league({league_guid:value.sguid}, {}, function(v2, k2){
                var user2 = [];
                angular.forEach(v2, function(value, key){
                    if(value.published == 1) {
                        user2.push(value);
                    }
                });
                var users = user2.splice(0,10);

                if(users.length < 10) {
                    var i = 0;
                    for(i = users.length; i <= 10; i++) {
                        users.push({});
                    }
                }
                
                value.users = users;
            })
        });

    })

    User.get_all({}, {}, function(datas) {
        $scope.looserUser = datas.filter(function(item) {
            if(!item.league) {
                return item;
            }
        });
    });
}

function NeighboursCtrl($scope) {
}

/**
 * 
 * @param {[type]} $scope [description]
 */
function CompareController($scope, $location) {
    var needsCountLoaded = 0;
    var needsValues = {};
    var goalsCountLoaded = 0;
    var goalsValues = {};
    var crtiterias = {};
    var pointsCountLoaded = 0;
    var pointsValues = {};

    $scope.$on('getSelectedUserData', function($event, message) {
      pointsCountLoaded += 1;
      pointsValues[message.user.sguid] = message.user.points;
      if(pointsCountLoaded == 2) {
          var containers =  $("#content .pmain");
          containers.find(".du").remove();
          if(pointsValues[$location.search().user2] > pointsValues[$location.search().user1]) {
            containers.eq(1).append('<sup class="du"></sup>');
          } else {
            containers.eq(0).append('<sup class="du"></sup>');
          }
          pointsCountLoaded = 1;
      }
    });

    $scope.$on('needUserValueLoaded', function($event, message) {
      needsCountLoaded += 1;
      needsValues[message.userId] = message.needsValues;
      if(needsCountLoaded == 2) {
          angular.forEach(needsValues[$location.search().user2], function(value, key){
                $("li[data-needId='"+key+"'] .cr sup", $("#compare1")).remove();
                $("li[data-needId='"+key+"'] .cr sub", $("#compare2")).remove();

                if(value < needsValues[$location.search().user1][key]) {
                  $("li[data-needId='"+key+"'] .cr", $("#compare1")).append('<sup class="du dubidu"></sup>');
                } 
                if(value > needsValues[$location.search().user1][key]) {
                  $("li[data-needId='"+key+"'] .cr", $("#compare2")).append(' <sub class="du dubidu"></sub>');
                } 
          });
          needsCountLoaded = 1;
      }
    });

    $scope.$on('criteriaUserValueLoaded', function($event, message) {
      if(!crtiterias[message.fCriteria.sguid]) {
          crtiterias[message.fCriteria.sguid] = {};
      }
      var fCriterium = message.fCriteria;
      var fCriteriumValue = fCriterium.criteria_values.filter(function(value) {
          return value.sguid == fCriterium.user_criteria_sguid;
      })[0];

      crtiterias[message.fCriteria.sguid][message.userId] = fCriteriumValue;
      if(crtiterias[message.fCriteria.sguid][$location.search().user1] && crtiterias[message.fCriteria.sguid][$location.search().user2]) {
          var rootCriteria = crtiterias[message.fCriteria.sguid][$location.search().user2];
          var authCriteria = crtiterias[message.fCriteria.sguid][$location.search().user1];

          $("li[data-needId='"+fCriterium.sguid+"'] .cr sup", $("#compare1")).remove();
          $("li[data-needId='"+fCriterium.sguid+"'] .cr sub", $("#compare2")).remove();

          if(rootCriteria.value < authCriteria.value) {
             $("li[data-id='"+fCriterium.sguid+"']", $("#compare1")).append('<sup class="du bidubi"></sup>');
          }
          if(rootCriteria.value > authCriteria.value) {
             $("li[data-id='"+fCriterium.sguid+"']", $("#compare2")).append(' <sub class="du bidubi"></sub>');
          }
      }
    });

    $scope.$on('goalUserValueLoaded', function($event, message) {
        goalsCountLoaded += 1;
        goalsValues[message.userId] = message.goalsValues;
        if(goalsCountLoaded == 2) {
          angular.forEach(goalsValues[$location.search().user2], function(value, key) {
             $("li[data-needId='"+key+"'] .cr sup", $("#compare1")).remove();
             $("li[data-needId='"+key+"'] .cr sub", $("#compare2")).remove();

             if(value < goalsValues[$location.search().user1][key]) {
                $("li[data-goalid='"+key+"'] > h5", $("#compare1")).append(' <sup class="du"></sup>');
             } 
             if(value > goalsValues[$location.search().user1][key]) {
                $("li[data-goalid='"+key+"'] > h5", $("#compare2")).append('<sub class="du"></sub>');
             } 
          });
          goalsCountLoaded = 1;
      }
    });
}

function TopGalleryController($scope, Leagues, User, $routeParams, $location, $rootScope) {
    $scope.range = 10000;

    $scope.onUserPage = function(userItem) {
        $location.path("/profile/"+userItem.sguid);
    }

    $scope.$on("userControllerGetUser", function($event, message) {
        if(!$rootScope.topUsers || $rootScope.topUsers.length == 0) {
            User.get_from_to_points({from: parseInt(message.user.points-$scope.range), to: parseInt(message.user.points+$scope.range)}, {}, function(newUsers) {
                angular.forEach(newUsers, function(value, key){
                    if(!value.published) {
                        //newUsers.splice(key, 1);
                    }
                    if($routeParams.userId1 == value.sguid) {
                        newUsers.splice(key, 1);
                    } 
                    value.points = parseInt(value.points);
                });
                $scope.users = newUsers;
                $rootScope.topUsers = newUsers;
            }); 
        } else {
            if(!$scope.users ||  $scope.users.length == 0) {
                $scope.users = $rootScope.topUsers;    
            }
        }
    });
}

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
        if(!$event.toElement.classList.contains('navigate')) {
            angular.forEach($scope.users, function(item, key) {
                if(item != user) {
                    item.hovered = false;
                    item.hover = false;
                }
                item.fullAnimate = true;
            });

            $timeout(function() {
                user.hover = user.hover ? false : true;
            }, 0);
        }
    }

    /**
     * Событие перехода к пользователю
     * @param  {object} user
     * @return {object}     
     */
    $scope.onMoveToProfile = function(user) {
        $location.path("/profile/"+user.sguid);
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

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function RootController($scope, $facebook, AuthUser, User, $rootScope, Needs, Social, $cookieStore, States, Professions, $location) {
    /**
     * Забираем список друзей из localStorage
     * @return {Array} [description]
     */
    $scope.guestFollowGetOnStorage = function() {
        var follows =  JSON.parse(localStorage.getItem('follows'));
        if(follows == null) {
            follows = [];
        }
        return follows;
    }

    $scope.authUserId = AuthUser.get();
    $scope.authUserId = AuthUser.get();
    $scope.workspace = {};
    $scope.tmpFollows = $scope.guestFollowGetOnStorage();

    $scope.controller = $location.path().split("/").join("_");

    $scope.$on('$routeChangeStart', function(event, next, current) {
        $scope.controller = $location.path().split("/").join("_");

        $rootScope.$broadcast('hideSearch');
    });

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

    $scope.onLogout = function() {
        AuthUser.logout();
    
        if(socialsAccess.facebook.isLoggined) {
            $facebook.logout();
            socialsAccess.facebook.isLoggined = false;  
        }

        if(socialsAccess.live.isLoggined) {
            WL.logout();
            socialsAccess.live.isLoggined = false;  
        }
        
        if(socialsAccess.googlePlus.isLoggined) {
            $.get("https://mail.google.com/mail/u/0/?logout&hl=en");  
            
            socialsAccess.googlePlus.isLoggined = false;  
        }
        
        $scope.workspace.user = null;
        $rootScope.$broadcast('logout');
        $location.path("/");
    }

    $scope.getUserInfo = function() {
        if($scope.authUserId) {
            User.query({id: $scope.authUserId}, function(data) {
                $scope.workspace.user = data;
                $scope.workspace.user.points = parseInt($scope.workspace.user.points);
                if(isNaN($scope.workspace.user.points)) {
                    $scope.workspace.user.points = 0;
                }

                User.get_friends({id: $scope.authUserId}, {}, function(frends) {
                   $scope.workspace.user.frends = frends;
                   $rootScope.$broadcast('authUserGetData');
                });
            });
        }
    };

    $scope.getState = function() {
        States.query({}, {}, function(data) {
            $scope.workspace.states = data;
            $rootScope.$broadcast('statesGet');
        });
    };

    $scope.getProfessions = function() {
        /*
        Professions.query({}, {}, function(data) {
            $scope.workspace.professions = data;
            $rootScope.$broadcast('professionsGet');
        });
        */
    };

    $scope.getNeeds = function() {
        Needs.query({}, {}, function(data) {
            $scope.workspace.needs = data;
            $rootScope.$broadcast('needsGet');
        });
    };

    $scope.getProfessions();
    $scope.getState();
    $scope.getUserInfo();
    $scope.getNeeds();

    $scope.$on('updateUserData', function($event, message) {
        if(message.user.sguid === $rootScope.authUserId) {
            $rootScope.workspace.user = message.user;
        }
    });

    $scope.$on('unfollow', function($event, message) {
        if($scope.authUserId) {
            $scope.authUnFollow(message);
        } else {
            $scope.guestUnFollow(message);
        }
    });

    $scope.$on('follow', function($event, message) {
        if($scope.authUserId) {
            $scope.authFollow(message);
        } else {
            $scope.guestFollow(message);
        }
    });

    $scope.authFollow = function(message) {
        User.create_friendship({id: message.userId}, {
            friend_guid: message.frendId
        }, function(response) {     
            if(response.success) {
                $scope.workspace.user.frends.push({sguid: response.message.guid, user: message.user});
                $rootScope.$broadcast('followCallback', {frendId: message.frendId});
            }
        });
    };

    $scope.guestFollow = function(message) {
        $scope.tmpFollows.push({sguid: null, user: message.user});
        $scope.guestFollowPersist();
        $rootScope.$broadcast('followCallback', {frendId: message.frendId});
    };

    $scope.guestFollowPersist = function() {
        localStorage.setItem('follows', JSON.stringify($scope.tmpFollows));
    }

    

    $scope.authUnFollow = function(message) {
        User.destroy_friendship({id: message.userId, friendId: message.frendId}, { }, function() {
            var frend = $scope.workspace.user.frends.filter(function(data) {
                if(data.user.sguid === message.frendId) {
                    return data;
                }
            })[0];
            var index = $scope.workspace.user.frends.indexOf(frend);
            $scope.workspace.user.frends.splice(index, 1);

            $rootScope.$broadcast('unfollowCallback', {frendId: message.frendId});
        });
    };

    $scope.guestUnFollow = function(message) {
        var frend = $scope.tmpFollows.filter(function(data) {
            if(data.user.sguid === message.frendId) {
                return data;
            }
        })[0];
        var index = $scope.tmpFollows.indexOf(frend);
        $scope.tmpFollows.splice(index, 1);
        $scope.guestFollowPersist();
        $rootScope.$broadcast('unfollowCallback', {frendId: message.frendId});
    };

    $scope.$on('onSignin', function($event, message) {
        if(message && message.sguid) {
            User.query({id: message.sguid}, function(data) {
                $scope.workspace.user = data;
                if(message.update) {
                    User.updateUser(
                        { "id": $scope.workspace.user.sguid },  
                        { user: JSON.stringify(message.update) }, 
                        function(data) {
                            if(message.update.name) {
                                $scope.workspace.user.name = message.update.name;
                            }
                        }
                    );
                }
                
                $scope.workspace.user.points = parseInt($scope.workspace.user.points);
                if(isNaN($scope.workspace.user.points)) {
                    $scope.workspace.user.points = 0;
                }
                AuthUser.set(message.sguid);
                if($scope.workspace.user.points == 0) {
                  $cookieStore.put("myProfileTab", 3);
                } else {
                  $cookieStore.put("myProfileTab", 1);
                }

                User.get_friends({id: message.sguid}, function(frends) {
                    $scope.workspace.user.frends = frends;
                    $scope.authUserId = data.sguid;

                    $rootScope.$broadcast('frendLoad');

                    if(message.isSocial) {
                        $rootScope.$broadcast('socialLogined');
                    }

                    if(!message.noRedirect) {
//                        $location.path("/");
                        $location.path('/my_profile');
                    }
                });
            });    
        }
    });
    
    $scope.gplusAuth = function(email, name) {
        Social.login({}, {email: email}, function(data) {
            console.log(data);
            var updateUser = {};
            if(data.was_created) {
                updateUser["name"] = name;
            }

            $rootScope.$broadcast('onSignin', {sguid: data.guid, isSocial: true , update: updateUser});
            $rootScope.$broadcast('loaderHide');

        });
    };

    $scope.gplusFalse = function() {
        $rootScope.$broadcast('loaderHide');
    };
}

function LeaguesController($scope, Leagues, User) {
    $scope.leagues = [];

    /**
    * Забираем запросом список лиг.
    * @param  {[type]} data [description]
    * @return {[type]}      [description]
    */
    Leagues.query({}, {}, function(data) {
        data = data.reverse();

        $scope.leagues = data;
        angular.forEach($scope.leagues, function(value, key){
           User.by_league({league_guid: value.sguid}, {}, function(v2, k2) {
                v2 = v2.filter(function(value) {
                    if(value.published == 1) {
                        return value;
                    }
                });
                value.users = v2;
            })
        });
    })
}

/**
 * Костратолка картинок
 * @param {[type]} $scope     [description]
 * @param {[type]} $rootScope [description]
 */
function CropImageController($scope, $rootScope) {
    $scope.user = [];
    $scope.positions = [];
    $scope.imageData = '';
    $scope.show = false;
    $scope.jcrop = null;

    $scope.$on('cropImage', function($event) {
        $rootScope.$broadcast('loaderShow');
        $scope.user = $scope.workspace.user;
        $scope.show = true;
        $("#crop_modal").show();
        $scope.onReadFile();
    });

    $scope.$on('cropImageClose', function($event) {
        $scope.close();
    });

    $scope.close = function() {
        $scope.show = false;
        $("#crop_modal").hide();
    }

    $scope.onSend = function() {
        $rootScope.$broadcast('loaderShow');
        var crop_img = $("#crop_img");
        var canvas = document.getElementById("image_canvas");
        
        var ctx = canvas.getContext("2d");
        var image = new Image();
        image.src = $scope.imageData;
        image.onload = function() {
            var naturalWidth = image.width;
            var naturalHeight = image.height;
            var cropWidth = crop_img.width();
            var cropHeight = crop_img.height();

            $scope.positions.x = naturalWidth/cropWidth*$scope.positions.x;
            $scope.positions.y = naturalHeight/cropHeight*$scope.positions.y;
            $scope.positions.w = naturalWidth/cropWidth*$scope.positions.w;
            $scope.positions.h = naturalHeight/cropHeight*$scope.positions.h;

            $(canvas).attr("width",$scope.positions.w);
            $(canvas).attr("height",$scope.positions.h);

            ctx.drawImage(image, $scope.positions.x, $scope.positions.y, $scope.positions.w, $scope.positions.h, 0 , 0, $scope.positions.w, $scope.positions.h);
            var img = canvas.toDataURL("image/png");

            var data = new FormData();
            data.append("picture", img);
            data.append("owner_type", 0);

            $.ajax({
                url: host+'/pictures/'+$scope.user.sguid,
                data: data,
                cache: false,
                contentType: false,
                processData: false,
                type: 'PUT'
            }).done(function(data) {
                $scope.$apply(function(){
                    if(data.success) {
                        $scope.workspace.user.avatar = data.message.scheme+"://"+data.message.host+data.message.path;
                        $scope.close();
                    }
                    $rootScope.$broadcast('loaderHide');
                    $scope.shouldBeOpen = false; 
                });
            });
        };
    }

    /**
     * [onReadFile description]
     * @param  {[type]} $event
     * @return {[type]}
     */
    $scope.onReadFile = function($event) {
        var file = document.getElementById("photo_crop").files[0];
        var reader = new FileReader();
        var positions = [];
        
        reader.onload = function(data) {
            var crop_img = $("#crop_img");
            $scope.imageData = data.target.result;
            $(crop_img).attr("src", data.target.result);
            $rootScope.$broadcast('loaderHide');
            if($scope.jcrop) {
                $scope.jcrop.data('Jcrop').destroy();
            }
            $scope.jcrop = crop_img.Jcrop({boxWidth: 500, boxHeight: 500 , minSize: [200, 200], aspectRatio: 1, setSelect: [0, 0, 200, 200], onChange: function(data) {
                $scope.positions = data;
            }}); 
        };
        reader.readAsDataURL(file);
    }
}

function MyProfileController($scope, $rootScope, User, $location, $cookieStore, Professions, ProfessionCreate, City, States, CityByState) {
    $scope.tab = 2;
    $scope.curNeed = null;
    $scope.curProff = [];
    $scope.curState = [];
    $scope.showProf = false;
    $scope.showProf2 = false;
    $scope.showState = false;
    $scope.showState2 = false;
    $scope.isAddState = false;
    $scope.career = null;
    $scope.isAddProff = false;
    $scope.states = [];
    $scope.state = null;
    $scope.countCareerChange = 0;
    $scope.countCityChange = 0;

    /**
     * Имена всех пользователей
     * @type {Array}
     */
    $scope.names = [];

    /**
     * Список имен отображаемый
     * @type {Array}
     */
    $scope.showedNames = [];

    /**
     * Показываем или нет список имен пользователей
     * @type {Boolean}
     */
    $scope.isShowNames = false;

    $("body").on("click", function() {
        $scope.$apply(function() {
            $scope.showProf2 = false;
            $scope.showState2 = false;
            $scope.showedNames = [];
        });
    });

    /**
     * Забираем имена всех пользователей
     * @param  {[type]} $event [description]
     * @return {[type]}        [description]
     */
    $scope.getAllNames = function($event) {
        User.get_names({}, {}, function(data) {
            $scope.names = JSON.parse(data.message);
        });
    }

    /**
     * Проверяем вхождение введенного имени в списке имен
     * @param  {[type]} $event [description]
     * @return {[type]}        [description]
     */
    $scope.testUserNames_ = function($event) {
        $scope.showedNames = [];

        var reg = new RegExp($scope.workspace.user.name, "i");
        angular.forEach($scope.names, function(value, key) {
            if(value && reg.test(value)) {
                $scope.showedNames.push(value);
            }
        });
        console.log($scope.showedNames);
        if(!$scope.workspace.user.name) {
            $scope.showedNames = [];
        }
    }

    $scope.selectCareer = function($event, career) {
        if(career) {
            Professions.query({ id: career.sguid }, {}, function(data) {
                $scope.showProf = true;
                $scope.curProff = data;
                $scope.career = career;

                if($scope.countCareerChange != 0) {
                    $scope.workspace.user.profession = {};
                }

                $scope.countCareerChange += 1;
            });    
        }
    }

    $scope.selectCityByState = function($event, state) {
        if(state) {
            CityByState.query({ id: state.sguid }, {}, function(data) {
                $scope.showState = true;
                $scope.curState = data;
                $scope.state = state;

                if($scope.countCityChange != 0) {
                    $scope.workspace.user.city = {};
                }

                $scope.countCityChange += 1;
            });    
        }
    }

    $scope.selectCity = function($event) {
        City.query({}, {}, function(data) {
            $scope.showState = true;
            $scope.curState = data;
        });
    }

    $scope.getStates = function($event) {
        States.query({}, {}, function(data) {
            $scope.showState = true;
            $scope.states = data;
        });    
    }

    $scope.getStates();
    $scope.selectCity();
    $scope.getAllNames();

    $scope.deleteItem = function($event, item, key) {
        ProfessionCreate.del({id: item.sguid}, {}, function(data) {
            $scope.curProff.splice(key, 1);
        });
    }

    $scope.deleteCityItem = function($event, item, key) {
        City.del({id: item.sguid}, {}, function(data) {
            $scope.curState.splice(key, 1);
        });
    }

    $scope.selectCurrentProfession = function($event, item, key) {
        $scope.showProf2 = false;
        $scope.isAddProff = false;
        $scope.workspace.user.profession.name = item.name;
        $scope.workspace.user.profession.sguid = item.sguid;
        $scope.onPublish();    
    }

    $scope.selectCurrentCity = function($event, item, key) {
        $scope.showState2 = false;
        $scope.isAddState = false;
        $scope.workspace.user.city.name = item.name;
        $scope.workspace.user.city.sguid = item.sguid;
        $scope.onPublish();    
    }

    $scope.selectProfession = function($event) {
        var countShow = 0;
        var proffisset = false;

        if($scope.workspace.user.profession.name.length > 0) {
            angular.forEach($scope.curProff, function(value, key) {
                var reg = new RegExp($scope.workspace.user.profession.name, "i");
                if(reg.test(value.name)) {
                    countShow += 1;
                    value.show = true;
                } else {
                    value.show = false;
                }
                if(value.name == $scope.workspace.user.profession.name) {
                    $scope.isAddProff = false;
                    proffisset = true;
                }
            });    
        } else {
            $scope.showProf2 = false;
            $scope.isAddProff = false;
        }
        

        if(!proffisset) {
            $scope.isAddProff = true;
        }

        if(countShow > 0) {
            $scope.showProf2 = true;
        } else {
            $scope.showProf2 = false;
            $scope.isAddProff = true;
        }

        if($scope.workspace.user.profession.name.length == 0) {
            $scope.isAddProff = false;
        }
    }

    $scope.testCity = function($event) {
        var countShow = 0;
        var proffisset = false;

        if($scope.workspace.user.city.name.length > 0) {
            angular.forEach($scope.curState, function(value, key) {
                var reg = new RegExp($scope.workspace.user.city.name, "i");
                if(reg.test(value.name)) {
                    countShow += 1;
                    value.show = true;
                } else {
                    value.show = false;
                }
                if(value.name == $scope.workspace.user.city.name) {
                    $scope.isAddState = false;
                    proffisset = true;
                }
            });    
        } else {
            $scope.showState2 = false;
        }
        

        if(!proffisset) {
            $scope.isAddState = true;
        }
        if(countShow > 0) {
            $scope.showState2 = true;
        } else {
            $scope.showState2 = false;
            $scope.isAddState = true;
        }

        if($scope.workspace.user.city.name.length == 0) {
            $scope.isAddState = false;
        }
    }

    $scope.addProfession = function($event) {
        ProfessionCreate.create({}, {
            "profession": { 
                name: $scope.workspace.user.profession.name 
            },
            "goal_guid": $scope.career.sguid
        }, function(data) {
            $scope.workspace.user.profession.name = data.message.name;
            $scope.workspace.user.profession.sguid = data.message.guid;
            $scope.onPublish();
            Professions.query({ id: $scope.career.sguid }, {}, function(data) {
                $scope.curProff = data;
                $scope.isAddProff = false;
            });
        });

        return false;
    }

    $scope.addCity = function($event) {
        City.create({}, {
            "city": { 
                name: $scope.workspace.user.city.name
            },
            "state_guid": $scope.state.sguid
        }, function(data) {
            $scope.workspace.user.city.name = data.message.name;
            $scope.workspace.user.city.sguid = data.message.guid;
            $scope.onPublish();
            City.query({}, {}, function(data) {
                $scope.curState = data;
                $scope.isAddState = false;
            });
        });

        return false;
    }

    if($cookieStore.get("myProfileTab")) {
        $scope.tab = $cookieStore.get("myProfileTab");    
    }

    /**
     * Проверка изменения даты рождения
     * @param  {[type]} newVal [description]
     * @param  {[type]} oldVal [description]
     * @param  {[type]} scope  [description]
     * @return {[type]}        [description]
     */
    $scope.$watch("workspace.user.birthday", function (newVal, oldVal, scope) {
        if(newVal) {
            $scope.workspace.user.birthdayDate = moment(newVal).toDate();
            console.log($scope.workspace.user.birthdayDate);
        }
    });

    $scope.$watch("workspace.user.profession", function (newVal, oldVal, scope) {
        if($scope.workspace.user && $scope.workspace.user.profession && $scope.curNeed) {
            if($scope.workspace.user.profession.goal_sguid) {
                $scope.career = $scope.curNeed.goals.filter(function(value) {
                    if(newVal.goal_sguid == value.sguid) {
                        return value;
                    }
                })[0];
                $scope.selectCareer({}, $scope.career);
                $scope.showProf = true;    
            }
        }
    });

    $scope.$watch("workspace.user.state", function (newVal, oldVal, scope) {
        if($scope.workspace.user && $scope.workspace.user.state && $scope.states.length > 0) {
            angular.forEach($scope.states, function(value, key){
                if(value.sguid == $scope.workspace.user.state.sguid) {
                    $scope.state = value;
                }
            });
            $scope.selectCityByState({}, $scope.state);
            $scope.showState = true;
        }
    });

    $scope.$watch("workspace.user", function (newVal, oldVal, scope) {
        if($scope.workspace.user && !$scope.workspace.user.profession && $scope.curNeed) {
            $scope.career = $scope.curNeed.goals[1];
            $scope.selectCareer({}, $scope.career);
        }

        if($scope.workspace.user && !$scope.workspace.user.city && $scope.states.length > 0) {
            $scope.setDefaultState();
        }
    });

    $scope.setDefaultState = function() {
        angular.forEach($scope.states, function(value, key){
            if(value.sguid == "459827700832404777") {
                $scope.state = value;
            }
        });
        $scope.selectCityByState({}, $scope.state);
    }

    $scope.$watch("states", function (newVal, oldVal, scope) {
        if($scope.workspace.user && !$scope.workspace.user.city && $scope.states.length > 0) {
            $scope.setDefaultState();
        }
        if($scope.workspace.user && $scope.workspace.user.city && $scope.workspace.user.state && $scope.states.length > 0) {
            angular.forEach($scope.states, function(value, key){
                if(value.sguid == $scope.workspace.user.state.sguid) {
                    $scope.state = value;
                }
            });
            $scope.selectCityByState({}, $scope.state);
            $scope.showState = true;
        }
    });

    $scope.$watch("workspace.needs", function (newVal, oldVal, scope) {
        if($scope.workspace.needs) {

            var needs = JSON.parse(JSON.stringify($scope.workspace.needs)); ;
            $scope.curNeed = needs.filter(function(value) {
                if(value.sguid == "169990243011789827") {
                    return value;
                }
            })[0];
            $scope.curNeed.goals = $scope.curNeed.goals.filter(function(value) {
                if(value.sguid != "170689401829983233") { return value }
            });

            if($scope.workspace.user && $scope.workspace.user.profession) {
                $scope.career = $scope.curNeed.goals.filter(function(value) {
                    if($scope.workspace.user.profession.goal_sguid == value.sguid) {
                        return value;
                    }
                })[0];
                $scope.selectCareer({}, $scope.career);
                $scope.showProf = true;
            }
            if($scope.workspace.user && !$scope.workspace.user.profession) {
                $scope.career = $scope.curNeed.goals[1];
                $scope.selectCareer({}, $scope.career);
            }
        }
    });

    $scope.$watch("workspace.user.birthdayDate", function (newVal, oldVal, scope) {
        if(oldVal && newVal) {
            $scope.onPublish();
        }
    });

    $scope.$watch("workspace.user.name", function (newVal, oldVal, scope) {
        if(oldVal && newVal) {
            $scope.onPublish();
        }
    });

    $scope.$on('criteriaOpened', function($event) {
       $("#content .tab .mypro_wr .mypro").scrollTop(0);
    });

    $scope.nameIsError = false;

    /**
     * Публикация профиля
     * Пока не работает нет backend
     * @param  {[type]} $event [description]
     * @return {[type]}        [description]
     */
    $scope.onPublish = function($event) {
        if(!$scope.workspace.user.published) {
            $scope.workspace.user.published = 0;
        }

        var birthday = $scope.workspace.user.birthday;
        if($scope.workspace.user.birthdayDate) {
            var birthday = moment($scope.workspace.user.birthdayDate).format("DD/MM/YYYY");
        } 

        var user = {
                "login": $scope.workspace.user.login,
                "email": $scope.workspace.user.email
        }

        if($scope.workspace.user.name) {
            user["name"] = $scope.workspace.user.name;
        }

        if($scope.workspace.user.city) {
            user["city"] = $scope.workspace.user.city.sguid;
        }

        if(birthday) {
            user["birthday"] = birthday;
        }

        if($scope.workspace.user.profession) {
            user["profession"] = $scope.workspace.user.profession.sguid;
        }

        User.updateUser({"id": $scope.workspace.user.sguid},  {user: JSON.stringify(user)}, function(data) {
                if(data.success) {
                    $scope.nameIsError = false;
                } else {
                    var isName = false;
                    angular.forEach(data.errors, function(value, key){
                        if(value == 'name: ["is already taken"]') {
                            isName = true;
                        }
                    });
                    if(isName) {
                        $scope.nameIsError = true;
                    } else {
                        $scope.nameIsError = false;
                    }
                }
            }
        );
    }

    /**
     * Публикация профиля
     * Пока не работает нет backend
     * @param  {[type]} $event [description]
     * @return {[type]}        [description]
     */
    $scope.onUnPublish = function($event) {
        var user = {
            "published": 0
        }

        User.updateUser({"id": $scope.workspace.user.sguid},  {user: JSON.stringify(user)}, function(data) {
                $scope.workspace.user.published = 0;
            }
        );
    }

    /**
     * Публикация профиля
     * Пока не работает нет backend
     * @param  {[type]} $event [description]
     * @return {[type]}        [description]
     */
    $scope.onOnPublish = function($event) {
        var user = {
            "published": 1
        }

        User.updateUser({"id": $scope.workspace.user.sguid},  {user: JSON.stringify(user)}, function(data) {
                $scope.workspace.user.published = 1;
            }
        );
    }

    $scope.onChangeEmail = function() {
        $location.path("/change_email"); 
    }

    $scope.onChangePassword = function() {
        $cookieStore.put("changePasswordOnUser", "1");
        $location.path("/change_password");
    }

    $scope.$watch("workspace.user.points", function (newVal, oldVal, scope) {
        if($scope.workspace.user && $scope.workspace.user.sguid && !$scope.workspace.user.league) {
            $scope.workspace.user.league = {};
            $scope.workspace.user.league.name = "10";
        }
    });

    $scope.dateOptions = {
        changeYear: true,
        changeMonth: true,
        yearRange: '1900:-0'
    };

    $scope.onChange = function(tab) {
        $scope.tab = tab;
        $cookieStore.put("myProfileTab", tab);
    }
}

function ChangeEmailController($scope, User, $location, Sessions) {
    $scope.form = {
        password: "",
        newEmail: ""
    }

    $scope.onCancel = function() {
        $location.path("/my_profile");
    }

    $scope.onChangeEmail = function() {
        Sessions.signin({}, $.param({
            "login": $scope.workspace.user.login,
            "password": $scope.form.password
        }), function(data) {
            if(data.success) {
                var user = {
                    "email": $scope.form.newEmail
                }

                User.updateUser({"id": $scope.workspace.user.sguid},  {user: JSON.stringify(user)}, function(data) {
                        $scope.workspace.user.email = $scope.form.newEmail;
                        $location.path("/my_profile/");
                    }
                );
            } else {
                $scope.error = data.message;
            }
        });
    }
}

function ChangePasswordController($scope, Sessions, User, $location, $rootScope, MailHash, $routeParams, Password, $window, $cookieStore) {
    $scope.form = {
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
        email: "",
        code: ""
    }

    $scope.onChangePasswordCancel = function() {
        $scope.onBack();
    }

    $scope.onChangePasswordCancel2 = function() {
        $scope.state = 1;
    }

    $scope.message = 0;

    $scope.state = 1;

    $scope.userSguid = "";

    $scope.hash = "";

    if($routeParams.hash) {
        $scope.hash = $routeParams.hash;
        $scope.state = 2;
    }

    $scope.onBack = function() {
        if($cookieStore.get("changePasswordOnUser")) {
            $location.path("/my_profile");
        } else {
            $location.path("/login");
        }

        $cookieStore.remove("changePasswordOnUser");
    }

    $scope.onChangePasswordChanged = function() {
        $scope.onBack();
    }

    $scope.onCancel = function() {
        $scope.onBack();
    }

    $scope.onChangePasswordOk = function() {
        $scope.message = 0;
        $scope.state = 2;
    }

    $scope.onChangePassword = function() {
        $scope.message = 1;

        MailHash.create({}, {
            "email": $scope.form.email
        }, function(data) {
            $scope.userSguid = data.guid;
        });
    }

    $scope.onChangePasswordBegin = function() {
        var user = {
            "password": $scope.form.newPassword,
            "email": $scope.form.email,
            "code": $scope.form.code
        }

        Password.update({},  user, function(data) {
                $scope.message = 3;
            }
        );
    }
}

function FollowCaruselController($scope) {
    $scope.position = 0;
    $scope.countFrend = 0;

    $scope.onLeft = function() {
        $scope.position -= 1;
    }

    $scope.onRight = function() {
        $scope.position += 1;
    }

    $scope.$watch("frends", function (newVal, oldVal, scope) {
        $scope.countFrend = newVal.length;
    });
}

function SearchController($scope, User, $rootScope, $location) {
    $scope.searchText = "";
    $scope.resultSearch = [];
    $scope.usersCollections = [];

    $scope.onCompare = function(userItem) {
        $scope.resultSearch = [];
        $scope.searchText = "";
        $location.path("/profile/"+userItem.sguid);
    }

    $scope.onAdvanceSearch = function() {
        $scope.resultSearch = [];
        $scope.searchText = "";
        $location.path("/search").search({text: $scope.searchText});
    }

    $("body").on("click", function() {
        $scope.$apply(function() {
            $scope.resultSearch = [];
            $scope.searchText = "";
        });
    });

    $scope.test_ = function() {
        angular.forEach($scope.usersCollections, function(value, key) {
            var reg = new RegExp($scope.searchText.replace("[", "\\[").replace("]", "\\]"), "i");
            if(value.name && value.name != null && value.name != "null" && reg.test(value.name)) {
                value.points = parseInt(value.points);
                if(!value.league) {
                    value.league = {name: "10"};
                }
                var isset = false;
                angular.forEach($scope.resultSearch, function(resValue, resKey){
                    if(resValue.sguid == value.sguid) {
                        isset = true;
                    }
                });
                if(!isset) {
                    $scope.resultSearch.push(value);   
                }
            }
        });
        $rootScope.$broadcast('loaderHide');
    }

    $scope.onSearch = function() {
        if($scope.searchText.length > 0) {
            $rootScope.$broadcast('loaderShow');
            $scope.resultSearch = [];
            if($scope.usersCollections.length == 0) {
                User.for_main({}, {}, function(data) {
                    $scope.usersCollections = data;
                    $scope.test_();
                });  
            } else {
                $scope.test_();
            }
        } else {
            $scope.resultSearch = [];
            $rootScope.$broadcast('loaderHide');
        }
    }

    $scope.$on('hideSearch', function($event) {
       $scope.resultSearch = [];
       $scope.searchText = "";
    });
}

function SearchAdvanceController($scope) {

}

function CommentsController($scope, $rootScope, Comments) {
    $scope.user = null;
    $scope.criteria = null;
    $scope.form = {
        message: ""
    }

    $scope.commentsList = [];
    
    $scope.onClose = function() {
        $rootScope.$broadcast('closeComments');  
    }

    $scope.$on('openComments', function($event, message) {
        $scope.user = message.user;
        $scope.criteria = message.criteria;

        $rootScope.$broadcast('loaderShow');
        $scope.getMessages();
    });

    $scope.getMessages = function() {
        Comments.get_by_user({user_guid: $scope.user, owner_type: 0, owner_id: $scope.criteria.sguid}, {}, function(data) {
            angular.forEach(data, function(value, key){
                value.post_date = moment(value.post_date).format("DD-MM-YYYY");
            });
            
            $scope.commentsList = data;
            $rootScope.$broadcast('loaderHide');
        });
    }

    $scope.onSendMessage = function() {
        $rootScope.$broadcast('loaderShow');
        Comments.create({}, {
            owner_type: 0,
            author_guid: $scope.workspace.user.sguid,
            post_date: moment().format("DD-MM-YYYY"),
            message: $scope.form.message,
            owner_id: $scope.criteria.sguid,
            user_guid: $scope.user
        }, function(data) {
            $rootScope.$broadcast('loaderHide');
            $scope.getMessages();
        });
    }
}

function ConfirmController($scope, ConfirmSignup, $routeParams, $location) {
    ConfirmSignup.test({hash: $routeParams.hash}, {}, function(data) {
        if(data) {
            $location.path("/login/").search({ onSuccess: true});
        } else {
            $location.path("/login/").search({ onSuccess: true});
        }
    });
}