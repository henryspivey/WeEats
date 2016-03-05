"use strict";

/*
	This script will handle the user authentication and login
*/
angular.module("WeEats.controllers").controller("AuthCtrl", 
	['FIREBASE_ROOT', '$scope', '$location', 'SlackAuthService',
	function (FIREBASE_ROOT, $scope, $location, SlackAuthService){

		var userRef = new Firebase(FIREBASE_ROOT);

		$scope.user = {
			email: '',
			password: ''
		};

		$scope.auth = function() {
			userRef.createUser({
			  email    : $scope.user.email,
			  password : $scope.user.password
			}, function(error, userData) {
			  if (error) {
			    console.log("Error creating user:", error);
			  } else {
			    console.log("Successfully created user account with uid:", userData.uid);
			    $scope.login($scope.user.email, $scope.user.password);
			  }
			});
		}

		$scope.login = function(email, password) {
			userRef.authWithPassword({
			  email    : $scope.user.email,
			 	password : $scope.user.password
			}, function(error, authData) {
			  if (error) {
			    console.log("Login Failed!", error);
			  } else {
			    console.log("Authenticated successfully with payload:", authData);
			    SlackAuthService.authorize();
			    $location.path('/home'); // redirect to home after user is created and signed in and slack has been added
			    if(!$scope.$$phase) $scope.$apply();
			  }
			});
		}
		



}]);