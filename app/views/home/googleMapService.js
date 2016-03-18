"use strict";


var googleMapService = angular.module("googleMapService", []);
googleMapService.factory("googleMapService", function(){

	var restaurant = {
		menuURL: "",
		orderTime:"",
		name: "",
		phone_number: "",
		website: ""
	}

	return {
		restaurantObj: restaurant
	}

});

