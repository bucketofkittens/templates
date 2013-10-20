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
        $rootScope.$broadcast('showShadow');
        $rootScope.$broadcast('openLoginModal');
    };

    /**
     * Переход на страницу профиля
     * @return {undefined}
     */
    $scope.onOpenProfileAuthUser = function() {
        $location.path("/profile/" + $scope.workspace.user.sguid);
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
                name: localize.getLocalizedString("_LEAGUES_"), 
                link: '#/leagues', 
                current: false
            },
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
    $scope.authUserId = AuthUser.get();
    $scope.userId1 = $routeParams.userId1;
    $scope.userId2 = $routeParams.userId2;
    $scope.currentUserEditStatus = !$scope.userId2 ? true : false;
    
    $scope.$on('routeSegmentChange', function(data, d2) {
        if($routeParams.userId1 && $routeParams.userId1 != $scope.userId1) {
            $rootScope.$broadcast('updateUserControllerId', {
                userId: $routeParams.userId1,
                id: "leftUser"
            });    
        }

        if($routeParams.userId2 && $routeParams.userId2 != $scope.userId2) {
            $rootScope.$broadcast('updateUserControllerId', {
                isEdit: false,
                id: "leftUser"
            });
            $rootScope.$broadcast('updateUserControllerId', {
                userId: $routeParams.userId2,
                id: "rightUser"
            });
        } else {
            if(!$routeParams.userId2) {
                $rootScope.$broadcast('updateUserControllerId', {
                    isEdit: true,
                    id: "leftUser"
                });
            }    
        }

        $scope.userId1 = $routeParams.userId1;
        $scope.userId2 = $routeParams.userId2;
        
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
function QuickUserChangeCtrl($scope, User, AuthUser, $rootScope, $location) {
    $scope.users = [];

    $scope.onMoveUserClick = function($event, nextUser) {
        AuthUser.set(nextUser.sguid);
        
        $rootScope.workspace.user = nextUser;
        $rootScope.authUserId = nextUser.sguid;
        $location.path("/profile/"+nextUser.sguid);

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
        $scope.users = users;
    }); 
}

/**
 * Контроллер  профиля
 * @param {type} $scope
 * @param {type} $route
 * @param {type} $routeParams
 * @param {type} User
 * @param {type} Needs
 * @param {type} Professions
 * @param {type} States
 * @returns {undefined}
 */
function UserController($scope, $route, $routeParams, User, Needs, Professions, States, $http, NeedsByUser, $rootScope, GoalsByUser, AuthUser, Leagues, $location, $window) {
    $scope.user = null;
    $scope.newImage = null;
    
    $scope.authUserId = AuthUser.get();

    $scope.currentUserId = '';

    $scope.states = $scope.workspace.states;
    $scope.professions = $scope.workspace.professions;

    $scope.$on('statesGet', function() {
        $scope.states = $scope.workspace.states;
    });
    
    $scope.$on('professionsGet', function() {
        $scope.professions = $scope.workspace.professions;
    });

    $scope.$on('authUserIdChange', function() {
        $scope.authUserId = AuthUser.get();
    });

    $scope.$watch($scope.currentUserId, function (newVal, oldVal, scope) {
        $scope.getUserInfo();
        $scope.testFollow();
    });

    $scope.$on('authUserGetData', function() {
        $scope.authUser = $rootScope.workspace.user;
        $scope.testFollow();
    });

    $scope.professionFn = function(query) {
        return $.map($scope.professions, function(profession) {
            return profession.name;
        });
    }

    /**
     * Информация по пользователю
     * @return {[type]} [description]
     */
    $scope.getUserInfo = function() {
        $scope.getUserByServer();
    }

    $scope.getUserByServer = function() {
        if(!isNaN(parseInt($scope.currentUserId))) {
            User.query({id: $scope.currentUserId}, function(data) {
                $scope.user = data;
                if($scope.user.birthday) {
                    var dayWrapper = moment($scope.user.birthday);
                    $scope.user.birthday = dayWrapper.format("DD/MM/YYYY");
                }
                $scope.getLegueUsers();
                
                $rootScope.$broadcast('getUserInfoToNeeds', {
                    user: $scope.user,
                    id: $scope.id
                });

                $rootScope.$broadcast('getSelectedUserData', {
                    user: $scope.user
                });
            });
        }
    }

    $scope.getLegueUsers = function() {
        if($scope.user.league) {
            User.by_league({league_guid: $scope.user.league.sguid}, {}, function(data) {
                $scope.user.league.users = data;
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
        if($scope.currentUserId && $rootScope.workspace.user) {
            var item = $rootScope.workspace.user.frends.filter(function(item) {
                if(item.user.sguid == $scope.currentUserId) { return item; }
            });
            if(item.length > 0) {
                $scope.isFollow = true;
            } else {
                $scope.isFollow = false;
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

    $scope.onFollow = function($event, user) {
        $rootScope.$broadcast('follow', {userId: AuthUser.get(), frendId: $scope.currentUserId, user: $scope.user});
        $scope.isFollow = true;
    }

    $scope.onUnFollow = function($event, user) {
        $rootScope.$broadcast('unfollow', {userId: AuthUser.get(), frendId: $scope.currentUserId});
        $scope.isFollow = false;
    }

    /**
     * Список годов
     * @param  {[type]} min [description]
     * @param  {[type]} max [description]
     * @return {[type]}     [description]
     */
    this.generateAgesArray = function(min, max) {
        var i = min, ret = [];
        for(i = min; i
    <= max; i++){
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
        if($scope.user.sguid == $scope.authUserId) {
            $rootScope.$broadcast('cropImage', {user: $scope.user});
        }
    }

    /**
     * 
     * @param  {[type]} $event
     * @return {[type]}
     */
    $scope.onUpdateFile = function($event) {
        if($scope.user.sguid == $scope.authUserId) {

            $rootScope.$broadcast('cropImage', {user: $scope.user});
        }
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

    /**
     * Публикация профиля
     * Пока не работает нет backend
     * @param  {[type]} $event [description]
     * @return {[type]}        [description]
     */
    $scope.onPublish = function($event) {
        $rootScope.$broadcast('loaderShow');

        if(!$scope.user.published) {
            $scope.user.published = 0;
        }

        if($scope.user.profession && $scope.user.profession.name) {
            $scope.user.profession = $scope.getProfessionByName($scope.user.profession.name)[0];
        }
        if($scope.user.birthday) {
            var dayWrapper = moment($scope.user.birthday);
            $scope.user.birthday = dayWrapper.format("DD/MM/YYYY");
        }
        User.updateUser({"id": $scope.user.sguid},  {user: JSON.stringify({
                "login": $scope.user.login,
                "name": $scope.user.name,
                "email": $scope.user.email,
                "birthday": $scope.user.birthday,
                "profession": $scope.user.profession ? $scope.user.profession.sguid : null ,
                "state": $scope.user.state ? $scope.user.state.sguid : null,
                "published": 1
            })}, function(data) {
                $rootScope.$broadcast('loaderHide');
                $rootScope.$broadcast('updateUserData', {user: $scope.user});
                $("input[type='text'], input[type='email'], select", ".pmpar").attr("readonly", "readonly");
            }
        );
    }

    if($rootScope.workspace.user) {
        $scope.authUser = $rootScope.workspace.user;
        $scope.testFollow();
    }
}

/**
 * 
 * @param {[type]} $scope
 * @param {[type]} Goals
 * @param {[type]} Criterion
 */
function NeedsAndGoalsController($scope, Goals, Criterion, AuthUser, UserCriteriaValue, $rootScope, CriterionByGoal, UserCriteriaValueByUser, $routeParams, Needs, User, $element) {
    $scope.needs = [];

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

    $scope.getNeeds = function() {
        $("#content .crits ul li ul.show").removeClass("show");
        Needs.query({}, {}, function(data) {
            $scope.needs = data;
            $scope.bindUserNeedsValues();
        });  
    }

    if($scope.user) {
        $scope.getNeeds();
    }
    
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
    $scope.getCriteriumByGoal = function(goal) {
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
        }); 
    }

    /**
     * получаем данные по колбаскам для текущего пользователя
     * @param  {[type]} goal [description]
     * @return {[type]}      [description]
     */
    $scope.getCriteriumValueByUser = function(goal) {
        UserCriteriaValueByUser.query({id: $scope.currentUserId}, {}, function(d) {

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
     * 
     * @param  {[type]} goalId [description]
     * @return {[type]}        [description]
     */
    $scope.openCriteriumList = function ($event, need, goal, currentUserId) {
        var fNeed = $scope.needs.filter(function (needValue) { 
            return needValue.sguid == need.sguid;
        })[0];
        var fGoal = fNeed.goals.filter(function (goalValue) { 
            return goalValue.sguid == goal.sguid;
        })[0];
        
        $scope.getCriteriumByGoal(fGoal);

        if(!currentUserId) {
            $rootScope.$broadcast('openCriteriumList', {
                goal: goal,
                need: need,
                event: $event,
                currentUserId: $scope.currentUserId
            });
        }
        $("li[data-goalid='"+goal.sguid+"'] .criterion", $($element)).toggleClass("show");
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
            slider.css("width", parentUl.get(0).clientWidth - parentLi.get(0).offsetLeft - parentLi.get(0).clientWidth + "px");
        } else {
            slider.css("width", "95%");
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

    $scope.onShowGoals = function($event, sguid) {
        $("li[data-needId='"+sguid+"'] > ul").toggleClass("show");
    }
}


/**
 * форма модального окна авторизации
 * @param {[type]} $scope [description]
 */
function LoginModalController($scope, Sessions, $rootScope, User, Social, $facebook, $location) {
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
    $scope.onSingin = function() {
        Sessions.signin({}, $.param({
            "login": $scope.login.login,
            "password": $scope.login.password
        }), function(data) {
            if(data.success) {
                $rootScope.$broadcast('onSignin', {guid: data.guid, isSocial: true});
                $scope.show = false;
            } else {
                $scope.error = data.message;
            }
        });
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
                    $scope.show = false;
                    $rootScope.$broadcast('hideShadow');
                    $rootScope.$broadcast('hideModal');
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
                $rootScope.$broadcast('onSignin', {guid: data.guid, isSocial: true});
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

    $scope.setAuthUserData = function() {
        $scope.isAuth = $scope.workspace.user && $scope.workspace.user.sguid ? true : false;
        if($scope.isAuth) {
            $scope.rootUser = {
                sguid: $scope.workspace.user.sguid,
                avatar: $scope.workspace.user.avatar
            };
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

    $scope.$on('logout', function() {
        $scope.rootUser = null;
        $scope.isAuth = false;
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

    $scope.setAuthUserData();
}

/**
 * Контроллер главной страницыMainC
 * @param {type} $scope
 * @param {type} Leagues
 * @param {type} User
 * @param {type} AuthUser
 * @param {type} $rootScope
 * @param {type} $location
 * @param {type} $timeout
 * @returns {MainController}
 */
function MainController($scope, Leagues, User, AuthUser, $rootScope, $location, $timeout) {
    $scope.opts = {
        layoutMode: 'masonry'
    }

    $scope.testFollow = function() {
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

    $scope.$on('authUserGetData', function() {
        $scope.rootUser = $scope.workspace.user;
        $scope.testFollow();
    });

    $scope.$on('logout', function() {
        $scope.rootUser = null;
    });

    $scope.$on('unfollowCallback', function($event, message) {
        var user = $scope.users.filter(function(data) {
            if(data.sguid == message.frendId) {
                return data;
            }
        });
        if(user.length > 0) {
            $scope.testUser(user[0]);
        }
    });

    $scope.$on('followCallback', function($event, message) {
        var user = $scope.users.filter(function(data) {
            if(data.sguid == message.frendId) {
                return data;
            }
        });
        if(user.length > 0) {
            $scope.testUser(user[0]);
        }
    });

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
                if(value.avatar) {
                    users.push(value);
                }
                
            });
            $scope.users = users;
        });
    }

    $scope.getPublishedUser();
    

    $scope.onMoveToUser = function(user) {
        $location.path("/profile/"+user.sguid);
    }

    $scope.onCompareToUser = function(user) {
        $location.path("/profile/"+$scope.rootUser.sguid+"/"+user.sguid);
    }

    $scope.onMouseEnterUser = function(user) {
        if(!user.dragged) {
            user.showHint = true;
            user.isLeave = false;

            $timeout(function() {
                if(!user.isLeave) {
                    user.showMenu = true;   
                }
            }, 2000);   
        }
    }

    $scope.switchState = function(user) {
        angular.forEach($scope.users, function(value, key){
            value.showMenu = false;
        });
        user.showMenu = user.showMenu ? false : true;
    }

    $scope.onFollow = function($event, user) {
        if(user.isFrend) {
            $rootScope.$broadcast('unfollow', {userId: AuthUser.get(), frendId: user.sguid, user: user});
        }
        else {
            $rootScope.$broadcast('follow', {userId: AuthUser.get(), frendId: user.sguid, user: user});
        }
    }

    /**
     * 
     * @param  {[type]} $event [description]
     * @param  {[type]} user   [description]
     * @return {[type]}        [description]
     */
    $scope.onUnFollow = function($event, user) {
        $rootScope.$broadcast('unfollow', {userId: AuthUser.get(), frendId: user.sguid});
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

function NeighboursCtrl($scope, $location, localize, User, AuthUser, Leagues, $rootScope) {

    $scope.topL = localize.getLocalizedString('_topL_');
    $scope.flwL = localize.getLocalizedString('_flwL_');
    $scope.neighL = localize.getLocalizedString('_neighL_');

    $scope.getDatas = function(user) {
        User.get_friends({id: $scope.userId1}, function(data) {
            angular.forEach(data, function(value, key){
                data[key] = value.user;
            });
            $rootScope.$broadcast('usersLoaded', {
                id: 'follow',
                users: data
            });
        });
        
        User.get_from_to_points({from: parseInt(user.points-10000), to: parseInt(user.points+10000)}, {}, function(newUsers) {
            $rootScope.$broadcast('usersLoaded', {
                id: 'neigh',
                users: newUsers
            });
        });

        Leagues.by_position({position: 9}, {}, function(league) {
            User.by_league({league_guid: league.sguid}, {}, function(userData) {
                $rootScope.$broadcast('usersLoaded', {
                    id: 'top',
                    users: userData
                });
            });
        })
        
    }

    $scope.$on('getSelectedUserData', function($event, message) {
        $scope.getDatas(message.user);
    });
    

    $scope.$on('updateUserControllerId', function($event, message) {
        if(message.id == $scope.id) {
            $scope.userId1 = mesaage.id;
        }
    });

    
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
function GalleryController($scope, localize, Leagues, User, AuthUser, $element, $location) {
    $scope.stateView = 0;
    $scope.stateViewClass = "";
    $scope.users = [];
    $scope.limit = 3;
    $scope.authUserId = AuthUser.get();

    $scope.$on('usersLoaded', function($event, message) {
        if(message.id == $scope.id) {
            $scope.users = message.users;
        }
    });

    $scope.onChangeState = function() {
        $scope.stateView = $scope.stateView == 1 ? 0 : 1;
        $scope.stateViewClass = $scope.stateView == 1 ? "fulls" : "";
        $scope.limit = $scope.stateView == 1 ? 999 : 3;

        if($scope.stateView == 1) {
            $(".lnbl").hide();
            $($element).next().show();
        } else {
            $(".lnbl").show();
        }
    }

    $scope.onMoveToUser = function(user) {
        if($scope.authUserId) {
            $location.path("/profile/"+$scope.authUserId+"/"+user.sguid);
        } else {
            $location.path("/profile/"+user.sguid);
        }
    }
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

    $scope.getProfessions();
    $scope.getState();
    $scope.getUserInfo();

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
        User.query({id: message.guid}, function(data) {
            $scope.workspace.user = data;
            User.get_friends({id: message.guid}, function(frends) {
                AuthUser.set(message.guid);
                
                $scope.workspace.user.frends = frends;
                $scope.authUserId = data.sguid;

                $rootScope.$broadcast('hideShadow');
                $rootScope.$broadcast('hideModal');

                if(message.isSocial) {
                    $rootScope.$broadcast('socialLogined');
                }
            });
            
        });
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
    $scope.shouldBeOpen = false;
    $scope.user = [];
    $scope.positions = [];
    $scope.imageData = '';

    $scope.$on('cropImage', function($event, message) {
        $scope.user = message.user;
        $scope.shouldBeOpen = true;
    });

    $scope.close = function() {
       $scope.shouldBeOpen = false; 
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
                        $scope.user.avatar = createImageFullPath(data.message);
                        $rootScope.$broadcast('updateUserData', {user: $scope.user});
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
            if($(crop_img).width() > 199 && $(crop_img).width() > 199) {
                crop_img.Jcrop({minSize: [200, 200], aspectRatio: 1, setSelect: [0, 0, 200, 200], onChange: function(data) {
                    $scope.positions = data;
                }});   
            } else {
                $(crop_img).attr("src", false);
                alert("Размер аватарки должен быть не меньше 200x200.");
            }
            
        };
        reader.readAsDataURL(file);
    }
}