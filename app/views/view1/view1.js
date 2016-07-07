'use strict';

angular.module('WeEats.view1', ['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/view1', {
    templateUrl: 'view1/view1.html',
    controller: 'View1Ctrl'
  });
}])

.controller('View1Ctrl', 
	['slackSvc','$scope','$q','FIREBASE_ROOT', '$firebaseObject', '$location',
	function(slackSvc, $scope, $q, FIREBASE_ROOT, $firebaseObject, $location) {

	var userRef = new Firebase(FIREBASE_ROOT);
	var authData = userRef.getAuth();
	console.log(authData);


	$scope.slackAuth = function() {

		var config = {
			client_id: '23324292563.23327735669',
			client_secret: 'f75c945c04460239fdbdc9b5be119a83',
			authParams : {
				client_id: '23324292563.23327735669',
				scope: 'incoming-webhook',
				redirect_uri: 'https://weeats-d7579.firebaseapp.com/#/home/'
			}
		}
		slackSvc.authorize(config.client_id, config.authParams, function (response) {

			console.log(response)
		});
	}
		
}]);