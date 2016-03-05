"use strict";

angular.module("WeEats.controllers").controller("SlackAuthController", 
	['$routeParams','$http', 'slackSvc', 'FIREBASE_ROOT',
	function ($routeParams, $http, slackSvc, FIREBASE_ROOT){


	
	var firebaseUsersRef = new Firebase(FIREBASE_ROOT);

	var authData = firebaseUsersRef.getAuth(); // retrieves the current user, use authData.uid for storing the slack information
	console.log(authData);

	var userRef = new Firebase(FIREBASE_ROOT+'/'+authData.uid);
	var config = {
		"client_id": '23324292563.23327735669',
		"client_secret": 'f75c945c04460239fdbdc9b5be119a83',
		'code':''
	}

	if ($routeParams) {
		config.code = $routeParams.code;

		slackSvc.oauth.access(config.client_id, config.client_secret, config.code, function (response) {
			var webhookURL = response.incoming_webhook.url;
			
			/*
			Response object has the access token that needs to go to firebase xoxp-23324292563-23327128752-23576630839-7dd25653bc with key 'access_token'. 
			Saved test in postman. $http post to api.authtest to get user details with access_token.  
			Save the user details in Firebase, then redirect to home page where we can update the scope with the user details in a $firebaseObject
			*/
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



}]);