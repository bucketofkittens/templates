'use strict';

/**
 * Основной модуль приложения
 * @type {[type]}
 */
var pgrModule = angular.module('pgrModule', [ "ngRoute", "ngCookies", "ngResource", "ngAnimate", "localization", "ui", "ui.keypress", 'ui.bootstrap', 'route-segment', 'view-segment', 'lvl.directives.dragdrop', 'ngTouch', 'ngFacebook', 'directive.g+signin']);

/**
 * Роутинг приложения
 * @param  {[type]} $routeProvider [description]
 * @return {[type]}                [description]
 */
pgrModule.config(function($routeSegmentProvider, $routeProvider) {
	$routeSegmentProvider.options.autoLoadTemplates = true;

	$routeSegmentProvider
    
        .when('/profile',                'profile.authUser')
        .when('/profile/:userId1',       'profile.oneUser')
        .when('/profile/:userId1/:userId2',    'profile.manyUser')
        
        .when('/logout',          'logout')
        .when('/',      'main')
        
        .when('/graphs',          'graphs')
        .when('/leagues',          'leagues')
        
        .segment('profile', {
            templateUrl: 'views/profile.html',
            controller: ProfileController})
            
        .within()
        	.segment('authUser', {
                templateUrl: 'views/profile/one.html'})

            .segment('oneUser', {
                templateUrl: 'views/profile/one.html',
            	dependencies: ['userId1']})
                
            .segment('manyUser', {
                templateUrl: 'views/profile/many.html',
                dependencies: ['userId2', 'userId1']})
                
        .up()
        
        .segment('logout', {
            templateUrl: 'views/main.html',
            controller: LogoutController})

        .segment('main', {
            templateUrl: 'views/main.html',
            controller: MainController})

        .segment('graphs', {
            templateUrl: 'views/graphs.html',
            controller: GraphsController})

        .segment('leagues', {
            templateUrl: 'views/leagues.html',
            controller: LeaguesController});

	$routeProvider.otherwise({ redirectTo: '/' });
});
pgrModule.config(function($facebookProvider) {
	$facebookProvider.setPermissions("email");
	$facebookProvider.setAppId(205232122986999);
});

pgrModule.run(function() {
	(function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "//connect.facebook.net/en_US/all.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));	
})


function signinCallback(authResult) {
	console.log(authResult);
    if (authResult['access_token']) {
      gapi.client.load('oauth2', 'v2', function() {
		  gapi.client.oauth2.userinfo.get().execute(function(resp) {
		    // Shows user email
		    console.log(resp.email);
		  })
		});

    } else if (authResult['error']) {
      // User has not authorized the G+ App!
    }
}