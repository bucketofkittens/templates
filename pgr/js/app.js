'use strict';

var socialsAccess = {
	facebook: {
		applicationId: {
			"localhost": '205232122986999', 
			"xmpp.dev.improva.com": '173391222849160'
		},
		isLoggined: false
	},
	googlePlus: {
		applicationId: {
			"localhost": '339940198985.apps.googleusercontent.com', 
			"xmpp.dev.improva.com": "339940198985-h79e4hvjp9b2658og8o849u3blaootub.apps.googleusercontent.com"
		},
		apiKey: 'AIzaSyBUJ3rialFIcJ5QvuWFkvPqmFbTBIZ2Kmo',
		scopes: [
			'https://www.googleapis.com/auth/plus.me',
			'https://www.googleapis.com/auth/userinfo.email'
		],
		isLoggined: false
	}
};

/**
 * Основной модуль приложения
 * @type {[type]}
 */
var pgrModule = angular.module(
	'pgrModule', 
	[ 
		"ngRoute", 
		"ngCookies", 
		"ngResource", 
		"ngAnimate", 
		"localization", 
		'route-segment', 
		'view-segment', 
		'ngTouch', 
		'ngFacebook', 
		'$strap.directives',
		'iso.config',
        'iso.directives',
        'iso.services',
        'monospaced.mousewheel'
		]
	);

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
	$facebookProvider.setAppId(socialsAccess.facebook.applicationId[window.location.hostname]);
});



pgrModule.run(function() {
	localStorage.clear();

	(function(d, s, id){
	 var js, fjs = d.getElementsByTagName(s)[0];
	 if (d.getElementById(id)) {return;}
	 js = d.createElement(s); js.id = id;
	 js.src = "//connect.facebook.net/en_US/all.js";
	 fjs.parentNode.insertBefore(js, fjs);
	}(document, 'script', 'facebook-jssdk'));

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
    }
}

function handleClientLoad() {
	gapi.client.setApiKey(apiKey);
	window.setTimeout(checkAuth,1);
}

function checkAuth() {
	gapi.auth.authorize({
		client_id: socialsAccess.googlePlus.applicationId[window.location.hostname], 
		scope: socialsAccess.googlePlus.scopes, 
		immediate: true
	}, handleAuthResult);
}

function handleAuthResult(authResult) {
	if (authResult && !authResult.error) {
	  makeApiCall();
	} else {
		var scope = angular.element($("body")).scope();
	    scope.gplusFalse();
	}
}

function handleAuthClick(event) {
	gapi.auth.authorize({
		client_id: socialsAccess.googlePlus.applicationId[window.location.hostname], 
		scope: socialsAccess.googlePlus.scopes, 
		immediate: true
	}, handleAuthResult);
	return false;
}

function makeApiCall() {
	gapi.client.load('oauth2', 'v2', function() {
	  gapi.client.oauth2.userinfo.get().execute(function(resp) {
	    var scope = angular.element($("body")).scope();
        var request = gapi.client.plus.people.list({
            'userId' : 'me',
            'collection' : 'visible'
          });
        request.execute(function(resp) {
            var numItems = resp.items.length;
            console.log(numItems);
            for (var i = 0; i < numItems; i++) {
              console.log(resp.items[i].displayName);
            }
        });
          /*
        console.log(resp);
	    scope.gplusAuth(resp.email);
	    socialsAccess.googlePlus.isLoggined = true;
        */
	  })
	});
}

Array.prototype.shuffle = function(b) {
    var i = this.length, j, t;
    while(i) {
        j = Math.floor( ( i-- ) * Math.random() );
        t = b && typeof this[i].shuffle!=='undefined' ? this[i].shuffle() : this[i];
        this[i] = this[j];
        this[j] = t;
    }

    return this;
};

Array.prototype.remove = function(from, to) {
    var rest = this.slice((to || from) + 1 || this.length);
      this.length = from < 0 ? this.length + from : from;
      return this.push.apply(this, rest);
};