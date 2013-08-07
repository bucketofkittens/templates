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

function ProfileController($scope, $route, $routeParams, User, Needs, Professions) {
	$scope.userId = $routeParams.userId;
	$scope.user = null;

	if($routeParams.userId) {
		$scope.user = User.query({id: $routeParams.userId});
		$scope.needs = Needs.query();
		$scope.professions = Professions.query();
	}

	$scope.onEditActivate = function($event, elementId) {
		var elm = angular.element("#"+elementId)[0];
		if(elm.getAttribute("disabled")) {
			elm.removeAttribute("disabled");
		} else {
			elm.setAttribute("disabled", "disabled");
		}
	}

	$scope.onEditSave = function($event) {
		User.updateUser({"id": $scope.user.sguid}, {user: {
			"login": $scope.user.login,
			"name": $scope.user.name
		}});
	}
}
