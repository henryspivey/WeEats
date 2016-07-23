"use strict";


angular.module("WeEats.controllers").controller("HomeCtrl",
	['$scope','FIREBASE_ROOT','$firebaseObject', 'AuthService', 'slackSvc', 
	'$routeParams', '$http', 'SlackAuthService', '$firebaseArray', '$timeout', 'googleMapService', '$sce',
	function($scope, FIREBASE_ROOT, $firebaseObject, AuthService, 
		slackSvc, $routeParams, $http, SlackAuthService, $firebaseArray, $timeout, googleMapService, $sce){

	var firebaseUsersRef = new Firebase(FIREBASE_ROOT);

	var promise;
	$scope.map = { center: {latitude: 37.3385803, longitude: -121.8899279}, zoom: 15 };

	var authData = firebaseUsersRef.getAuth();
	var userRef= new Firebase(FIREBASE_ROOT+'/users/'+authData.uid);
	$scope.user = $firebaseObject(userRef); // make the user information available to the scope

	var allUsers = new Firebase(FIREBASE_ROOT+'/users/');


	// for submitting tracking orders
	var datekey = new Date().toDateString();
	var orderRef= new Firebase(FIREBASE_ROOT+"/orders/"+datekey);
	orderRef.on("child_added",function(){
		$scope.orders = loadOrders(orderRef);	
	})

	var allUsersObj = $firebaseArray(allUsers); // makes an asynchronous array holding all of the users
	$scope.allUsers = allUsersObj;

	$scope.restaurantName, $scope.restaurantURL, $scope.menuURL, $scope.restaurantPhone = "";

	// needed for displaying today's order 
	$scope.currentDate = new Date().toDateString();

	// TOOD make a firebase object of the restaurant reference in firebase
	$scope.restaurantData = {
		name: "",
		phone: "",
		restaurantURL:"",
		menuURL: "",
		orderTime:""
	}

	var restaurantRef = new Firebase(FIREBASE_ROOT + '/restaurant');
	$scope.restaurantObj = $firebaseObject(restaurantRef);
	if($scope.restaurantObj != 'undefined') {
		$scope.restaurantObj.$loaded(function(restaurantData) {
			$scope.restaurantData.timeToOrder = restaurantData.orderTime;
			$scope.restaurantData.name = restaurantData.restaurantName;
			$scope.restaurantData.phonenumber = restaurantData.restaurantPhone;
			$scope.restaurantData.website = restaurantData.restaurantURL;
			$scope.restaurantData.restaurantMenuURL = $sce.trustAsResourceUrl(restaurantData.menuURL);
		});
	}


	var config = {
		client_id: '23324292563.23327735669',
		client_secret: 'f75c945c04460239fdbdc9b5be119a83',
		authParams : {
			client_id: '23324292563.23327735669',
			scope: 'incoming-webhook',
			redirect_uri: 'https://weeats-d7579.firebaseapp.com/#/home'
		}
	}
	

	$scope.logout = function() {
		AuthService.logout();
	}

	$scope.order = {
		item: ""
	}

	$scope.submitOrder = function() {
		//TODO 
		/* 
			after their order has been added, then change the relevant data in firebase
			since this is submitOrder them the boolean value of placedOrder becomes true
		*/		
		userRef.update({"placedOrder":true, "optedOut":false});
		orderRef.push().set({"customer":authData.uid, "order":$scope.order.item});

	}

	function init() {
		SlackAuthService.access();
	}
	init();

	$scope.optOut = function () {
		// Todo get the reference of the current user and change opted out boolean
		userRef.update({"optedOut": true});
	}

	// for admin 


	//TODO: make reverse opt out functionality

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
		
		var currentTime = new Date().toTimeString();
		if (currentTime !== $scope.restaurantData.timeToOrder) {
			allUsersObj.$loaded(function(data) {
				for (var i = 0; i < data.length; i++) {
					var bool = !data[i].placedOrder;
					console.log(i + " " + bool);
					if(!data[i].placedOrder || !data[i].optedOut) {
						sendReminderSlackMessage();
					} else {
						$timeout.cancel(promise);
					}
				};
			});
		}
			
	}

	$scope.save = function() {

		promise = $timeout(remind, 10000).then(stopSendingMessages()); // send the reminder every thirty minutes 1800000
		var sanitizedDate = new Date($scope.orderTime);
		var timeForOrder = sanitizedDate.toTimeString();
	
		
		var restaurantData  = new Firebase(FIREBASE_ROOT+'/restaurant');
		restaurantData.update({"restaurantName": googleMapService.restaurantObj.name, "menuURL":googleMapService.restaurantObj.menuURL || $scope.restaurantData.menuURL, "restaurantPhone":$scope.restaurantPhone,
		 "restaurantURL":googleMapService.restaurantObj.website, "orderTime":timeForOrder, "restaurantPhone":googleMapService.restaurantObj.phone_number});

		allUsersObj.$loaded(function(data) {
			// make a new firebase reference for each user with $id and call .update{"optedOut": false, "placedOrder":false}
			var id = data[0].$id;
			var updateUserAfterOrderSave = new Firebase(FIREBASE_ROOT + '/users/'+id);
			updateUserAfterOrderSave.update({"optedOut": false, "placedOrder":false});
		});

		sendOneTimeSlackMessage(googleMapService.restaurantObj.name, timeForOrder); // will send to all users		

	}

	$scope.saveThisRestaurant = function() {
		var restaurantData  = new Firebase(FIREBASE_ROOT+'/restaurants');
		restaurantData.child(googleMapService.restaurantObj.name).update({"restaurantName": googleMapService.restaurantObj.name, "menuURL":googleMapService.restaurantObj.menuURL || $scope.restaurantData.menuURL, "restaurantPhone":$scope.restaurantPhone,
		 "restaurantURL":googleMapService.restaurantObj.website, "restaurantPhone":googleMapService.restaurantObj.phone_number});
	}

	function sendOneTimeSlackMessage(name, time) {
		/* Steps for sending slack notification of restaurant 
			1. Go through all users
			2. Check if they have a webhook attribute
			3. using $http, send a one time POST request that the restaurant has been set for the day.
		*/
		
		allUsersObj.$loaded(function(data) {
			for (var i = 0; i < data.length; i++) {
				var webhook = data[i].webhookURL;
				if(data[i].webhookURL) {
					$http({
						url: webhook,
						method:"POST",
						data: {
						    "attachments": [
						        {
						           
						            "fallback": "Order lunch now!",
						            "title": name,
						            "pretext": "Order lunch now!",
						            "text": "Order by: *" +time+"!*\n <https://weeats-d7579.firebaseapp.com/#/home|Click here> to order!",
						            "mrkdwn_in": [
						                "text",
						                "pretext"
						            ]
						        }
						    ]
						},
						headers: { "Content-Type":undefined }
					}).then(function success(response){
						console.log("success");
					}, function error(response){
						console.log("error ", response.status);
					})
				}
			};
		})

		}

		function sendReminderSlackMessage() {
			allUsersObj.$loaded(function(data) {
				for (var i = 0; i < data.length; i++) {
					var webhook = data[i].webhookURL;
					if(data[i].webhookURL) {
						$http({
							url: webhook,
							method:"POST",
							data: {
							    "attachments": [
							        {
							           
							            "fallback": "Remember to order lunch!",
							            "title": "Remember to order lunch!",
							            "pretext": "Order lunch now!",
							            "text": "<https://weeats-d7579.firebaseapp.com/#/home|Click here> to order!",
							            "mrkdwn_in": [
							                "text",
							                "pretext"
							            ]
							        }
							    ]
							},
							headers: { "Content-Type":undefined }
						}).then(function success(response){
							console.log("success");
						}, function error(response){
							console.log("error ", response.status);
						})
					}
				};
			})
		}

		function stopSendingMessages() {
			$timeout.cancel(promise);
		}


		function loadOrders(ref) {
			return $firebaseArray(ref);
		}
		// end admin functions 



}]);