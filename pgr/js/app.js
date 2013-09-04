'use strict';

/**
 * Основной модуль приложения
 * @type {[type]}
 */
var pgrModule = angular.module('pgrModule', [ "ngRoute", "ngCookies", "ngResource", "ngAnimate", "localization", "ui", "ui.keypress", 'ui.bootstrap' ]);

/**
 * Роутинг приложения
 * @param  {[type]} $routeProvider [description]
 * @return {[type]}                [description]
 */
pgrModule.config(['$routeProvider', function($routeProvider) {
	$routeProvider.when('/profile', {templateUrl: 'views/profile.html', controller: ProfileController});
	$routeProvider.when('/profile/:userId', {templateUrl: 'views/profile.html', controller: ProfileController});
	$routeProvider.when('/logout', {templateUrl: 'views/main.html', controller: LogoutController});
	$routeProvider.when('/', {templateUrl: 'views/main.html', controller: MainController});
	$routeProvider.when('/graphs', {templateUrl: 'views/graphs.html', controller: GraphsController});
	$routeProvider.when('/compare/:id', {templateUrl: 'views/compare.html', controller: CompareController});
	$routeProvider.otherwise({redirectTo: '/'});
}]);