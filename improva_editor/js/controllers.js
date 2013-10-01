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

function MainController($scope) {

}

function UsersController($scope, Userlist) {
	$scope.pagingOptions = {
		pageSizes: [20, 50, 100],
		pageSize: 20,
		currentPage: 1
   };
   $scope.setPagingData = function(data, page, pageSize){	
		var pagedData = data.slice((page - 1) * pageSize, page * pageSize);
		$scope.userlist = pagedData;
		if (!$scope.$$phase) {
		   $scope.$apply();
		}
   };
	$scope.$watch('pagingOptions', function (newVal, oldVal) {
	   if (newVal !== oldVal && newVal.currentPage !== oldVal.currentPage) {
	   	$scope.setPagingData($scope.userlistall, $scope.pagingOptions.currentPage, $scope.pagingOptions.pageSize);
	   }
	}, true);

	$scope.$on('ngGridEventEndCellEdit', function(evt){
		var user = evt.targetScope.row.entity;
		Userlist.updateUser({"id": user.sguid},  {user: JSON.stringify({
			"login": user.login,
			"name": user.name,
			"email": user.email
		})});
	});

   
	$scope.usertable = {
		data: 'userlist', 
		columnDefs: [
			{field:'login', displayName:'Login'}, 
			{field:'name', displayName:'Name'}, 
			{field:'email', displayName:'E-mail'}, 
			{field:'', displayName:'Delete'}
		],
		enablePaging: true,
		showFooter: true,
		pagingOptions: $scope.pagingOptions,
		totalServerItems: 'totalServerItems',
		enableCellSelection: true,
		enableRowSelection: false,
		enableCellEditOnFocus: true,
	};
	Userlist.query({}, {}, function(data) {
		$scope.userlistall = data;
		$scope.totalServerItems = data.length;
		$scope.setPagingData($scope.userlistall, $scope.pagingOptions.currentPage, $scope.pagingOptions.pageSize);
	});
}

function ProvidersController($scope) {
    
}

function GoalslibController($scope) {

}

function NsieditController($scope) {
    
}

function MindmapsController($scope) {

}

function ChartsController($scope) {
    
}

function TutorsController($scope) {

}

function RootController($scope) {

}