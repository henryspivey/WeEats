"use strict";

angular.module("WeEats.controllers").controller("DashCtrl", 
	['FIREBASE_ROOT', '$firebaseObject', '$scope',
	function (FIREBASE_ROOT, $firebaseObject, $scope){

		var firebaseUsersRef = new Firebase(FIREBASE_ROOT);

		var authData = firebaseUsersRef.getAuth();
		var userRef= new Firebase(FIREBASE_ROOT+'/'+authData.uid);
		$scope.user = $firebaseObject(userRef);

}]);