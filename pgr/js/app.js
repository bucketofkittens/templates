'use strict';

/**
 * Основной модуль приложения
 * @type {[type]}
 */
var pgrModule = angular.module('pgrModule', [ "ngResource" ]);

/**
 * Роутинг приложения
 * @param  {[type]} $routeProvider [description]
 * @return {[type]}                [description]
 */
pgrModule.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/profile', {templateUrl: 'views/profile.html', controller: ProfileController});
	$routeProvider.when('/profile/:userId', {templateUrl: 'views/profile.html', controller: ProfileController});
	$routeProvider.when('/', {templateUrl: 'views/main.html', controller: ProfileController});
	$routeProvider.otherwise({redirectTo: '/'});
}])