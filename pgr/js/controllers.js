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

function ProfileController($scope, $route, $routeParams, User, Needs, Professions, States) {
	$scope.userId = $routeParams.userId;
	$scope.user = null;
	$scope.needs = Needs.query();
	$scope.professions = Professions.query();
	$scope.states = States.query();

	if($routeParams.userId) {
		$scope.user = User.query({id: $routeParams.userId});
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
		User.updateUser({"id": $scope.user.sguid},  $.param({user: {
				"login": $scope.user.login,
				"name": $scope.user.name,
				"email": $scope.user.email
			}})
		);
	}
}

function CriteriaController($scope, Goals, Criterion) {
	$scope.criterion_values = {};
	$scope.open = function (goalId) {
		var self = this;

		$scope.shouldBeOpen = true;
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
		});
		
	};

	$scope.close = function () {
		$scope.shouldBeOpen = false;
	};

	$scope.opts = {
		backdropFade: true,
		dialogFade:true
	};
}