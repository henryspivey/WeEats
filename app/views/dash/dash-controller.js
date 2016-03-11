"use strict";

angular.module("WeEats.controllers").controller("DashCtrl", 
	['FIREBASE_ROOT', '$firebaseObject', '$scope', '$interval', "SlackAuthService",
	function (FIREBASE_ROOT, $firebaseObject, $scope, $interval, SlackAuthService){

		var firebaseUsersRef = new Firebase(FIREBASE_ROOT);

		var authData = firebaseUsersRef.getAuth();
		var userRef= new Firebase(FIREBASE_ROOT+'/users/'+authData.uid);
		$scope.user = $firebaseObject(userRef);

		$scope.restaurantName, $scope.restaurantURL, $scope.menuURL, $scope.restaurantPhone = "";
		var promise;

		function init() {
			SlackAuthService.access();
		};
		init();


		$scope.dateTimeNow = function() {
	    $scope.orderTime = new Date();
	  };
	  $scope.dateTimeNow();
	  
	  $scope.toggleMinDate = function() {
	    var minDate = new Date();
	    // set to yesterday
	    minDate.setDate(minDate.getDate() - 1);
	    $scope.minDate = $scope.minDate ? null : minDate;
	  };
	   
	  $scope.toggleMinDate();

	  $scope.dateOptions = {
	    showWeeks: false
	  };
	  
	  // Disable weekend selection
	  $scope.disabled = function(calendarDate, mode) {
	    return mode === 'day' && ( calendarDate.getDay() === 0 || calendarDate.getDay() === 6 );
	  };
	  
	  $scope.open = function($event,opened) {
	    $event.preventDefault();
	    $event.stopPropagation();
	    $scope.dateOpened = true;
	    console.log('opened');
	  };
	  
	  $scope.dateOpened = false;
	  $scope.hourStep = 1;
	  $scope.format = "dd-MMM-yyyy";
	  $scope.minuteStep = 15;

	  $scope.timeOptions = {
	    hourStep: [1, 2, 3],
	    minuteStep: [1, 5, 10, 15, 25, 30]
	  };

	  $scope.showMeridian = true;
	  $scope.timeToggleMode = function() {
	    $scope.showMeridian = !$scope.showMeridian;
	  };
	  
	  $scope.$watch("date", function(date) {
	    // read date value
	  }, true);
	  
	  $scope.resetHours = function() {
	    $scope.date.setHours(1);
	  };
		
		function remind() {
			// will check if user has not submitted order after the restaurant for the day has been submitted
			console.log("reminder");
			if ($scope.user.age) { // if that data exists, then cancel the $interval
				$interval.cancel(promise);
			};
			
		}

		$scope.save = function() {

			//promise = $interval(remind, 5000); will need for checking user's orderStatus
			var sanitizedDate = new Date($scope.orderTime);
			var timeForOrder = sanitizedDate.toTimeString();
			
			var restaurantData  = new Firebase(FIREBASE_ROOT+'/restaurant');
			restaurantData.update({"restaurantName":$scope.restaurantName, "menuURL":$scope.menuURL, "restaurantPhone":$scope.restaurantPhone,
			 "restaurantURL":$scope.restaurantURL, "orderTime":timeForOrder});
		}

}]);