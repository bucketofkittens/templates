'use strict';

/** Основной модуль приложения */
var editorModule = angular.module('editorModule', [ "ngRoute", "ngCookies", "ngResource", "ngAnimate", 'route-segment', 'view-segment', 'ngGrid', 'ui.bootstrap']);

/** Роутинг приложения */
editorModule.config(function($routeSegmentProvider, $routeProvider) {
	$routeSegmentProvider.options.autoLoadTemplates = true;

	$routeSegmentProvider
    
        .when('/', 'main')
        .when('/users', 'users')
        .when('/userprofile/:id', 'userprofile')
        
        .segment('main', {
            templateUrl: 'views/home.html',
            controller: MainController})

        .segment('users', {
            templateUrl: 'views/users.html',
            controller: UsersController})

        .segment('userprofile', {
            templateUrl: 'views/userprofile.html',
            controller: UserprofileController,
            dependencies: ['id']})

        .segment('providers', {
            templateUrl: 'views/providers.html',
            controller: ProvidersController})

        .segment('goalslib', {
            templateUrl: 'views/goalslib.html',
            controller: GoalslibController})

        .segment('nsiedit', {
            templateUrl: 'views/nsiedit.html',
            controller: NsieditController})

        .segment('mindmaps', {
            templateUrl: 'views/mindmaps.html',
            controller: MindmapsController})

        .segment('charts', {
            templateUrl: 'views/charts.html',
            controller: ChartsController})

        .segment('tutors', {
            templateUrl: 'views/tutors.html',
            controller: TutorsController});

	$routeProvider.otherwise({ redirectTo: '/' });
});

editorModule.run(function() {})
