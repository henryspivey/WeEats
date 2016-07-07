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
  'ui.bootstrap.datetimepicker',
  'telephonefilter',
  'uiGmapgoogle-maps',
  'googleMapService',
  'search-box-example',
  'orderformdirective'

]).
config(['$routeProvider', 'uiGmapGoogleMapApiProvider', 
	function($routeProvider,uiGmapGoogleMapApiProvider) {

	$routeProvider
		.when('/',{
			templateUrl:'views/view1/view1.html',
			controller: 'View1Ctrl'
		})
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
		}).when('/manual', {
			templateUrl: "views/manual/manualentry.html",
			controller: "HomeCtrl"
		})


		uiGmapGoogleMapApiProvider.configure({
        key: 'AIzaSyCgORDE776Y_LIZGH_BPIaQA5VuU8EfUmA',
        v: '3.20', //defaults to latest 3.X anyhow
        libraries: 'places'
    });

  //$routeProvider.otherwise({redirectTo: '/view1'});
}])
.constant('FIREBASE_ROOT', 'https://blazing-torch-1384.firebaseio.com/');


angular.module('WeEats.controllers', [])
angular.module('WeEats.services', [])
