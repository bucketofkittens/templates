/** preloader */
function preloadController($scope) {
	$scope.show = false;
	$scope.$on('preloadshow', function(evt){
		$scope.show = true;
	});
	$scope.$on('preloadhide', function(evt){
		$scope.show = false;
	});
}


function navCtrl($scope, $location, $rootScope, $route) {
	
	$scope.hidden = false;


	/** роутинг */
	$scope.onNavClick = function($event, nav) {
		if(nav.link) {
		   $location.path(nav.link.replace('#', ''));
		}
		else {
		   nav.onClick();
		}
	};


	/** меню навигации */
	$scope.generateNav = function() {
		$scope.navs = [
		   {name: "HOME", link: '#/home', activeClass: ''},
		   {name: "USERS", link: '#/users', activeClass: ''},
		   {name: "PROVIDERS", link: '#/providers', activeClass: ''},
		   {name: "GOALS LIBRARY", link: '#/goalslib', activeClass: ''},
		   {name: "NSI EDITOR", link: '#/nsiedit', activeClass: ''},
		   {name: "MINDMAPS", link: '#/mindmaps', activeClass: ''},
		   {name: "CHARTS", link: '#/charts', activeClass: ''},
		   {name: "TUTORS", link: '#/tutors', activeClass: ''}
		];
	};
	$scope.generateNav();


	/** Событие при переходе по роутингу */
	$scope.$on('$routeChangeSuccess', function(event, next, current) {
		angular.forEach($scope.navs, function(value, key) {
		   if($scope.navs[key].link) {
		      $scope.navs[key].activeClass = $scope.navs[key].link.split("/")[1] === $location.path().split("/")[1] ? 'current' : '';
		   }
		});
	});
}


/** главная страница */
function MainController($scope) {

}

/** страница юзеров */
function UsersController($scope, Userlist, $rootScope) {
	/** опции пагинации */
	$scope.pagingOptions = {
		pageSize: 20,
		currentPage: 1
   };
   /** текущая страница */
   $scope.setPagingData = function(data, page, pageSize){	
		var pagedData = data.slice((page - 1) * pageSize, page * pageSize);
		$scope.userlist = pagedData;
		if (!$scope.$$phase) {
		   $scope.$apply();
		}
   };
   /** переключение страницы */
	$scope.$watch('pagingOptions', function (newVal, oldVal) {
	   if (newVal !== oldVal && newVal.currentPage !== oldVal.currentPage) {
	   	$scope.setPagingData($scope.userlistall, $scope.pagingOptions.currentPage, $scope.pagingOptions.pageSize);
	   }
	}, true);

	/** редактирование юзера */
	$scope.$on('ngGridEventEndCellEdit', function(evt){
		var user = evt.targetScope.row.entity;
		Userlist.updateUser({"id": user.sguid},  {user: JSON.stringify({
			"login": user.login,
			"name": user.name,
			"email": user.email
		})});
	});


	/** открывание мордала */
   $scope.onOpenCreate = function() {
		$rootScope.$broadcast('openCreateModal');
	}

	/** добавляем нового в таблицу */
   $scope.$on('created', function() {      
		$scope.getUsers();
   });


	/** таблица юзеров */
	$scope.usertable = {
		data: 'userlist', 
		columnDefs: [
			{field:'sguid', visible: false},
			{field:'login', displayName:'Login', cellTemplate:'<div class="ngCellText" ng-class="col.colIndex()"><a href="#/userprofile/{{row.getProperty(\'sguid\')}}" ng-cell-text>{{COL_FIELD}}</a></div>'}, 
			{field:'name', displayName:'Name', cellTemplate:'<div class="ngCellText" ng-class="col.colIndex()"><a href="#/userprofile/{{row.getProperty(\'sguid\')}}" ng-cell-text>{{COL_FIELD}}</a></div>'}, 
			{field:'email', displayName:'E-mail', cellTemplate:'<div class="ngCellText" ng-class="col.colIndex()"><a href="#/userprofile/{{row.getProperty(\'sguid\')}}" ng-cell-text>{{COL_FIELD}}</a></div>'}
		],
		enablePaging: true,
		showFooter: true,
		pagingOptions: $scope.pagingOptions,
		totalServerItems: 'totalServerItems',
		enableCellSelection: false,
		enableRowSelection: true,
		enableCellEdit: true,
		selectedItems: []
	};
	$scope.getUsers = function(){
		Userlist.query({}, {}, function(data) {
			$scope.userlistall = data;
			$scope.totalServerItems = data.length;
			$scope.setPagingData($scope.userlistall, $scope.pagingOptions.currentPage, $scope.pagingOptions.pageSize);
		})
	};
	$scope.getUsers();
}

