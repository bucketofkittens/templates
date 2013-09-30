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

function UsersController($scope) {

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