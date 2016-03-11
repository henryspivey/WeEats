"use strict";


angular.module("WeEats.controllers").controller("HomeCtrl",
	['$scope','FIREBASE_ROOT','$firebaseObject', 'AuthService', 'slackSvc', '$routeParams', '$http', "SlackAuthService",
	function($scope, FIREBASE_ROOT, $firebaseObject, AuthService, slackSvc, $routeParams, $http, SlackAuthService){

	var firebaseUsersRef = new Firebase(FIREBASE_ROOT);

	var authData = firebaseUsersRef.getAuth();
	var userRef= new Firebase(FIREBASE_ROOT+'/users/'+authData.uid);
	$scope.user = $firebaseObject(userRef); // make the user information available to the scope

	// $scope.user.$loaded(function(data){
	// 	$scope.isAdmin = data.isAdmin;
	// 	console.log($scope.isAdmin);
	// });
	

	// TOOD make a firebase object of the restaurant reference in firebase
	$scope.restaurantData = {
		name: "",
		phone: "",
		website:"",
		orderTime:""
	}

	var restaurantRef = new Firebase(FIREBASE_ROOT + '/restaurant');
	$scope.restaurantObj = $firebaseObject(restaurantRef);
	if($scope.restaurantObj != 'undefined') {
		$scope.restaurantObj.$loaded(function(restaurantData) {
			$scope.restaurantData.name = restaurantData.restaurantName;
			$scope.restaurantData.phone = restaurantData.restaurantPhone;
			$scope.restaurantData.website = restaurantData.restaurantURL;
			$scope.restaurantData.orderTime = restaurantData.orderTime;
		});
	}


	var config = {
		client_id: '23324292563.23327735669',
		client_secret: 'f75c945c04460239fdbdc9b5be119a83',
		authParams : {
			client_id: '23324292563.23327735669',
			scope: 'incoming-webhook',
			redirect_uri: 'http://localhost:8000/app/#/home'
		}
	}
	$scope.order = "";

	$scope.logout = function() {
		AuthService.logout();
	}

	$scope.submitOrder = function() {
		//TODO 
		/* 
			gather date and time for key (this will be needed for record keeping)
			store data as value to key
		*/
	}

	function init() {
		SlackAuthService.access()
	}
	init();



	// for admin 
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
			/*
				TODO:
				set up restaurant obj in Firebase with data from form. Collect the restaurantName, menuURL, restaurantPhone
				restaurantURL, and orderTime
				use these date to populate the home.html page with necessary variables.
			*/
			promise = $interval(remind, 5000);
			var sanitizedDate = new Date($scope.orderTime);
			var timeForOrder = sanitizedDate.toTimeString();
			
			var restaurantData  = new Firebase(FIREBASE_ROOT+'/restaurant');
			restaurantData.update({"restaurantName":$scope.restaurantName, "menuURL":$scope.menuURL, "restaurantPhone":$scope.restaurantPhone,
			 "restaurantURL":$scope.restaurantURL, "orderTime":timeForOrder});

		}

		// end admin functions 




}]);