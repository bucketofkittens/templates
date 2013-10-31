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
        $location.path("/my_profile/");
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
}

/**
 * [QuickUserChangeCtrl description]
 * @param {[type]} $scope     [description]
 * @param {[type]} User       [description]
 * @param {[type]} AuthUser   [description]
 * @param {[type]} $rootScope [description]
 * @param {[type]} $location  [description]
 */
function QuickUserChangeCtrl($scope, User, AuthUser, $rootScope, $location) {
    $scope.users = [];

    $scope.onMoveUserClick = function($event, nextUser) {
        AuthUser.set(nextUser.sguid);
        
        $scope.workspace.user = nextUser;
        $scope.authUserId = nextUser.sguid;

        $rootScope.$broadcast('authUserIdChange');
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
function UserController($scope, $route, $routeParams, User, Needs, Professions, States, $http, NeedsByUser, $rootScope, GoalsByUser, AuthUser, Leagues, $location, $window) {
    $scope.user = null;
    $scope.newImage = null;

    $scope.userId = $routeParams.userId1;

    $scope.$on('authUserIdChange', function() {
        $scope.userId = AuthUser.get();
    }); 

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

    $scope.$on('routeSegmentChange', function(data, d2) {
        if($routeParams.userId1 && $routeParams.userId1 != $scope.userId1) {
            $scope.userId = $routeParams.userId1;
            $scope.getUserInfo();
        }
    });

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

    /**
     * Событие добавление в друзья
     * @return {object}        
     */
    $scope.onFollow = function() {
        $rootScope.$broadcast('follow', {userId: AuthUser.get(), frendId: $scope.user.sguid, user: $scope.user});
    }

    /**
     * Событие удаление из друзей
     * @return {object}      
     */
    $scope.onUnFollow = function() {
        $rootScope.$broadcast('unfollow', {userId: AuthUser.get(), frendId: $scope.user.sguid, user: $scope.user});
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

    $scope.$on('getUserInfoToNeeds', function($event, message) {
        if(!$scope.user && message.id == $scope.id) {
            $scope.user = message.user;
            $scope.getNeeds();
        }
        if($scope.user && message.user && $scope.user.sguid != message.user.sguid  && message.id == $scope.id) {
            $scope.user = message.user;
            $scope.getNeeds();
        }
    });

    $scope.$watch('workspace.needs', function (newVal, oldVal, scope) {
        if($scope.workspace.needs) {
            $scope.needs = $scope.workspace.needs;
            if($scope.allOpen) {
                $scope.openAllNeeds($scope.needs);
            }
            $scope.needs.sort(function(a, b) {
                if(a.position < b.position)
                    return -1
                if(a.position > b.position)
                    return 1
                return 0
            });
        }
    });

    $scope.$watch('user', function (newVal, oldVal, scope) {
        if($scope.user && $scope.user.sguid) {
            $scope.bindUserNeedsValues();
        }
    });
    
    $scope.bindUserNeedsValues = function() {
        User.needs_points({id: $scope.user.sguid}, {}, function(needsData) {
            $rootScope.$broadcast('needUserValueLoaded', {
                needsValues: needsData,
                userId: $scope.user.sguid
            });
            User.goals_points({id: $scope.user.sguid}, {}, function(goalsData) {
                angular.forEach($scope.needs, function(needItem, needKey) {
                    needItem.current_value = parseInt(needsData[needItem.sguid]);
                    angular.forEach(needItem.goals, function(goalItem, goalKey){
                        goalItem.current_value = parseInt(goalsData[goalItem.sguid]);
                    });
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
                }
            });
        });
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
                        userId: $scope.currentUserId
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
            angular.forEach(value.goals, function(v2, k2){
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

    /**
     * 
     * @param  {[type]} goalId [description]
     * @return {[type]}        [description]
     */
    $scope.openCriteriumList = function ($event, need, goal, needs) {
        if(!goal.current) {
            $scope.closeAllGoals(needs);
        
            goal.current = true;

            $scope.getCriteriumByGoal(goal, need);

            if($scope.persistState) {
                $cookieStore.put("openGoal", goal.sguid);
                $cookieStore.put("openNeed", need.sguid);
            }    
        } else {
            $scope.closeAllGoals(needs);

            goal.current = false;
        }
    };

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
            });
            
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

    $scope.onShowGoals = function($event, needItem) {
        needItem.current = needItem.current ? false : true;
    }
}


/**
 * форма модального окна авторизации
 * @param {[type]} $scope [description]
 */
function LoginController($scope, Sessions, $rootScope, User, Social, $facebook, $location, $window) {
    $scope.show = false;

    $scope.signup = false;

    $scope.login = {
        login: "",
        password: ""
    }

    $scope.user = {
        login: "",
        email: "",
        password: ""
    }

    $scope.$on('openLoginModal', function() {
        $scope.show = true;
    });

    $scope.$on('hideModal', function() {
        $scope.show = false;
    });
    

    $scope.$on('socialLogined', function() {
    });

    $scope.onSignStateChange = function() {
        $scope.signup = $scope.signup ? false : true;
    }

    /**
     * Вызывается при нажатии ok в форме авторизации
     * @param  {[type]} $event [description]
     * @return {[type]}        [description]
     */
    $scope.onSingin = function(data) {
        Sessions.signin({}, $.param({
            "login": $scope.login.login,
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

    /**
     * 
     * @param {type} $event
     * @returns {undefined}
     */
    $scope.onAddUser = function ($event) {
        User.create(
            {user: JSON.stringify({
                "login": $scope.user.login,
                "email": $scope.user.email,
                "password": $scope.user.password
            })}
            ,function(data) {
                if(!data.success) {
                    angular.forEach(data.errors, function(value, key) {
                        $scope.errors += value;
                    });
                } else {
                    Sessions.signin({}, $.param({
                        "login": $scope.user.login,
                        "password": $scope.user.password
                    }), function(data) {
                        if(data.success) {
                            $rootScope.$broadcast('onSignin', {sguid: data.guid, isSocial: true, noRedirect: true});
                            $location.path("/my_profile/");
                        }
                    });
                }
            }
        );
    };
    

    /**
     * 
     * @param  {[type]} $event [description]
     * @return {[type]}        [description]
     */
    $scope.regiostrationOpen = function($event) {
        $rootScope.$broadcast('registrationModalShow');
    }

    $scope.socialFacebookLogin = function() {
        $rootScope.$broadcast('loaderShow');
        FB.login(function(response) {
            if(!response.authResponse) {
                $scope.$apply(function() {
                    $rootScope.$broadcast('loaderHide');
                });
            }
        });
    };

    $scope.socialGooglePlusLogin = function() {
        $rootScope.$broadcast('loaderShow');
        gapi.auth.authorize({
            client_id: socialsAccess.googlePlus.applicationId[window.location.hostname], 
            scope: socialsAccess.googlePlus.scopes, 
            immediate: false
        }, handleAuthResult);
    };

    $scope.$on('fb.auth.authResponseChange', function(data, d) {
        FB.api('/me', function(response) {
            Social.login({}, {email: response.email}, function(data) {
                $rootScope.$broadcast('onSignin', {sguid: data.guid, isSocial: true});
                socialsAccess.facebook.isLoggined = true;
            });
        });
    });
}

function LoaderController($scope) {
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
        if($scope.compareState == 1) {
            if($routeParams.userId1 != user.sguid) {
                $location.path("/profile/"+$routeParams.userId1+"/"+user.sguid+"/");
                $scope.compareState = 0;
            }
        } else {
            $location.path("/profile/"+user.sguid+"/"+$routeParams.userId2+"/");
            $scope.compareState = 1;    
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

    $scope.$on('onSignin', function() {
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
        if($rootScope.authUserId) {
            $location.path("/profile/"+$rootScope.authUserId+"/compare/");
        } else {
            $location.path("/profile/"+$scope.frends[0].user.sguid+"/compare/");
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
        var step = $event.originalEvent && $event.originalEvent.wheelDeltaY ? $event.originalEvent.wheelDeltaY : $event.deltaY * 40;

        if(!$scope.scrollDelta) {
            $scope.scrollDelta = 0;
        }
        $scope.scrollDelta = $scope.scrollDelta + step;
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
function CompareController($scope) {
    var needsCountLoaded = 0;
    var needsValues = {};
    var goalsCountLoaded = 0;
    var goalsValues = {};
    var crtiterias = {};

    $scope.$on('needUserValueLoaded', function($event, message) {
      needsCountLoaded += 1;
      needsValues[message.userId] = message.needsValues;
      if(needsCountLoaded == 2) {
          angular.forEach(needsValues[$scope.userId2], function(value, key){

                if(value < needsValues[$scope.userId1][key]) {
                  $("li[data-needId='"+key+"'] .cr", $("#compare")).append('<sup class="du"></sup>');
                } 
                if(value > needsValues[$scope.userId1][key]) {
                  $("li[data-needId='"+key+"'] .cr", $("#compare")).append(' <sub class="du"></sub>');
                } 
                if(value == needsValues[$scope.userId1][key]) {
                  $("li[data-needId='"+key+"'] .cr", $("#compare")).append('<s class="du"></s>');
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
      
      if(crtiterias[message.fCriteria.sguid][$scope.userId2] && crtiterias[message.fCriteria.sguid][$scope.userId1]) {
          var rootCriteria = crtiterias[message.fCriteria.sguid][$scope.userId2];
          var authCriteria = crtiterias[message.fCriteria.sguid][$scope.userId1];

          if(rootCriteria.value < authCriteria.value) {
             $("li[data-id='"+fCriterium.sguid+"']", $("#compare")).append('<sup class="du"></sup>');
          }
          if(rootCriteria.value > authCriteria.value) {
             $("li[data-id='"+fCriterium.sguid+"']", $("#compare")).append(' <sub class="du"></sub>');
          }
          if(rootCriteria.value == authCriteria.value) {
             $("li[data-id='"+fCriterium.sguid+"']", $("#compare")).append('<s class="du"></s>');
          }
      }
    });

    $scope.$on('goalUserValueLoaded', function($event, message) {
        goalsCountLoaded += 1;
        goalsValues[message.userId] = message.goalsValues;
        if(goalsCountLoaded == 2) {
          angular.forEach(goalsValues[$scope.userId2], function(value, key) {
             if(value < goalsValues[$scope.userId1][key]) {
                $("li[data-goalid='"+key+"'] > h5", $("#compare")).append(' <sup class="du"></sup>');
             } 
            if(value > goalsValues[$scope.userId1][key]) {
                $("li[data-goalid='"+key+"'] > h5", $("#compare")).append('<sub class="du"></sub>');
             } 
             if(value == goalsValues[$scope.userId1][key]) {
                $("li[data-goalid='"+key+"'] > h5", $("#compare")).append('<s class="du"></s>');
             } 
          });
          goalsCountLoaded = 1;
      }
    });
    
}

function NeighboursGalleryController($scope, User, $routeParams) {
    $scope.range = 100000;

    $scope.$on("userControllerGetUser", function($event, message) {
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
        });
    });
}

function TopGalleryController($scope, Leagues, User, $routeParams) {
    Leagues.by_position({position: 9}, {}, function(league) {
        User.by_league({league_guid: league.sguid}, {}, function(userData) {
            angular.forEach(userData, function(value, key){
                if(!value.published) {
                    //userData.splice(key, 1);
                }
                if($routeParams.userId1 == value.sguid) {
                    userData.splice(key, 1);
                } 
                value.points = parseInt(value.points);
            });
            
            $scope.users = userData;
        });
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
function GalleryController($scope, localize, Leagues, User, AuthUser, $element, $location, $timeout, $rootScope) {

    $scope.$watch("users", function (newVal, oldVal, scope) {
        if($scope.users && $scope.users.length > 0) {
            $scope.setPage();
        }
    });

    /**
     * Через сколько минисекунд картинка становится большой
     * @type {Number}
     */
    $scope.showTick = 2000;

    $scope.limit = 12;

    $scope.swipe = 0;
    $scope.swipeMax = 0;


    $scope.onSwipeRight = function() {
        $scope.swipe += 1;
        $scope.setPage();
    }

    $scope.onSwipeLeft= function() {
        $scope.swipe -= 1;
        $scope.setPage();    
    }

    $scope.setPage = function() {
        var first = $scope.swipe * $scope.limit;
        var last = ($scope.swipe * $scope.limit) + $scope.limit;

        if($scope.users) {
            $scope.swipeMax = Math.ceil($scope.users.length / $scope.limit); 
        }

        angular.forEach($scope.users, function(value, key) {
            if(key >= first && key < last) {
                value.showItem = true;    
            } else {
                value.showItem = false;
            }
        });
    }

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
        if(!user.hover) {
            user.hovered = true;

            $timeout(function() {
                if(user.hovered) {
                    angular.forEach($scope.users, function(item, key) {
                        if(item != user) {
                            item.hovered = false;
                            item.hover = false;     
                        }
                    });
                    user.hover = user.hovered ? true : false;
                }
            }, $scope.showTick);
        }
    }

    /**
     * 
     * @param  {object} user 
     * @return {object}      
     */
    $scope.onUserMouseLeave = function(user, $event) {
        user.hovered = false;
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

function RootController($scope, AuthUser, User, $rootScope, Needs, Social, $cookieStore, States, Professions, $location) {
    $scope.authUserId = AuthUser.get();
    $scope.workspace = {};
    $scope.tmpFollows = [];

    $scope.controller = $location.path().split("/").join("_");

    $scope.$on('$routeChangeStart', function(event, next, current) { 
        $scope.controller = $location.path().split("/").join("_");
    });

    $scope.onLogout = function() {
        AuthUser.logout();
    
        if(socialsAccess.facebook.isLoggined) {
            $facebook.logout();
            socialsAccess.facebook.isLoggined = false;  
        }
        
        if(socialsAccess.googlePlus.isLoggined) {
            $.get("https://mail.google.com/mail/u/0/?logout&hl=en");  
            
            socialsAccess.googlePlus.isLoggined = false;  
        }
        
        $scope.workspace.user = null;
        $rootScope.$broadcast('logout');
    }

    $scope.getUserInfo = function() {
        if($scope.authUserId) {
            User.query({id: $scope.authUserId}, function(data) {
                $scope.workspace.user = data;
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
        Professions.query({}, {}, function(data) {
            $scope.workspace.professions = data;
            $rootScope.$broadcast('professionsGet');
        });
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
        $rootScope.$broadcast('followCallback', {frendId: message.frendId});
    };

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

        $rootScope.$broadcast('unfollowCallback', {frendId: message.frendId});
    };

    $scope.$on('onSignin', function($event, message) {
        if(message && message.sguid) {
            User.query({id: message.sguid}, function(data) {
                $scope.workspace.user = data;
                AuthUser.set(message.sguid);

                User.get_friends({id: message.guid}, function(frends) {
                    $scope.workspace.user.frends = frends;
                    $scope.authUserId = data.sguid;

                    if(message.isSocial) {
                        $rootScope.$broadcast('socialLogined');
                    }

                    if(!message.noRedirect) {
                        $location.path("/");    
                    }
                });
            });    
        }
    });
    
    $scope.gplusAuth = function(email) {
        Social.login({}, {email: email}, function(data) {
            $rootScope.$broadcast('onSignin', {guid: data.guid, isSocial: true});
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

function MyProfileController($scope, $rootScope, User, $location) {
    $scope.tab = 2;

    $scope.$watch("workspace.user.birthday", function (newVal, oldVal, scope) {
        if($scope.workspace.user && $scope.workspace.user.birthday) {
            var birthdaySplit = $scope.workspace.user.birthday.split("-");
            $scope.workspace.user.birthdayDate =  new Date(birthdaySplit[0], birthdaySplit[1], birthdaySplit[2] );
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
                "email": $scope.workspace.user.email,
                "published": 1
        }

        if($scope.workspace.user.name) {
            user["name"] = $scope.workspace.user.name;
        }

        if($scope.workspace.user.state) {
            user["state"] = $scope.workspace.user.state.sguid;
        }

        if(birthday) {
            user["birthday"] = birthday;
        }

        if($scope.workspace.user.profession) {
            user["profession"] = $scope.workspace.user.profession.sguid;
        }

        User.updateUser({"id": $scope.workspace.user.sguid},  {user: JSON.stringify(user)}, function(data) {
                $scope.workspace.user.published = 1;
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

    $scope.onChangeEmail = function() {
        $location.path("/change_email"); 
    }

    $scope.onChangePassword = function() {
        $location.path("/change_password"); 
    }

    /* config object */
    $scope.professionOption = {
        options: {
            html: true,
            onlySelect: true,
            source: function (request, response) {
                var data = $scope.workspace.professions;
                var outData = [];
                angular.forEach(data, function(value, key){
                    outData.push({value: value["name"], label: value["name"], sguid: value["sguid"]});
                });
                outData = $scope.professionOption.methods.filter(outData, request.term);
                response(outData);
            }
        },
        methods: {},
        events: {
            change: function(event, ui) {
                $scope.workspace.user.profession.name = ui.item.label;
                $scope.workspace.user.profession.sguid = ui.item.sguid;
                $scope.onPublish();
            }
        }
    };

    /* config object */
    $scope.stateOption = {
        options: {
            html: true,
            onlySelect: true,
            source: function (request, response) {
                var data = $scope.workspace.states;
                var outData = [];
                angular.forEach(data, function(value, key){
                    outData.push({value: value["name"], label: value["name"], sguid: value["sguid"]});
                });
                outData = $scope.professionOption.methods.filter(outData, request.term);
                response(outData);
            }
        },
        methods: {},
        events: {
            change: function(event, ui) {
                $scope.workspace.user.state.name = ui.item.label;
                $scope.workspace.user.state.sguid = ui.item.sguid;
                $scope.onPublish();
            }
        }
    };

    $scope.dateOptions = {
        changeYear: true,
        changeMonth: true,
        yearRange: '1900:-0'
    };

    $scope.onChange = function(tab) {
        $scope.tab = tab;
    }
}

function ChangeEmailController($scope, User, $location) {
    $scope.form = {
        oldEmail: "",
        newEmail: ""
    }

    $scope.onCancel = function() {
        $location.path("/my_profile");
    }

    $scope.onChangeEmail = function() {
        if($scope.form.oldEmail == $scope.workspace.user.email) {
            var user = {
                    "email": $scope.form.newEmail
            }

            User.updateUser({"id": $scope.workspace.user.sguid},  {user: JSON.stringify(user)}, function(data) {
                    $scope.workspace.user.email = $scope.form.newEmail;
                    $location.path("/my_profile/");
                }
            );
        } else {
            $scope.error = "error";
        }
        
    }
}

function ChangePasswordController($scope, Sessions, User, $location) {
    $scope.form = {
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
    }

    $scope.onCancel = function() {
        $location.path("/my_profile");
    }

    $scope.onChangePassword = function() {
        if($scope.form.newPassword == $scope.form.confirmPassword) {
            Sessions.signin({}, $.param({
                "login": $scope.workspace.user.login,
                "password": $scope.form.oldPassword 
            }), function(data) {
                if(data.success) {
                    var user = {
                        "password": $scope.form.confirmPassword
                    }

                    User.updateUser({"id": $scope.workspace.user.sguid},  {user: JSON.stringify(user)}, function(data) {
                        $location.path("/my_profile/");
                    });
                } else {
                    $scope.error = data.message;
                }
            });
        } else {
            $scope.error = "error";
        }
    }
}