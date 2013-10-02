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
			{field:'login', displayName:'Login', cellTemplate:'<div class="ngCellText" ng-class="col.colIndex()"><a class="links" href="#/userprofile/{{row.getProperty(\'sguid\')}}" ng-cell-text>{{COL_FIELD}}</a></div>'}, 
			{field:'name', displayName:'Name', cellTemplate:'<div class="ngCellText" ng-class="col.colIndex()"><a class="links" href="#/userprofile/{{row.getProperty(\'sguid\')}}" ng-cell-text>{{COL_FIELD}}</a></div>'}, 
			{field:'email', displayName:'E-mail', cellTemplate:'<div class="ngCellText" ng-class="col.colIndex()"><a class="links" href="#/userprofile/{{row.getProperty(\'sguid\')}}" ng-cell-text>{{COL_FIELD}}</a></div>'}
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

	/** профиль юзера */
   
   
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
function UserprofileController($scope) {

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