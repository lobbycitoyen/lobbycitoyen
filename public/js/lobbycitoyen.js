'use strict';

// Declare app level module which depends on filters, and services


angular.module('lobbycitoyen',  [
  'ui.bootstrap',
  'lobbycitoyen.document_controller', 'lobbycitoyen.voteRest', 'lobbycitoyen.vendorService',
  'ngLocale', 'ngResource', 'ngRoute', 'ngSanitize',
  'lobbycitoyen.user_controller', 'lobbycitoyen.UserRest',  'lobbycitoyen.UserService'
  ]).
  config(['$localeProvider','$routeProvider', '$locationProvider','$sceDelegateProvider', '$sceProvider', function($localeProvider,$routeProvider, $locationProvider, $sceDelegateProvider,$sceProvider ) {
    $routeProvider.
 	   when('/', {
        templateUrl: '/../partials/vote/list',
        controller: HomeCtrl
      }).
      when('/login', {
         templateUrl: '/partials/user/login',
        controller: UserCtrl
      }).
       when('/signup', {
        templateUrl: '/partials/user/signup',
        controller: UserCtrl
      }).
      when('/me/account', {
        templateUrl: '/partials/user/account',
        controller: UserProfileCtrl
      }).
      when('/doc/create', {
        templateUrl: '/partials/document/new',
        controller: VoteCtrl
      }).
      when('/vote/:docid', {
        // match doc, doc_editor
        templateUrl: '/../partials/vote/single',
        controller: VoteCtrl
      }).
      when('#_=_', {
        redirectTo: '/'
      }).
      otherwise({
        redirectTo: '/'
      });
      $locationProvider.html5Mode(true);
      $locationProvider.hashPrefix('!');
     // $sceDelegateProvider.resourceUrlWhitelist(['self', new RegExp('^(http[s]?):\/\/(w{3}.)?soundcloud\.com/.+$')]);

      //console.log($localeProvider)
      $sceProvider.enabled(false);
   //  $sceDelegateProvider.resourceUrlWhitelist(['*']);
    }
  ])
  // .config( ['$controllerProvider', function($controllerProvider) { $controllerProvider.allowGlobals(); }]);



// instead of empty file include, but files exist #v+
// if/not included switcher
