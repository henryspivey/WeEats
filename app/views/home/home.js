"use strict";


angular.module("WeEats.controllers").controller("HomeCtrl",
	['$scope','FIREBASE_ROOT','$firebaseObject', 'AuthService',
	function($scope, FIREBASE_ROOT, $firebaseObject, AuthService){

	var firebaseUsersRef = new Firebase(FIREBASE_ROOT);

	var authData = firebaseUsersRef.getAuth();
	var userRef= new Firebase(FIREBASE_ROOT+'/'+authData.uid);
	$scope.user = $firebaseObject(userRef); // make the user information available to the scope
	console.log($scope.user);

	$scope.logout = function() {
		AuthService.logout();
	}


	


}]);