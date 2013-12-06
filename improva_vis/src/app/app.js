var App = angular.module('improva', ['ngRoute', 'ngSanitize', 'ngResource', 'ngSanitize', 'ngAnimate', 'route-segment', 'view-segment', 'angular-flexslider', 'ui.bootstrap.tooltip', 'ui.bootstrap.popover', 'ui.bootstrap.position']);

App.config(function ($routeSegmentProvider) {

  $routeSegmentProvider.options.autoLoadTemplates = true;

  $routeSegmentProvider.
      when('/', 'welcome').
      when('/main', 'main').
      when('/terms', 'terms').
      when('/about', 'about').

      segment('welcome', {
        templateUrl: 'src/app/main/templates/welcome.html',
        controller: WelcomeController}).
      segment('main', {
        templateUrl: 'src/app/main/templates/main.html',
        controller: MainController}).
      segment('about', {
        templateUrl: 'src/app/main/templates/about.html',
        controller: AboutController}).
      segment('terms', {
        templateUrl: 'src/app/main/templates/terms.html',
        controller: TermsController});

});