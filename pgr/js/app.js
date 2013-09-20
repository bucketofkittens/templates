'use strict';

var clientId = {"localhost": '339940198985.apps.googleusercontent.com', "xmpp.dev.improva.com": "339940198985-h79e4hvjp9b2658og8o849u3blaootub.apps.googleusercontent.com"};
var apiKey = 'AIzaSyBUJ3rialFIcJ5QvuWFkvPqmFbTBIZ2Kmo';
var scopes = ['https://www.googleapis.com/auth/plus.me','https://www.googleapis.com/auth/userinfo.email'];
var faceBookIds = {"localhost": '173391222849160', "xmpp.dev.improva.com": '173391222849160'};

/**
 * Основной модуль приложения
 * @type {[type]}
 */
var pgrModule = angular.module('pgrModule', [ "ngRoute", "ngCookies", "ngResource", "ngAnimate", "localization", "ui", "ui.keypress", 'ui.bootstrap', 'route-segment', 'view-segment', 'lvl.directives.dragdrop', 'ngTouch', 'ngFacebook']);

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
	$facebookProvider.setAppId(faceBookIds[window.location.hostname]);
});

pgrModule.run(function() {
	(function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "//connect.facebook.net/en_US/all.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));

   // Asynchronously load the G+ SDK.
    (function() {
      var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
      po.src = 'https://apis.google.com/js/client:plusone.js';
      var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
    })();
})


function onSignInCallback(authResult) {
    if (authResult['access_token']) {
      	gapi.client.load('oauth2', 'v2', function() {
		  gapi.client.oauth2.userinfo.get().execute(function(resp) {
		    var scope = angular.element($("body")).scope();
		    scope.gplusAuth(resp.email);
		  })
		});

    } else if (authResult['error']) {
      // User has not authorized the G+ App!
    }
}

function handleClientLoad() {
	gapi.client.setApiKey(apiKey);
	window.setTimeout(checkAuth,1);
}

function checkAuth() {
	gapi.auth.authorize({client_id: clientId[window.location.hostname], scope: scopes, immediate: true}, handleAuthResult);
}

function handleAuthResult(authResult) {
	var authorizeButton = document.getElementById('authorize-button');
	if (authResult && !authResult.error) {
	  makeApiCall();
	}
}

function handleAuthClick(event) {
	console.log(clientId[window.location.hostname]);
	gapi.auth.authorize({client_id: clientId[window.location.hostname], scope: scopes, immediate: false}, handleAuthResult);
	return false;
}

function makeApiCall() {

	gapi.client.load('oauth2', 'v2', function() {
	  gapi.client.oauth2.userinfo.get().execute(function(resp) {
	  	console.log(resp);
	    var scope = angular.element($("body")).scope();
	    scope.gplusAuth(resp.email);
	  })
	});
}