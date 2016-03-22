"use strict";

var orderformdirective = angular.module("orderformdirective", []);
orderformdirective.directive("orderForm", function(){

  return {
    restrict: 'E',
    templateUrl:"directives/manual.html",
    replace: true

  }

});