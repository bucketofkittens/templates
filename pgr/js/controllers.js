'use strict';

function navCtrl($scope, localize, $location) {
	$scope.hidden = false;

	/**
	 * Событие вызываемое при загрузке файлов локализации.
	 * Нужно для создания массива верхнего меню, локализованного
	 * @return {[type]} [description]
	 */
	$scope.$on('localizeResourcesUpdates', function() {
        $scope.navs = [
			//{name: localize.getLocalizedString("_ABOUT_"), link: '#', activeClass: ''},
			//{name: localize.getLocalizedString("_LEAGUES_"), link: '#', activeClass: ''},
			{name: localize.getLocalizedString("_PROFILE_"), link: '#/profile', activeClass: ''},
			{name: localize.getLocalizedString("_LogoutL_"), link: '#', activeClass: ''}
		];

		angular.forEach($scope.navs, function(value, key) {
			if($location.path() == value.link.replace("#", "")) {
				$scope.navs[key].activeClass = 'current';
			} 
		});
   });

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
function ProfileController($scope, $route, $routeParams, User, Needs, Professions, States) {
    
	$scope.userId = $routeParams.userId;
	$scope.user = null;
	$scope.needs = Needs.query();
	$scope.professions = Professions.query();
	$scope.states = States.query();

	if($routeParams.userId) {
		$scope.user = User.query({id: $routeParams.userId});
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
	 * Публикая профиля
	 * Пока не работает нет backend
	 * @param  {[type]} $event [description]
	 * @return {[type]}        [description]
	 */
	$scope.onPublish = function($event) {
		User.updateUser({"id": $scope.user.sguid},  $.param({user: {
				"login": $scope.user.login,
				"name": $scope.user.name,
				"email": $scope.user.email,
				"confirmed": 1
			}})
		);
	}
}

function CriteriaController($scope, Goals, Criterion) {
	$scope.criterion_values = {};
    
    /**
     * 
     * @param  {[type]} goalId [description]
     * @return {[type]}        [description]
     */
	$scope.open = function (goalId) {
		var self = this;

		/**
		 * Обход циклом для получения всех значений для критерий.
		 * Можно найти более прямое решение
		 * @param  {[type]} data [description]
		 * @return {[type]}      [description]
		 */
		Goals.get({id: goalId}, function(data) {
			$scope.goal = data;

			angular.forEach($scope.goal, function(gV, gK) {
				if(gV.criteria) {
					angular.forEach(gV.criteria, function(cV, cK) {
						Criterion.query({id: cV.criterium.sguid }, function(d) {
							$scope.goal[gK].criteria[cK].criterium.criteria_values = d[0].criterium.criteria_values;
						})
					});
				}
			});

			$scope.shouldBeOpen = true;
		});
		
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
		dialogFade:true
	};
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
		console.log($scope.user);
		$scope.shouldBeOpen = true;		
	};
    
    /**
     * 
     * @returns {undefined}
     */
	$scope.close = function () {
		console.log($scope.user);
		$scope.shouldBeOpen = false;
	};

    /**
     * 
     * @param {type} $event
     * @returns {undefined}
     */
	$scope.addUser = function ($event) {
		User.create($.param({user: {
				"login": $scope.user.login,
				"name": $scope.user.name,
				"email": $scope.user.email,
				"password": $scope.user.password
			}})
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