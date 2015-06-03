'use strict';

// Declare angular app top level

angular.module('lobbycitoyen',  [
  'ngLocale', 
  'ngResource',
  'ngRoute', 
  'ngSanitize',
  'ui.bootstrap', 
  'lobbycitoyen.vendorService',
  'lobbycitoyen.user_controller',
  'lobbycitoyen.document_controller', 
  'lobbycitoyen.voteRest',
  'lobbycitoyen.UserService',
  'lobbycitoyen.Socket',
  'n3-pie-chart'
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
      when('/vote/:docid/:widget?/:widgettype?', {
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
