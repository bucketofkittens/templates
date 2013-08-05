'use strict';

function navCtrl($scope) {
	$scope.items = {
		{name: 'ABOUT', link: '#', active: false},
		{name: 'LEAGUES', link: '#', active: false},
		{name: 'PROFILE', link: '#/profile', active: false}
	};
	$scope.$on("$routeChangeStart", function () {
		console.log("leaving DemoCtrl");
	});
}

function ProfileController($scope) {

}
