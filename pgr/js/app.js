'use strict';

var pgrModule = angular.module('pgrModule', []);
pgrModule.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/profile', {templateUrl: 'views/profile.html', controller: ProfileController});
	$routeProvider.otherwise({redirectTo: '/'});
}])