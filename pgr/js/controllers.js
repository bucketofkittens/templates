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
			{name: localize.getLocalizedString("_PROFILE_"), link: $scope.authUser ? '#/profile/'+$scope.authUser : '#/profile/', activeClass: '', show: $scope.authUser ? true : false},
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
function ProfileController($scope, $route, $routeParams, User, Needs, Professions, States, $http, NeedsByUser, $rootScope, GoalsByUser, AuthUser, Friendships, Leagues, $location) {
	$scope.user = null;
	$scope.newImage = null;
	
	$scope.professions = Professions.query();
	$scope.states = States.query();
	$scope.isImage = false;
	$scope.isCurrentUser = false;
	$scope.isProfileLoaded = false;
	$scope.isFrend = false;
	$scope.isAchievements = false;
	$scope.isLeague = false;
	$scope.nextUser = null;
	$scope.userId = AuthUser.get();
	$scope.routeUserId = $routeParams.userId;

	/**
	 * список всех пользователей
	 * @param  {[type]} data [description]
	 * @return {[type]}      [description]
	 */
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

	/**
	 * Отправляет запрос изменение лиги на сервер
	 * @return {[type]} [description]
	 */
	$scope.$on('updateLegue', function() {
		User.update_legue({id: AuthUser.get()}, {
			points: $scope.user.points
		}, function(data) {
			$rootScope.$broadcast('updateUserLegueAndPoints');
		});
	});

	/**
	 * Событие обновления лиги у пользователя
	 * @return {[type]} [description]
	 */
	$scope.$on('updateUserLegueAndPoints', function() {
		User.query({id: $routeParams.userId}, $.proxy($scope.userLegueAndPointsUpdate_, $scope));
	});

	/**
	 * Обновляет данные лиги у пользователя
	 * @param  {[type]} data [description]
	 * @return {[type]}      [description]
	 */
	$scope.userLegueAndPointsUpdate_ = function(data) {
		$scope.user.league = data.league;
		$scope.user.points = data.points;
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

	this.generateAgesArray = function(min, max) {
		var i = min, ret = [];
		for(i = min; i <= max; i++){
			ret.push(i);
		}
		return ret;
	}

	$scope.getUserInfo = function() {
		User.query({id: $routeParams.userId}, function(data) {
		 	$scope.user = data;
		 	if($scope.user.sguid == AuthUser.get()) {
		 		$scope.isCurrentUser = true;
		 	}
		 	if($scope.user.avatar) {
				$scope.isImage = true;
			}
			if($scope.user.achievements.length > 0) {
				$scope.isAchievements = true;
			}
			if($scope.user.league) {
				User.by_league({league_guid: $scope.user.league.sguid}, {}, function(data) {
					$scope.user.league.users = data;
					if($scope.user.league.users.length > 0) {
						$scope.user.league.isUser = true;
						$scope.isLeague = true;
					}
				});
			}
			

			$scope.isProfileLoaded = true;
		});

		/**
		 * Определяем есть ли пользователь в друзьях или нет
		 * @param  {[type]} data [description]
		 * @return {[type]}      [description]
		 */
		User.query({id: AuthUser.get()}, function(data) {
			$scope.nextUser = data;
			angular.forEach(data.friends_guids, $.proxy($scope.testFriend, this)); 
		});
	}

	$scope.testFriend = function(value, key) {
		if(value == $routeParams.userId) {
			$scope.isFrend = true;
		}
	}

	if($routeParams.userId) {
		$scope.getUserInfo();
	}

	$scope.ages = this.generateAgesArray(14, 150);

	

	$scope.onCompare = function(id) {
		$location.path('/compare/'+id);
	}

    /**
     * 
     * @param {type} $event
     * @param {type} elementId
     * @returns {undefined}
     */
	$scope.onEditActivate = function($event, elementId) {
		if($scope.isCurrentUser) {
			angular.element(".form-control").attr("disabled", "disabled");
		
			var elm = angular.element("#"+elementId)[0];
			if(elm.getAttribute("disabled")) {
				elm.removeAttribute("disabled");
				elm.focus();
			} else {
				elm.setAttribute("disabled", "disabled");
			}	
		}
		
	};


	$scope.onElementClick = function($event) {
		if($scope.isCurrentUser) {
			var elm = $($event.target);
			$("input[type='text'], input[type='email'], select", ".pmpar").attr("readonly", "readonly");
			$(elm).attr("readonly", false);
			$(elm).focus();
		}
	};
	

	/**
	 * [onReadFile description]
	 * @param  {[type]} $event
	 * @return {[type]}
	 */
	$scope.onReadFile = function($event) {
		if($scope.isCurrentUser) {
			$rootScope.$broadcast('loaderShow');

			var data = new FormData();
	    	data.append("picture", document.getElementById("photo").files[0]);
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
					$scope.getUserInfo();
					$rootScope.$broadcast('loaderHide');
				});
			});
		}
	}

	/**
	 * 
	 * @param  {[type]} $event
	 * @return {[type]}
	 */
	$scope.onUpdateFile = function($event) {
		if($scope.isCurrentUser) {
			$("#photo").click();
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
				$rootScope.$broadcast('updateUser');
				$("input[type='text'], input[type='email'], select", ".pmpar").attr("readonly", "readonly");
			}
		);
	}

	$scope.onAddFrend = function($event) {
		$rootScope.$broadcast('loaderShow');

		Friendships.create({friendship: JSON.stringify({user_guid: AuthUser.get(), friend_guid: $scope.userId}) }, function(data) {
			$rootScope.$broadcast('updateUser');
			$rootScope.$broadcast('loaderHide');
		});
	}

	$scope.onRemoveFrend = function($event) {
		/**
		$rootScope.$broadcast('loaderShow');
		console.log($scope.user);
		Friendships.del({friendship: JSON.stringify({user_guid: AuthUser.get(), friend_guid: $scope.userId}) }, function(data) {
			$rootScope.$broadcast('updateUser');
			$rootScope.$broadcast('loaderHide');
		});
		**/
	}

	$scope.onMoveUserClick = function($event, nextUser) {
		AuthUser.set(nextUser.user.sguid);
		$rootScope.$broadcast('login');
		$location.path("/profile/"+nextUser.user.sguid);
	}
}

