'use strict';

function navCtrl($scope, localize, $location, AuthUser) {
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

	/**
	 * Событие вызываемое при загрузке файлов локализации.
	 * Нужно для создания массива верхнего меню, локализованного
	 * @return {[type]} [description]
	 */
	$scope.$on('localizeResourcesUpdates', function() {
		$scope.generateNav();

		angular.forEach($scope.navs, function(value, key) {
			if($location.path() == value.link.replace("#", "")) {
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
			//{name: localize.getLocalizedString("_ABOUT_"), link: '#', activeClass: ''},
			//{name: localize.getLocalizedString("_LEAGUES_"), link: '#', activeClass: ''},
			{name: localize.getLocalizedString("_PROFILE_"), link: $scope.authUser ? '#/profile/'+$scope.authUser : '#/profile/', activeClass: '', show: true},
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
	$scope.$on('$routeChangeStart', function(event, next, current) { 
   		angular.forEach($scope.navs, function(value, key) {
			$scope.navs[key].activeClass = $scope.navs[key].link.replace("#", "") === $location.path() ? 'current' : '';
		});
 	});
}

/**
 * Контроллер страницы профиля
 * @param {type} $scope
 * @param {type} $route
 * @param {type} $routeParams
 * @param {type} User
 * @param {type} Needs
 * @param {type} Professions
 * @param {type} States
 * @returns {undefined}
 */
function ProfileController($scope, $route, $routeParams, User, Needs, Professions, States, $http, NeedsByUser, $rootScope, GoalsByUser) {
    
	$scope.userId = $routeParams.userId;
	$scope.user = null;
	$scope.newImage = null;
	$scope.needs = Needs.query({}, {}, function(data) {
		$rootScope.$broadcast('needsLoaded');
	});
	$scope.professions = Professions.query();
	$scope.states = States.query();
	$scope.isImage = false;

	if($routeParams.userId) {
		User.query({id: $routeParams.userId}, function(data) {
		 	$scope.user = data;
		 	if($scope.user.picture_url && $scope.user.picture_url.length > 0) {
				$scope.isImage = true;
			}
		});
	}

	/**
	 * 
	 * @return {[type]} [description]
	 */
	$scope.$on('needsLoaded', function() {
		$scope.userCriteriaUpdate();
	});

	$scope.$on('userCriteriaUpdate', function() {
		$scope.userCriteriaUpdate();
	});

	$scope.userCriteriaUpdate = function() {
		NeedsByUser.get({id: $routeParams.userId}, {}, function(data) {
			angular.forEach(data, function(value, key){
				angular.forEach($scope.needs, function(needVal, needKey){
					if($scope.needs[needKey].need.sguid == key) {
						$scope.needs[needKey].current_value = value;
					}
					if(!$scope.user.points) {
						$scope.user.points = 0;
					}
					
					if(typeof(value) == 'number') {
						$scope.user.points += value;
					}
				});
			});
		});

		GoalsByUser.get({id: $routeParams.userId}, {}, function(data) {
			angular.forEach(data, function(value, key){
				angular.forEach($scope.needs, function(needVal, needKey){
					angular.forEach(needVal.need.goals, function(goal, goalKey){
						if(goal.goal.sguid == key) {
							$scope.needs[needKey].need.goals[goalKey].current_value = value;
						}
					});
				});
			});
		});
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

    /**
     * 
     * @param {type} $event
     * @returns {undefined}
     */
	$scope.onEditSave = function($event) {
		User.updateUser({"id": $scope.user.sguid},  $.param({user: {
				"login": $scope.user.login,
				"name": $scope.user.name,
				"email": $scope.user.email
			}})
		);
		$event.target.setAttribute("disabled", "disabled"); 
	};

	/**
	 * [onReadFile description]
	 * @param  {[type]} $event
	 * @return {[type]}
	 */
	$scope.onReadFile = function($event) {
		var photo = document.getElementById("photo");
    	var file = photo.files[0];
    	var data = new FormData();

    	data.append("picture", file);
    	data.append("owner_type", 0);

    	var xhr = new XMLHttpRequest();

		xhr.open('PUT', host+'/pictures/'+$scope.user.sguid, true);
		xhr.onload = function (e) {
		  if (xhr.readyState === 4) {
		  	location.reload();
		  }
		};
		xhr.send(data);
	}

	/**
	 * 
	 * @param  {[type]} $event
	 * @return {[type]}
	 */
	$scope.onUpdateFile = function($event) {
		$("#photo").click();
	}

	/**
	 * Публикая профиля
	 * Пока не работает нет backend
	 * @param  {[type]} $event [description]
	 * @return {[type]}        [description]
	 */
	$scope.onPublish = function($event) {
		User.updateUser({"id": $scope.user.sguid},  $.param({user: {
				"name": $scope.user.name,
				"email": $scope.user.email
			}})
		);
	}
}

/**
 * 
 * @param {[type]} $scope
 * @param {[type]} Goals
 * @param {[type]} Criterion
 */
function CriteriaController($scope, Goals, Criterion, AuthUser, UserCriteriaValue, $rootScope, CriterionByGoal, UserCriteriaValueByUser) {
	$scope.criteriums = {};
    
    /**
     * 
     * @param  {[type]} goalId [description]
     * @return {[type]}        [description]
     */
	$scope.open = function (goalId, $event, needId, goal) {
		var self = this;

		/**
		 * Обход циклом для получения всех значений для критерий.
		 * Можно найти более прямое решение
		 * @param  {[type]} data [description]
		 * @return {[type]}      [description]
		 */
		CriterionByGoal.query({id: goalId}, function(data) {
			goal.goal.criteriums = data;

			UserCriteriaValueByUser.query({id: AuthUser.get()}, {}, function(d) {
				angular.forEach(d, function(userCriteriaItem, userCriteriaKey) {
					angular.forEach($scope.criteriums, function(criteriumsItem, criteriumsKey) {
						angular.forEach(criteriumsItem.criterium.criteria_values, function(criteriaValueItem, criteriaValueKey) {
							if(
								userCriteriaItem.user_criterion_value.criteria_value_sguid == criteriaValueItem.criteria_value.sguid &&
								userCriteriaItem.user_criterion_value.criteria_sguid == $scope.criteriums[criteriumsKey].criterium.sguid) {
								goal.goal.criteriums[criteriumsKey].criterium.criteria_values[criteriaValueKey].user_criteria = "current";
							} 
						});
					});
				});
			});
		});



		$($event.target).parent().find(".criterion").toggleClass("show");
		
	};

	/**
	 * 
	 * @param  {[type]} criteria [description]
	 * @return {[type]}          [description]
	 */
	$scope.onCliteriaSelect = function(criteriaValue, criteria, $event) {
		UserCriteriaValue.create({}, $.param({
			"user_guid": AuthUser.get(),
			"criteria_guid": criteria.sguid,
			"criteria_value_guid": criteriaValue.sguid
		}), function(data) {
			$($event.target).parent().find("li").removeClass("current");
			$($event.target).addClass("current");

			$rootScope.$broadcast('userCriteriaUpdate');
		});
	}

	$scope.onShowGoals = function($event) {
		console.log($($event.target).parent());
		$($event.target).parent().parent().find("ul").toggleClass("show");
	}
}

/**
 * Контроллер формы регистрации
 * @param {[type]} $scope    [description]
 * @param {[type]} $location [description]
 * @param {[type]} User      [description]
 */
function RegController($scope, $location, User) {
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
						console.log(value);
						$scope.errors += value;
					});
				} else {
					$scope.shouldBeOpen = false;
					$location.path('/profile/'+data.message.guid);
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
function LoginController($scope, Sessions, $rootScope, AuthUser) {
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
				$scope.shouldBeOpen = false;
				$rootScope.$broadcast('login');
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
     * Параметры попапа
     * @type {Object}
     */
	$scope.opts = {
		backdropFade: true,
		dialogFade:true,
		dialogClass: "login modal"
	};
}