'use strict';

// Declare app level module which depends on views, and components
var WeEats = angular.module('WeEats', [
  'ngRoute',
  'WeEats.view1',
  'Deg.SlackApi',
  'WeEats.controllers',
  'WeEats.services',
  'firebase',// loads $firebaseObject
  'ngMaterial', 
  'ngMessages',
  'ui.bootstrap', 
  'ui.bootstrap.datetimepicker'

]).
config(['$routeProvider', function($routeProvider) {

	$routeProvider
		.when('/slackSuccess', {
    	controller: 'SlackAuthController',
    	templateUrl:'views/home/home.html'
		}).
		when('/view1',{
			templateUrl:'views/view1/view1.html',
			controller: 'View1Ctrl'
		}).when('/auth', {
			templateUrl:"views/auth/auth.html",
			controller: 'AuthCtrl'
		}).
		when('/home', {
			templateUrl: "views/home/home.html",
			controller: 'HomeCtrl'
		}).
		when('/admin', {
			templateUrl:"views/auth/adminAuth.html",
			controller: "AdminAuthCtrl"
		})

  //$routeProvider.otherwise({redirectTo: '/view1'});
}])
.constant('FIREBASE_ROOT', 'https://blazing-torch-1384.firebaseio.com/');


angular.module('WeEats.controllers', [])
angular.module('WeEats.services', [])
