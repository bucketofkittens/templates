'use strict';

function navCtrl($scope, localize, $location, AuthUser, $rootScope, $route) {
    /**
     * 
     * @type {Boolean}
     */
    $scope.hidden = false;
    

    /**
     * 
     * @type {[type]}
     */
    $scope.authUser = AuthUser.get();

    $rootScope.controller = $route.controller;

    /**
     * Событие вызываемое при загрузке файлов локализации.
     * Нужно для создания массива верхнего меню, локализованного
     * @return {[type]} [description]
     */
    $scope.$on('localizeResourcesUpdates', function() {
        $scope.generateNav();

        angular.forEach($scope.navs, function(value, key) {
            if($location.path().split("/")[1] == value.link.split("/")[1]) {
                $scope.navs[key].activeClass = 'current';
            } 
        });
    });

    /**
     * 
     * @return {[type]} [description]
     */
    $scope.$on('logout', function() {
        $scope.authUser = AuthUser.get();
        $scope.generateNav();
    });

    /**
     * 
     * @return {[type]} [description]
     */
    $scope.$on('login', function() {
        $scope.authUser = AuthUser.get();
        $scope.generateNav();
    });

    $scope.generateNav = function() {
        $scope.navs = [
            {name: localize.getLocalizedString("_PROFILE_"), link: $scope.authUser ? '#/profile/'+$scope.authUser: '#/profile/', activeClass: '', show: $scope.authUser ? true : false},
            {name: localize.getLocalizedString("_LEAGUES_"), link: '#/leagues', activeClass: '', show: $scope.authUser ? true : false},
            {name: localize.getLocalizedString("_GRAPHS_"), link: '#/graphs', activeClass: '', show: $scope.authUser ? true : false},
            {name: localize.getLocalizedString("_LogoutL_"), link: '#/logout', activeClass: '', show: $scope.authUser ? true : false}
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
            $scope.navs[key].activeClass = $scope.navs[key].link.split("/")[1] === $location.path().split("/")[1] ? 'current' : '';
        });
    });
}

/**
 * Контроллер страницы профиля
 * @param {[type]} $scope [description]
 */
