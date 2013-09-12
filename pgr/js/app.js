'use strict';

/**
 * Основной модуль приложения
 * @type {[type]}
 */
var pgrModule = angular.module('pgrModule', [ "ngRoute", "ngCookies", "ngResource", "ngAnimate", "localization", "ui", "ui.keypress", 'ui.bootstrap', 'localStorage', 'ui.router']);

/**
 * Роутинг приложения
 * @param  {[type]} $routeProvider [description]
 * @return {[type]}                [description]
 */
pgrModule.config(function($stateProvider, $urlRouterProvider) {
	//$stateProvider.state('profile', {irl:'/profile', templateUrl: 'views/profile.html', controller: ProfileController});
	$stateProvider.state('profile', {url: '/profile/:userId', templateUrl: '/views/profile.html', controller: ProfileController});
	$stateProvider.state('logout', {url: '/logout', templateUrl: 'views/main.html', controller: LogoutController});
	$stateProvider.state('main', {url: '/', templateUrl: 'views/main.html', controller: MainController});
	$stateProvider.state('graphs', {url: '/graphs', templateUrl: 'views/graphs.html', controller: GraphsController});
	$stateProvider.state('compare', {url: '/compare/:id', templateUrl: 'views/compare.html', controller: CompareController});
	$stateProvider.state('leagues', {url: '/leagues', templateUrl: 'views/leagues.html', controller: LeaguesController});
	//$routeProvider.otherwise({redirectTo: '/'});

	$urlRouterProvider.otherwise("/main") ;
});