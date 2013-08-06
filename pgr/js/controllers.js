'use strict';

function navCtrl($scope) {
	$scope.navs = [
		{name: 'ABOUT', link: '#', active: ''},
		{name: 'LEAGUES', link: '#', active: ''},
		{name: 'PROFILE', link: '#/profile', active: ''}
	];
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

function ProfileController($scope) {

}
