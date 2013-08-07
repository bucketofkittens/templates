'use strict';

function navCtrl($scope) {
	/**
	 * @TODO Потом нужно будет переменовать activate в className например.
	 */
	$scope.navs = [
		{name: 'ABOUT', link: '#', active: ''},
		{name: 'LEAGUES', link: '#', active: ''},
		{name: 'PROFILE', link: '#/profile', active: ''}
	];

	/**
	 * @TODO Нужно будет потом оптимизировать
	 */
	$scope.onNavClick = function($event, name) {
		angular.forEach($scope.navs, function(value, key) {
			if($scope.navs[key].name == name) {
				$scope.navs[key].active = 'current';
			} else {
				$scope.navs[key].active = '';
			}
		})
	}
}

function ProfileController($scope, $route, $routeParams, User) {
	$scope.userId = $routeParams.userId;
	$scope.user = null;

	if($routeParams.userId) {
		$scope.user = User.query({userId: $routeParams.userId});
		console.log($scope.user);
	}
}
