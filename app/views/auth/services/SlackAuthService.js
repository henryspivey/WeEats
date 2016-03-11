"use strict";

angular.module("WeEats.services").factory("SlackAuthService", 
	['$routeParams','$http', 'slackSvc', 'FIREBASE_ROOT', '$location',
	function ($routeParams, $http, slackSvc, FIREBASE_ROOT, $location){

	var firebaseUsersRef = new Firebase(FIREBASE_ROOT);

	var config = {
		client_id: '23324292563.23327735669',
		client_secret: 'f75c945c04460239fdbdc9b5be119a83'
	}
	
	function access() {

		var authData = firebaseUsersRef.getAuth(); // retrieves the current user, use authData.uid for storing the slack information
		console.log(authData);

		var userRef = new Firebase(FIREBASE_ROOT+'/users/'+authData.uid);
		if ($routeParams) {
			slackSvc.oauth.access(config.client_id, config.client_secret, $routeParams.code, function (response) {
				var webhookURL = response.incoming_webhook.url;

				if(response.ok){
					var access_token = response.access_token.toString();
					var urlForPost = 'https://slack.com/api/auth.test?token='+access_token.toString();
					$http({
						method:"POST",
						url: urlForPost
					}).then(function successCallback(response){
							console.log("Success ", response);
							userRef.update({"access_token":access_token, "webhookURL":webhookURL, username:response.data.user});
					}, function errorCallback(response){
						console.log("error ", response);
					});
				}
			});
		};

	}

	return {
		access:access
	}

}]);