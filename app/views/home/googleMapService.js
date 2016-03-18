"use strict";


var googleMapService = angular.module("googleMapService", []);
googleMapService.factory("googleMapService", function(){

	var restaurant = {
		name: "",
		phone_number: "",
		website: "",
		menuURL: "",
		orderTime:""
	}

	return {
		restaurantObj: restaurant
	}

});

