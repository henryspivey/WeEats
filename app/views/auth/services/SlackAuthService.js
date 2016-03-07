"use strict";

angular.module("WeEats.services").factory("SlackAuthService", 
	['$routeParams','$http', 'slackSvc', 'FIREBASE_ROOT', '$location',
	function ($routeParams, $http, slackSvc, FIREBASE_ROOT, $location){

	var firebaseUsersRef = new Firebase(FIREBASE_ROOT);

	
	var config = {
		client_id: '23324292563.23327735669',
		client_secret: 'f75c945c04460239fdbdc9b5be119a83',
		authParams : {
			client_id: '23324292563.23327735669',
			scope: 'incoming-webhook',
			redirect_uri: 'http://localhost:8000/app/#/slackSuccess'
		}
	}

	function authorize() {
		slackSvc.authorize(config.client_id, config.authParams, function (response) {
			console.log(response);
		}).then(function(){
			access();
		})
	}
	
	function access() {

		var authData = firebaseUsersRef.getAuth(); // retrieves the current user, use authData.uid for storing the slack information
		console.log(authData);

		var userRef = new Firebase(FIREBASE_ROOT+'/'+authData.uid);
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
						$location.path("/home");
				}, function errorCallback(response){
					console.log("error ", response);
				});
				
				
			}
		});
		};

	}


	return {
		authorize:authorize,
		access:access
	}

}]);