/**
 * 
 * @param {[type]} $scope
 * @param {[type]} Goals
 * @param {[type]} Criterion
 */
function CriteriaController($scope, Goals, Criterion, AuthUser, UserCriteriaValue, $rootScope, CriterionByGoal, UserCriteriaValueByUser, $routeParams, Needs, User) {
    /**
     * Получаем список needs
     * @param  {[type]} data [description]
     * @return {[type]}      [description]
     */
    Needs.query({}, {}, function(data) {
		$scope.needs = data;
		$rootScope.$broadcast('needsLoaded');
	});

    $scope.currentGoal = null;
    $scope.currentNeed = null;
    $scope.currentUserCriterias = null;

    $scope.userCriteriaUpdate = function() {
		User.needs_points({id: $scope.currentUserId}, {}, function(data) {
			console.log(data);
			angular.forEach(data, function(value, key) {
				var fNeed = $scope.needs.filter(function (need) { return need.sguid == key });
				if(fNeed[0]) {
					fNeed[0].current_value = value;
				}
			});
		});

		User.goals_points({id: $scope.currentUserId}, {}, function(data) {
			angular.forEach(data, function(value, key){
				angular.forEach($scope.needs, function(needVal, needKey){
					var fGoal = $scope.needs[needKey].goals.filter(function (goal) { return goal.sguid == key });
					if(fGoal[0]) {
						fGoal[0].current_value = value;
					}
				});
			});
		});
	}

	$scope.$on('needsLoaded', function() {
		$scope.userCriteriaUpdate();
	});

    /**
     * 
     * @param  {[type]} goalId [description]
     * @return {[type]}        [description]
     */
	$scope.open = function ($event, need, goal) {
		if(!goal.criteriums) {
			$scope.currentGoal = goal;
			$scope.currentNeed = need;

			/**
			 * Обход циклом для получения всех значений для критерий.
			 * Можно найти более прямое решение
			 * @param  {[type]} data [description]
			 * @return {[type]}      [description]
			 */
			CriterionByGoal.query({id: goal.sguid}, function(data) {
				goal.criteriums = data;
				/**
				 * добавляем пустой элемент
				 */
				angular.forEach(goal.criteriums, function(criteriumsItem, criteriumsKey) {
					if(criteriumsItem.criteria_values) {
						criteriumsItem.criteria_values.splice(0, 0, {
							name: "none",
							position: 0,
							sguid: "none",
							value: 0
						});	
					}
				});

				UserCriteriaValueByUser.query({id: $scope.currentUserId}, {}, function(d) {
					$scope.currentUserCriterias = d;

					angular.forEach(d, function(userCriteriaItem, userCriteriaKey) {
						angular.forEach(goal.criteriums, function(criteriumsItem, criteriumsKey) {
							angular.forEach(criteriumsItem.criteria_values, function(criteriaValueItem, criteriaValueKey) {
								if(
									userCriteriaItem.user_criterion_value.criteria_value_sguid == criteriaValueItem.sguid &&
									userCriteriaItem.user_criterion_value.criteria_sguid == goal.criteriums[criteriumsKey].sguid) {
									criteriumsItem.user_criteria_sguid = userCriteriaItem.user_criterion_value.criteria_value_sguid;
									criteriumsItem.user_criteria_id = userCriteriaItem.user_criterion_value.sguid;
									
									var currentElement = $('li[data-id="'+userCriteriaItem.user_criterion_value.criteria_sguid+'"] li[data-id="'+userCriteriaItem.user_criterion_value.criteria_value_sguid+'"]');
									$scope.setCriteriaPosition(currentElement);
								} 
							});
						});
					});

				});
			});	
		}
		
		$($event.target).parent().find(".criterion").toggleClass("show");
	};


	/**
	 * 
	 * @param  {[type]} criteria [description]
	 * @return {[type]}          [description]
	 */
	$scope.onCriteriaSelect = function(criteriaValue, criteria, $event) {
		if($scope.isCurrentUser && !$($event.target).hasClass("current")) {
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
			$scope.updateNeedsAndAreaPoints(criteriaValue, criteria);
		}
	}

	$scope.updateNeedsAndAreaPoints = function(criteriaValue, criteria) {
		var fCriterium = $scope.currentGoal.criteriums.filter(function (criterium) { 
			return criterium.sguid == criteria.sguid;
		});

		var currentValue = 0;

		if(fCriterium[0].user_criteria_sguid) {
			var fCriteriumValue = fCriterium[0].criteria_values.filter(function(value) {
				return value.sguid == fCriterium[0].user_criteria_sguid;
			});
		
			currentValue = fCriteriumValue[0].value;	
		} 

		if(currentValue != criteriaValue.value) {
			if(currentValue > criteriaValue.value) {
				$scope.currentNeed.current_value -= (currentValue - criteriaValue.value);
				$scope.currentGoal.current_value -= (currentValue - criteriaValue.value);
			} else {
				$scope.currentNeed.current_value += (criteriaValue.value - currentValue);
				$scope.currentGoal.current_value += (criteriaValue.value - currentValue);
			}
		}

		fCriterium[0].user_criteria_sguid = criteriaValue.sguid;
		
	}

	$scope.setCriteriaPosition = function(elm) {
		var parentLi  = elm,
			parentUl  = parentLi.parent(),
		    slider = parentUl.find("span");

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

	$scope.setCriteriaPositionNull = function(elm) {
		var parentLi  = elm.parent(),
			parentUl  = parentLi.parent(),
		    slider = parentUl.find("span");

		parentUl.find("li").removeClass("current").removeClass("white-text");
		parentUl.find("li:eq(0)").addClass("current");

		slider.css("width", "5%");
	}

	$scope.onShowGoals = function($event) {
		$($event.target).parent().parent().find("> ul").toggleClass("show");
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
function LoginController($scope, Sessions, $rootScope, AuthUser) {
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


/**
 * Контроллер главной страницы
 * @param {[type]} $scope  [description]
 * @param {[type]} Leagues [description]
 */
function MainController($scope, Leagues, User, AuthUser, $rootScope, Friendships) {

	/**
	 * Массив лиг
	 * @type {Array}
	 */
	$scope.leagues = [];

	/**
	 * Количество лиг показываемых на главной
	 * @type {Number}
	 */
	$scope.maxLeaguesView = 3;

	/**
	 * Массив ячеек
	 * @type {type}
	 */
	$scope.cells = {id: "test"};
	$scope.isAuth = false;

	$scope.loadUser = function() {
		$scope.authUser = AuthUser.get();
		if($scope.authUser) {
			$scope.isAuth = true;
			User.query({id: $scope.authUser}, function(data) {
			 	$scope.authUserData = data;
			});	
		} else {
			$scope.isAuth = false;
		}
	}

	
	$scope.authUserData = null;
	$scope.loadUser();
	$scope.viewedUsers = [];

	
	$scope.$on('login', function() {
		$scope.loadUser();
	});

	$scope.setCurrentElementNav = function($event) {
		var el = $($event);
		$("#main_nav li").removeClass("current");
		if(el[0]) {
			$(el[0].target).parent().addClass("current");
		}
	}

	$scope.onFellows = function($event) {
		Friendships.by_user({user_guid: $scope.authUser}, {}, function(data) {
			$scope.viewedUsers = data;
		});
		$scope.setCurrentElementNav($event);
	}

	$scope.onTop = function($event) {
		$scope.setCurrentElementNav($event);

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
			$scope.leagues = data.splice(0,$scope.maxLeaguesView);
			$scope.viewedUsers = [];

			/**
			 * Проходимся по оплучившемуся массиву лиг и получаем список пользователей
			 * @param  {[type]} value [description]
			 * @param  {[type]} key   [description]
			 * @return {[type]}       [description]
			 */
			angular.forEach($scope.leagues, function(value, key){
				User.by_league({league_guid: value.league.sguid}, {}, function(userData) {
					$scope.viewedUsers = $scope.viewedUsers.concat(userData);
				});
			});
		})
	}
	
	$scope.onTop();
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
						console.log(step-points);
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
}

/**
 * 
 * @param {[type]} $scope [description]
 */
function RightGalleryController($scope) {
	$scope.slideStep = 180;
	$scope.currentStep = 0;

	$scope.onBottom = function() {
		$scope.currentStep += $scope.slideStep;
	}
	$scope.onTop = function() {
		$scope.currentStep -= $scope.slideStep;
	}
}

/** Контроллер сравнений */
function CompareController($scope, $location, User, $routeParams, AuthUser, Needs, $rootScope) {	
	$scope.user = false;
	$scope.useri = false;
	$scope.userId = AuthUser.get();
	$scope.getUserInfo = function() {
		User.query({id: $routeParams.id}, function(data) {
		 	$scope.user = data;		 	
		});
	}
	$scope.getUseriInfo = function() {
		User.query({id: AuthUser.get()}, function(data) {
		 	$scope.useri = data;
		 	console.log($scope.useri);
		 	if($scope.useri.league) {
				User.by_league({league_guid: $scope.useri.league.sguid}, {}, function(data) {
					$scope.useri.league.users = data;
					if($scope.useri.league.users.length > 0) {
						$scope.useri.league.isUser = true;
					}
				});
			}
		});
	}
	$scope.getUserInfo();
	$scope.getUseriInfo()
}

function LogoutController($scope, AuthUser, $location, $rootScope) {
    AuthUser.logout();
    
    $location.path("/");
    $rootScope.$broadcast('logout');
}