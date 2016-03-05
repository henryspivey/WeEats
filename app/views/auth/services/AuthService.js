"use strict";

angular.module("WeEats.services").service("AuthService", 
	['$routeParams','$http', 'FIREBASE_ROOT', '$q',
	function ($routeParams, $http, FIREBASE_ROOT, $q){

	var firebaseUsersRef = new Firebase(FIREBASE_ROOT);

	var authData = firebaseUsersRef.getAuth(); // retrieves the current user, use authData.uid for storing the slack information

 	var userRef = new Firebase(FIREBASE_ROOT+'/'+authData.uid);

	function makeAdmin(adminStatus) {
		userRef.update({"isAdmin":adminStatus});
	}
	function logout() {
		firebaseUsersRef.unauth();
		$location.path("#/home");
		if(!$scope.$$phase) $scope.$apply();
	}

	return {
		makeAdmin:makeAdmin,
		logout: logout
	}
	
}]);