/** добавление юзера */
function CreateController($scope, $location, Userlist, $rootScope) {
	/** объект нового юзера */
	$scope.user = {
	   login: "",
	   name: "",
	   email: "",
	   password: "",
	   repassword: ""
	};

   /** строка ошибок */
   $scope.errors = "";
    
   /** открывание окна */
   $scope.open = function () {
      $scope.shouldBeOpen = true;
   };
    
   /** закрывание окна */
   $scope.close = function () {
      $scope.shouldBeOpen = false;
   };

   /** ловим событие мордала */
   $scope.$on('openCreateModal', function() {
      $scope.shouldBeOpen = true;
   });

   /** создаем юзера */
   $scope.onCreate = function ($event) {
		Userlist.create(
		   {user: JSON.stringify({
		      "login": $scope.user.login,
		      "name": $scope.user.name,
		      "email": $scope.user.email,
		      "password": $scope.user.password,
		      "confirmed": 1
		   })}
		   ,function(data) {
		      if(!data.success) {
	            angular.forEach(data.errors, function(value, key) {
	               $scope.errors += value;
	            });
		      } else {
	            $scope.shouldBeOpen = false;
	            $rootScope.$broadcast('created');
		      }
		   }
		);
   };
};

/** профиль юзера */
function UserprofileController($scope, Userlist, $routeParams, $timeout) {
	/** имя юзера */
	$scope.getUser = function(){
		Userlist.getOne({id:$routeParams.id}, {}, function(data) {
			$scope.user = data;
		})
	};
	$scope.getUser();

	$scope.$on('CriteriaUpdateDraw', function(event, message) {      
		$scope.curvapos(message.criteria);
   });

	/** определение выбранного гоалса */
	$scope.onGoal = function (goals, needslist) {
		$scope.goals = goals;
		angular.forEach(needslist, function(nds) {
			angular.forEach(nds.goals, function(gls) {
				gls.addClass = "";
				var fildcrits = gls.criteria.filter(function(criteria) {
					if (criteria.curval) {
						return criteria;
					}
				});
				angular.forEach(fildcrits, function(ficuva) {
					$timeout(function() {
						$scope.curvapos(ficuva);
					}, 0);
				})
			})
		})
		$scope.goals.addClass = "current";
   };

	/** красим колбасы */
	$scope.curvapos = function(filcrit) {
		var valpos = $('div[crit="'+filcrit.sguid+'"]');
		var colorpos = $(valpos).find("strong");
		var summ = true;
		$(colorpos).width(0);
		angular.forEach(valpos.find("i"), function(kolcol) {
			if (summ == true) {
				$(colorpos).width($(colorpos).width() + $(kolcol).width());
				$(kolcol).addClass("curwhi");
			}
			else {
				$(kolcol).removeClass("curwhi");
			}
			if ($(kolcol).attr("curva") == filcrit.curval) {
				summ = false;
			}
		})
	}
}

/** аккордион нидсов + колбасы */
function NeedsController($scope, Needslist, $routeParams, Userlist, $rootScope, UserCriteria_value) {
	$rootScope.$broadcast('preloadshow');
	/** аккордион */
   $scope.oneAtATime = true;
	$scope.getNeeds = function(){
		Needslist.query({}, {}, function(data) {
			$scope.needslist = data;
			$rootScope.$broadcast('preloadhide');
			/** считаем колбасы */
			Userlist.getCritVal({user_guid:$routeParams.id}, {}, function(vals) {
				angular.forEach($scope.needslist, function(nds) {
					angular.forEach(nds.goals, function(gls) {
						$scope.addEmptyElement(gls);
						angular.forEach(vals, function(val) {
                     if(val && val.criteria) {
                        var filcrit = gls.criteria.filter(function(criteria) {
	                        if (criteria.sguid == val.criteria.sguid) {
	                           return criteria;
	                        }
	                     })[0];
	                     if (filcrit) {
	                        filcrit.curval = val.criterion_value.sguid;
	                        $scope.curvapos(filcrit);
	                     }    
                     }
						})
					})
				})
			})
		})
	}
	$scope.getNeeds();
   /** пересчет колбас */
  	$scope.onCriteriaSelect = function(criteria_value, criteria, $event) {
  		if(criteria.curval != criteria_value.sguid) {
			if(criteria_value.sguid !== "none") {
			   UserCriteria_value.create({}, $.param({
		         "user_guid": $scope.user.sguid,
		         "criteria_guid": criteria.sguid,
		         "criteria_value_guid": criteria_value.sguid
			   }), function(data) {
		         criteria.curval = data.message.sguid;
		         $rootScope.$broadcast('userCriteriaUpdate');
			   });
			} else {
			   if(criteria.curval) {
			      UserCriteria_value.del({id: criteria.curval}, {}, function(data) {
		            $rootScope.$broadcast('userCriteriaUpdate');
			      }); 
			   } else {
		        $rootScope.$broadcast('userCriteriaUpdate');
			   }
			}
			criteria.curval = criteria_value.sguid;
			$rootScope.$broadcast('CriteriaUpdateDraw', {criteria: criteria});
		}
  	}
  	$scope.addEmptyElement = function(gls) {
      angular.forEach(gls.criteria, function(criteriaItem, criteriaKey) {
      	console.log(criteriaItem);
         if(criteriaItem.criterion_values) {
            criteriaItem.criterion_values.splice(0, 0, {
               name: "none",
               position: 0,
               sguid: "none",
               value: 0,
            }); 
         }
      });
   }
}

/** страница провайдеров */
function ProvidersController($scope) {
    
}

/** страница целей */
function GoalslibController($scope) {

}

/** страница резактора nsi */
function NsieditController($scope) {
    
}

/** страница дерева */
function MindmapsController($scope) {

}

/** страница графиков */
function ChartsController($scope) {
    
}

/** страница тьютеров */
function TutorsController($scope) {

}

/**  */
function RootController($scope) {

}