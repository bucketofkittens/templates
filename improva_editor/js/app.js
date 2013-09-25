'use strict';

/**
 * Основной модуль приложения
 * @type {[type]}
 */
var editorModule = angular.module('editorModule', [ "ngRoute", "ngCookies", "ngResource", "ngAnimate", 'route-segment', 'view-segment']);

/**
 * Роутинг приложения
 * @param  {[type]} $routeProvider [description]
 * @return {[type]}                [description]
 */
editorModule.config(function($routeSegmentProvider, $routeProvider) {
	$routeSegmentProvider.options.autoLoadTemplates = true;

	$routeSegmentProvider
    
        .when('/users', 'users')
        .when('/users/:id',          'userInfo')
        .when('/',      'main')
        
        .segment('main', {
            templateUrl: 'views/main.html',
            controller: MainController})

        .segment('users', {
            templateUrl: 'views/users.html',
            controller: UsersController})

        .segment('userInfo', {
            templateUrl: 'views/userInfo.html',
            controller: UserInfoController});

	$routeProvider.otherwise({ redirectTo: '/' });
});

editorModule.run(function() {})
