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

	// check if access_token already exists in user obj.  
	// if it does then send them to home since Slack has already been added
	if (authData) {
		userRef = new Firebase(FIREBASE_ROOT+'/'+authData.uid);
		var userObj = $firebaseObject(userRef);
		userObj.$loaded(function(data){
			if(data.access_token) {
				$location.path("/home");
				if(!$scope.$$phase) $scope.$apply();
			}
		})
	};

	$scope.slackAuth = function() {

		var config = {
			client_id: '23324292563.23327735669',
			client_secret: 'f75c945c04460239fdbdc9b5be119a83',
			authParams : {
				client_id: '23324292563.23327735669',
				scope: 'incoming-webhook',
				redirect_uri: 'http://localhost:8000/app/#/home'
			}
		}

		slackSvc.authorize(config.client_id, config.authParams, function (response) {
			console.log(response)
		});


	}
		
}]);