function ProfileController($scope, $routeParams, AuthUser, $route, $rootScope, $location) {
    $scope.authUserId = AuthUser.get();
    $scope.userId1 = $routeParams.userId1;
    $scope.userId2 = $routeParams.userId2;
    $scope.currentUserEditStatus = !$scope.userId2 ? true : false;

    $scope.$on('routeSegmentChange', function(data, d2) {
        console.log($routeParams);
        if($routeParams.userId1) {
            $rootScope.$broadcast('updateUserControllerId', {
                userId: $routeParams.userId1,
                id: "leftUser"
            });    
        }

        if($routeParams.userId2) {
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
        AuthUser.set(nextUser.user.sguid);
        
        $rootScope.authUser = nextUser.user;
        $location.path("/profile/"+nextUser.user.sguid);
    }

    User.get_all({}, {}, function(data) {
        data.sort(function(a, b){
            if(a.user.login < b.user.login) return -1;
            if(a.user.login > b.user.login) return 1;
            return 0;
        })
        var users = [];
        angular.forEach(data, function(value, key){
            if(value.user.published == 1) {
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
function UserController($scope, $route, $routeParams, User, Needs, Professions, States, $http, NeedsByUser, $rootScope, GoalsByUser, AuthUser, Friendships, Leagues, $location, $window) {
    $scope.user = null;
    $scope.newImage = null;
    $scope.professions = Professions.query();
    $scope.states = States.query();
    $scope.authUserId = AuthUser.get();
    $scope.isFollow = false;

    $scope.currentUserId = '';

    $scope.$watch($scope.currentUserId, function (newVal, oldVal, scope) {
        $scope.getUserInfo();
    });

    /**
     * Информация по пользователю
     * @return {[type]} [description]
     */
    $scope.getUserInfo = function() {
        User.query({id: $scope.currentUserId}, function(data) {
            $scope.user = data;
            
            if($scope.user.league) {
                User.by_league({league_guid: $scope.user.league.sguid}, {}, function(data) {
                    $scope.user.league.users = data;
                });
            }
            $scope.authUser = $rootScope.authUser;
            if($scope.authUser) {
                $scope.testFollow();
            }
            $rootScope.$broadcast('getUserInfoToNeeds', {
                user: $scope.user,
                id: $scope.id
            });
        });
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
        var item = $scope.authUser.friends_guids.filter(function(item) {
            if(item == $scope.currentUserId) { return item; }
        });

        if(item && item.length > 0) {
            $scope.isFollow = true;
        } else {
            $scope.isFollow = false;
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

        $rootScope.authUser.league = data.league;
        $rootScope.authUser.points = data.points;
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


    $scope.onFollow = function() {
        User.create_friendship({id: AuthUser.get()}, {
            friend_guid: $scope.currentUserId
        }, function() {
            $scope.isFollow = true;
            console.log($scope.user);
            $rootScope.$broadcast('addToFollow', {user: { user: $scope.user}});
        });
    }

    $scope.onUnFollow = function() {
        User.destroy_friendship({id: AuthUser.get(), friendId: $scope.currentUserId}, { }, function() {
            $scope.isFollow = false;
            $rootScope.$broadcast('removeToFollow', {user: { user: $scope.user}});
        });
    }

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

    /**
     * Публикая профиля
     * Пока не работает нет backend
     * @param  {[type]} $event [description]
     * @return {[type]}        [description]
     */
    $scope.onPublish = function($event) {
        $rootScope.$broadcast('loaderShow');

        if(!$scope.user.published) {
            $scope.user.published = 0;
        }

        User.updateUser({"id": $scope.user.sguid},  {user: JSON.stringify({
                "login": $scope.user.login,
                "name": $scope.user.name,
                "email": $scope.user.email,
                "age": $scope.user.age,
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
 * Контроллер формы регистрации
 * @param {[type]} $scope    [description]
 * @param {[type]} $location [description]
 * @param {[type]} User      [description]
 */
function RegController($scope, $location, User, AuthUser, $rootScope) {
    /**
     * Объект нового польхователя
     * @type {Object}
     */
    $scope.user = {
        login: "",
        name: "",
        password: "",
        repassword: "",
        email: ""
    };

    /**
     * Строка ошибок
     * @type {String}
     */
    $scope.errors = "";
    
    /**
     * 
     * @returns {undefined}
     */
    $scope.open = function () {
        $scope.shouldBeOpen = true;
    };
    
    /**
     * 
     * @returns {undefined}
     */
    $scope.close = function () {
        $scope.shouldBeOpen = false;
    };

    /**
     * 
     * @return {[type]} [description]
     */
    $scope.$on('registrationModalShow', function() {
        $scope.shouldBeOpen = true;
    });

    

    /**
     * 
     * @param {type} $event
     * @returns {undefined}
     */
    $scope.addUser = function ($event) {
        User.create(
            {user: JSON.stringify({
                "login": $scope.user.login,
                "name": $scope.user.name,
                "email": $scope.user.email,
                "password": $scope.user.password
            })}
            ,function(data) {
                if(!data.success) {
                    angular.forEach(data.errors, function(value, key) {
                        $scope.errors += value;
                    });
                } else {
                    $scope.shouldBeOpen = false;
                    $rootScope.$broadcast('registered');
                }
            }
        );
    };
    
    /**
     * Параметры попапа
     * @type {Object}
     */
    $scope.opts = {
        backdropFade: true,
        dialogFade:true,
        dialogClass: "registration modal"
    };
}

/**
 * [LoginController description]
 * @param {[type]} $scope [description]
 */
function LoginController($scope, Sessions, $rootScope, AuthUser, User, Social, $facebook) {
    $scope.authUser = AuthUser.get();
    /**
     * Поле логина
     * @type {String}
     */
    $scope.login = "";

    /**
     * Поле пароля
     * @type {String}
     */
    $scope.password = "";

    /**
     * Поле пароля
     * @type {String}
     */
    $scope.error = "";

    /**
     * 
     * @type {Boolean}
     */
    $scope.shouldBeOpen = false;



    $scope.$on('registered', function() {
        $scope.shouldBeOpen = false;

        $(".modal-backdrop").remove();
    });

    $scope.$on('openLoginModal', function() {
        $scope.shouldBeOpen = true;
    });

    

    /**
     * Вызывается при нажатии ok в форме авторизации
     * @param  {[type]} $event [description]
     * @return {[type]}        [description]
     */
    $scope.onSingin = function($event) {
        Sessions.signin({}, $.param({
            "login": $scope.login,
            "password": $scope.password
        }), function(data) {
            if(data.success) {
                AuthUser.set(data.guid);
                User.query({id: data.guid}, function(data) {
                    $rootScope.authUser = data;
                    $rootScope.authUserId = data.sguid;
                    $scope.shouldBeOpen = false;
                    $rootScope.$broadcast('login');
                });
            } else {
                $scope.error = data.message;
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

    $scope.onSubmit = function($event) {
        if($scope.form.$valid) {
            $scope.onSingin();
        }
    }

    /**
     * 
     * @returns {undefined}
     */
    $scope.open = function () {
        $scope.shouldBeOpen = true;     
    };
    
    /**
     * 
     * @returns {undefined}
     */
    $scope.close = function () {
        $scope.shouldBeOpen = false;
    };

    $scope.socialLogin = function() {
        console.log($facebook);
        $facebook.login();
    }

    $scope.$on('fb.auth.login', function(data) {
        console.log(data);
    });

    $scope.$on('fb.auth.authResponseChange', function(data, d) {
        console.log(d);
        FB.api('/me', function(response) {
           console.log(response);
        });
    })
    

    /**
     * Параметры попапа
     * @type {Object}
     */
    $scope.opts = {
        backdropFade: true,
        dialogFade:true,
        dialogClass: "login modal"
    };
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
    $scope.controller = $location.path().split("/").join("_");

    $scope.$on('$routeChangeStart', function(event, next, current) { 
        $scope.controller = $location.path().split("/").join("_");
    });
}

function FollowController($scope, $rootScope, User, $location, $routeParams, AuthUser) {
    $scope.rootUser = $rootScope.authUser ? $rootScope.authUser : false;
    $scope.compareState = 1;
    
    $scope.onCompare = function(user) {
        if($scope.onClickCompare == true) {
            console.log($scope.compareState);
            if($scope.compareState == 1) {
                $location.path("/profile/"+$routeParams.userId1+"/"+user.user.sguid+"/");
                $scope.compareState = 0;
            } else {
                $location.path("/profile/"+user.user.sguid+"/"+$routeParams.userId2+"/");
                $scope.compareState = 1;
            }
        }
    }

    $scope.onMouseEnterUser = function(user) {
        user.show = true;
    }

    $scope.onMouseLeaveUser = function(user) {
        user.show = false;
    }

    $scope.$on('login', function() {
        $scope.rootUser = $rootScope.authUser;
        User.get_friends({id: $rootScope.authUserId}, {}, function(data) {
            $scope.userFrends = data;
            $rootScope.$broadcast('followsGet', { follows: data});
        });
    });

    $scope.$on('authUserGetData', function() {
        $scope.rootUser = $rootScope.authUser;
    });

    $scope.$on('logout', function() {
        $scope.rootUser = null;
    });

    $scope.$on('addToFollow', function($event, message) {
        $scope.userFrends.push(message.user);
    });

    $scope.$on('removeToFollow', function($event, message) {
        $scope.userFrends = $scope.userFrends.filter(function(data) {
            if(data.user.sguid != message.user.user.sguid) {
                return data;
            }
        });
        $rootScope.$broadcast('removeToFollowOnTop', {follows: $scope.userFrends});
    });

    $scope.onUnfollow = function(user) {
        User.destroy_friendship({id: AuthUser.get(), friendId: user.user.sguid}, { }, function() { 
            user.user.isFrend = false;
            $rootScope.$broadcast('removeToFollow', {user: user});
        });
    }

    if($rootScope.authUserId) {
        User.get_friends({id: $rootScope.authUserId}, {}, function(data) {
            $scope.userFrends = data;
            $rootScope.$broadcast('followsGet', { follows: data});
        });
    }

    $scope.onMoveToUser = function() {
        $location.path("/profile/"+$rootScope.authUserId+"/compare/");
    }    
}


/**
 * Контроллер главной страницыMainC
 * @param {[type]} $scope  [description]
 * @param {[type]} Leagues [description]
 */
function MainController($scope, Leagues, User, AuthUser, $rootScope, $location, $timeout) {
    $scope.viewedUsers = [];
    $scope.state = 1;
    $scope.stateText = 'Tag';
    $scope.rootUser = $rootScope.authUser ? $rootScope.authUser : false;
    $scope.tmpFollow = [];

    $scope.onOpenLogin = function() {
        $rootScope.$broadcast('openLoginModal');
    }

    $scope.onState = function() {
        if($scope.state) {
            $scope.state = 0;
            $scope.stateText = 'Tile';
        } else {
            $scope.state = 1;
            $scope.stateText = 'Tag';
        }
    }

    $scope.$watch($rootScope.authUser, function(newValue, oldValue, scope) {
        if($rootScope.authUser) {
            $scope.rootUser = $rootScope.authUser;
        } else {    
            $scope.rootUser = false;
        }
    });

    $scope.$on('login', function() {
        $scope.rootUser = $rootScope.authUser;
    });

    $scope.$on('followsGet', function($event, message) {
        if($scope.viewedUsers.length > 0) {
            $scope.testFollow(message.follows);
        } else {
           $scope.tmpFollow = message.follows;
        }
    });

    $scope.$on('removeToFollowOnTop', function($event, message) {
        $scope.testFollow(message.follows);
    });

    $scope.testFollow = function(follows) {
        angular.forEach(follows, function(value, key) {
            angular.forEach($scope.viewedUsers, function(v2, k2) {
                if(v2.user.sguid == value.user.sguid) {
                    v2.user.isFrend = true;
                } else {
                    if(v2.user.isFrend != true) {
                        v2.user.isFrend = false;   
                    }
                }
            });
        });
    }

    $scope.$on('authUserGetData', function() {
        console.log($scope.rootUser);
        $scope.rootUser = $rootScope.authUser;
    });

    $scope.$on('logout', function() {
        $scope.rootUser = null;
    });

    $scope.getAllUser = function($event) {
        User.for_main({}, {}, function(data) {
            $scope.viewedUsers = data.shuffle();
            if($scope.tmpFollow.length > 0) {
                $scope.testFollow($scope.tmpFollow);
            }
        });
    }
    
    $scope.getAllUser();

    $scope.onDragStart = function(user) {
        user.isLeave = true;
        user.dragged = true;
    }

    $scope.onDragOver = function(userItem) {
        userItem.user.drag = true;
        
    }

    $scope.onDragOut = function(userItem) {
        //userItem.user.drag = false;
    }

    $scope.onDrop = function(e, src) {
        var dropId =  $(src).attr("id");
        var droppedId =  $(e.delegateTarget).attr("id");
        
        if(dropId != droppedId) {
            $scope.$apply(function() {
                $location.path("/profile/"+droppedId+"/"+dropId);   
            })
        }
        
    }

    $scope.onMoveToUser = function(user) {
        if($scope.rootUser.sguid) {
            $location.path("/profile/"+$scope.rootUser.sguid+"/"+user.user.sguid);
        } else {
            $location.path("/profile/"+user.user.sguid);
        }
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

    $scope.onMouseLeaveUser = function(user) {
        user.showHint = false;
        user.isLeave = true;
        user.showMenu = false;
    }

    $scope.onFollow = function($event, user) {
        User.create_friendship({id: AuthUser.get()}, {
            friend_guid: user.user.sguid
        }, function() { 
            user.user.isFrend = true; 
            $rootScope.$broadcast('addToFollow', {user: user});
        });
        $event.stopPropagation();
    }

    /**
     * Удаление нужно будет доделать
     * @param  {[type]} $event [description]
     * @param  {[type]} user   [description]
     * @return {[type]}        [description]
     */
    $scope.onUnFollow = function($event, user) {
        User.destroy_friendship({id: AuthUser.get(), friendId: user.user.sguid}, { }, function() { 
            user.user.isFrend = false;
            $rootScope.$broadcast('removeToFollow', {user: user});
        });
        $event.stopPropagation();
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
            User.by_league({league_guid:value.league.sguid}, {}, function(v2, k2){
                var user2 = [];
                angular.forEach(v2, function(value, key){
                    if(value.user.published == 1) {
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
                
                value.league.users = users;
            })
        });

    })

    User.get_all({}, {}, function(datas) {
        $scope.looserUser = datas.filter(function(item) {
            if(!item.user.league) {
                return item;
            }
        });
    });
}

function NeighboursCtrl($scope, $location, localize, User, AuthUser, Leagues, $rootScope) {
    $scope.onChangeUser = function(userId) {
        $location.search("userId", userId);
    }

    $scope.topL = localize.getLocalizedString('_topL_');
    $scope.flwL = localize.getLocalizedString('_flwL_');
    $scope.neighL = localize.getLocalizedString('_neighL_');

    User.get_friends({id: AuthUser.get()}, function(data) {
        $rootScope.$broadcast('usersLoaded', {
            id: 'follow',
            users: data
        });
    });

    User.get_all({}, {}, function(data) {
        User.query({id: AuthUser.get()},{ }, function(currentUser) {
            var newUsers = [];
            angular.forEach(data, function(value, key) {
                if(value.user.points < currentUser.points+10000 && value.user.points > currentUser.points-10000) {
                    if(value.user.sguid != currentUser.sguid && value.user.published) {
                        newUsers.push(value);
                    }
                }
            });
            $rootScope.$broadcast('usersLoaded', {
                id: 'neigh',
                users: newUsers
            });
        });
        
    });


    /**
     * Забираем запросом список лиг.
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
    Leagues.query({}, {}, function(data) {
        /**
         * Сортируем лиги по убыванию
         * @param  {[type]} a [description]
         * @param  {[type]} b [description]
         * @return {[type]}   [description]
         */
        data.sort(function(a,b) {
            return a.league.position + b.league.position;
        });

        /**
         * Получаем 3 наикрутейшие лиги
         * @type {[type]}
         */
        $scope.leagues = data.splice(0,1);
        $scope.viewedUsers = [];

        /**
         * Проходимся по оплучившемуся массиву лиг и получаем список пользователей
         * @param  {[type]} value [description]
         * @param  {[type]} key   [description]
         * @return {[type]}       [description]
         */
        angular.forEach($scope.leagues, function(value, key){
            User.by_league({league_guid: value.league.sguid}, {}, function(userData) {
                $rootScope.$broadcast('usersLoaded', {
                    id: 'top',
                    users: userData
                });
            });
        });
    })
}

function LogoutController($scope, AuthUser, $location, $rootScope) {
    AuthUser.logout();
    $rootScope.authUser = null;
    $rootScope.$broadcast('logout');
    $location.path("/");
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
      console.log(needsCountLoaded);
	  if(needsCountLoaded == 2) {
	      angular.forEach(needsValues[$scope.userId2], function(value, key){
	          if(value < needsValues[$scope.userId1][key]) {
	              $("li[data-needId='"+key+"'] .cr", $("#compare")).append('<sup class="du"></sup>');
	          } else {
	              $("li[data-needId='"+key+"'] .cr", $("#compare")).append('<sub class="du"></sub>');
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
	         $("li[data-id='"+fCriterium.sguid+"']", $("#compare")).append('<sub class="du"></sub>');
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
	            $("li[data-goalid='"+key+"'] > h5", $("#compare")).append('<sup class="du"></sup>');
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
            $location.path("/profile/"+$scope.authUserId+"/"+user.user.sguid);
        } else {
            $location.path("/profile/"+user.user.sguid);
        }
    }
}

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function RootController($scope, AuthUser, User, $rootScope, Needs) {
    $rootScope.authUserId = AuthUser.get();

    $scope.getUserInfo = function() {
        if($rootScope.authUserId) {
            User.query({id: $rootScope.authUserId}, function(data) {
                $rootScope.authUser = data;
                $rootScope.$broadcast('authUserGetData');
            });    
        }
    }

    $scope.getUserInfo();

    $scope.$on('updateUserData', function($event, message) {
        if(message.user.sguid == $rootScope.authUserId) {
            $rootScope.authUser = message.user;
        }
    });
    
}

function LeaguesController($scope, Leagues, User) {
    $scope.currentLeague = 0;
    $scope.leagues = [];
    $scope.limit = 5;

    $scope.onLeagUser = function(item){
    	$scope.currentLeague = item;
    }

    /**
    * Забираем запросом список лиг.
    * @param  {[type]} data [description]
    * @return {[type]}      [description]
    */
    Leagues.query({}, {}, function(data) {
        /**
         * Сортируем лиги по убыванию
         * @param  {[type]} a [description]
         * @param  {[type]} b [description]
         * @return {[type]}   [description]
         */
        data.sort(function(a,b) {
            return a.league.position + b.league.position;
        });

        /**
         * Получаем 3 наикрутейшие лиги
         * @type {[type]}
         */
        $scope.leaguesTop = data.splice(0,6);
        $scope.leaguesRight = data;

        /**
         * Проходимся по оплучившемуся массиву лиг и получаем список пользователей
         * @param  {[type]} value [description]
         * @param  {[type]} key   [description]
         * @return {[type]}       [description]
         */
        angular.forEach($scope.leaguesTop, function(value, key){
            User.by_league({league_guid: value.league.sguid}, {}, function(userData) {
					value.league.users = userData;
         		if (key == 0){
         			$scope.currentLeague = value;
         		}
            });
        });
        angular.forEach($scope.leaguesRight, function(value, key){
            User.by_league({league_guid: value.league.sguid}, {}, function(userData) {
					value.league.users = userData;
            });
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
                        $scope.user.avatar = data.message;
                        $scope.user.avatar.full_path = createImageFullPath($scope.user.avatar);
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

Array.prototype.shuffle = function(b) {
    var i = this.length, j, t;
    while(i) {
        j = Math.floor( ( i-- ) * Math.random() );
        t = b && typeof this[i].shuffle!=='undefined' ? this[i].shuffle() : this[i];
        this[i] = this[j];
        this[j] = t;
    }

    return this;
};

Array.prototype.remove = function(from, to) {
    var rest = this.slice((to || from) + 1 || this.length);
      this.length = from < 0 ? this.length + from : from;
      return this.push.apply(this, rest);
};