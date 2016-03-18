angular.module("search-box-example", ['uiGmapgoogle-maps'])

.run(['$templateCache', function ($templateCache) {
  $templateCache.put('searchbox.tpl.html', '<input id="pac-input" class="pac-controls" type="text" placeholder="Search">');
  $templateCache.put('window.tpl.html', '<div ng-controller="WindowCtrl" ng-init="showPlaceDetails(parameter)">{{place.name}}</div>');
}])

.controller('WindowCtrl', function ($scope) {
  $scope.place = {};
  $scope.showPlaceDetails = function(param) {
    $scope.place = param;
  }
})

.controller("SearchBoxController",['$scope', '$timeout', 'uiGmapLogger', '$http','uiGmapGoogleMapApi', 'googleMapService'
    , function ($scope, $timeout, $log, $http, GoogleMapApi, googleMapService) {
  $log.doLog = true

  GoogleMapApi.then(function(maps) {
    maps.visualRefresh = true;
    $scope.defaultBounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(37.3385803,-121.8912776),
      new google.maps.LatLng(37.3385803,-121.8912776));

    $scope.map.bounds = {
      northeast: {
        latitude:$scope.defaultBounds.getNorthEast().lat(),
        longitude:$scope.defaultBounds.getNorthEast().lng()
      },
      southwest: {
        latitude:$scope.defaultBounds.getSouthWest().lat(),
        longitude:-$scope.defaultBounds.getSouthWest().lng()

      }
    }
    $scope.searchbox.options.bounds = new google.maps.LatLngBounds($scope.defaultBounds.getNorthEast(), $scope.defaultBounds.getSouthWest());
  });

  angular.extend($scope, {
    window: {
      show: false,
      options: {
        pixelOffset: { width: 0, height: -40 }
      },
      templateurl:'window.tpl.html',
      templateparameter: {},
      closeClick: function () {
        $scope.window.show = false;
      }
    },
    map: {
      control: {},
      center: {
        latitude: 37.3385803,
        longitude: -121.8912776
      },
      zoom: 12,
      dragging: false,
      bounds: {},
      markers: [],
      idkey: 'place_id',
      events: {
        idle: function (map) {
                   
        },
        dragend: function(map) {
          //update the search box bounds after dragging the map
          var bounds = map.getBounds();
          var ne = bounds.getNorthEast();
          var sw = bounds.getSouthWest(); 
          $scope.searchbox.options.bounds = new google.maps.LatLngBounds(sw, ne);
          //$scope.searchbox.options.visible = true;
        }
      }
    },
    searchbox: {
      template: 'searchbox.tpl.html',
      //position:'top-right',
      position:'top-left',
      options: {
        bounds: {},
        visible: true
      },
      //parentdiv:'searchBoxParent',
      events: {
        places_changed: function (searchBox) {
          
          places = searchBox.getPlaces()

          if (places.length == 0) {
            return;
          }
          // For each place, get the icon, place name, and location.
          newMarkers = [];
          var bounds = new google.maps.LatLngBounds();
          
          for (var i = 0, place; place = places[i]; i++) {
            // get the restaurant details and send to the googleMapService
            $scope.restaurantName = place.name;
            googleMapService.restaurantObj.name = $scope.restaurantName;
            if(place.international_phone_number) {
              $scope.phone_number = place.international_phone_number;
              googleMapService.restaurantObj.phone_number = $scope.phone_number;
            }
            
            if(place.website || place.url) {
              $scope.website = place.website || place.url;
              googleMapService.restaurantObj.website = $scope.website;
            }
            // Create a marker for each place.
            var marker = {
              idKey:i,
              place_id: place.place_id,
              name: place.name,
              latitude: place.geometry.location.lat(),
              longitude: place.geometry.location.lng(),
              templateurl:'window.tpl.html',
              templateparameter: place,
              events: {
                click: function (marker) {
                  $scope.window.coords = {
                    latitude: marker.model.latitude,
                    longitude: marker.model.longitude
                  }
                  $scope.window.templateparameter = marker.model.templateparameter;
                  $scope.window.show = true;
                  
                }
              }
            };
            newMarkers.push(marker);
            bounds.extend(place.geometry.location);
          }

          $scope.map.bounds = {
            northeast: {
              latitude: bounds.getNorthEast().lat(),
              longitude: bounds.getNorthEast().lng()
            },
            southwest: {
              latitude: bounds.getSouthWest().lat(),
              longitude: bounds.getSouthWest().lng()
            }
          }

          $scope.map.markers = newMarkers;
        }
      }
    }
  });
}]);
