'use strict';

var LaApp = angular.module('LaApp', ["ui.router", "mgcrea.ngStrap", 'mgcrea.ngStrap.modal', 'google-maps', 'ngResource']);

LaApp.config(function($stateProvider, $urlRouterProvider, $httpProvider) {
  // var defaults = $httpProvider.defaults.headers;

  // defaults.patch = defaults.patch || {};
  // defaults.patch['Content-Type'] = 'application/json';
  // defaults.post['Content-Type'] = 'application/json';
  // defaults.common['Accept'] = 'application/json';


  //Reset headers to avoid OPTIONS request (aka preflight)
  // $httpProvider.defaults.headers.common = {};
  // $httpProvider.defaults.headers.common['Content-Type'] = 'application/json; charset=utf-8';
  // $httpProvider.defaults.headers.post = {};
  // $httpProvider.defaults.headers.put = {};
  // $httpProvider.defaults.headers.patch = {};
  // delete $httpProvider.defaults.headers.common["X-Requested-With"];

  // For any unmatched url, redirect to start modal
  $urlRouterProvider.otherwise("/start");

  // Sets up the states
  $stateProvider
		.state("map", {
			url: "/map",
			templateUrl: "/partials/map.html",
			controller: 'MapCtrl'
		})
		.state("start", {
			url: "/start",
			templateUrl: "/partials/start.html"
		})
		.state("signup", {
			url: "/signup",
			templateUrl: "/partials/signup.html",
      controller: 'NewUserCtrl'
		})
		.state("signin", {
			url: "/signin",
			templateUrl: "/partials/signin.html",
			controller: 'SignInCtrl'
		})

		.state("tutorial", {
			url: "/tutorial",
			templateUrl: "/partials/tutorial.html"
		})
		.state("tourtype", {
			url: "/tourtype",
			templateUrl: "/partials/tourtype.html"
		})
		.state("found", {
			url: "/found",
			templateUrl: "/partials/found.html"
		});

});

LaApp.controller('LaController', function ($scope) {
	function skrollr() {
    var s = skrollr.init();
	};
});

LaApp.factory('Spot', ['$resource', function($resource) {
  return $resource('http://107.170.214.225/spots');
}]);

LaApp.controller('MapCtrl', ['$scope', 'Spot', '$state', function ($scope, Spot, $state) {

	// Populated with all of the spots pulled in by the query
	$scope.spots = [];
	
	// Pulling in the spots from the API
	Spot.query(function(spots) {
    $scope.spots = spots;
   });

	// Sets map
	$scope.map = {
    control : {},
    center: {
        latitude: 45,
        longitude: -73
    },
    zoom: 16
	};
	
	// Uses geolocation to find user's current location
	if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position){
      $scope.$apply(function(){
      	// userMarker places a marker at the user's current location
				$scope.map.userMarker = [({latitude: position.coords.latitude, longitude: position.coords.longitude })];
				$scope.map.center = {latitude: position.coords.latitude, longitude: position.coords.longitude };
				console.log('Original Location Found');
				// Populated with all of the spots' latitudes and longitudes
				$scope.map.spotMarkers = [];
				// Looping through all of those spots and pulling out their latitude and longitude
    		for(var n=0; n < $scope.spots.length; n++) {
	  			$scope.map.spotMarkers.push({latitude: $scope.spots[n].latitude, longitude: $scope.spots[n].longitude });
				};
      });
    });
  }

	var lastDistance = null;
  var browserSupportFlag = new Boolean();

  // Keep checking current location
  setInterval(function(){
    // Try W3C Geolocation (Preferred)
    if(navigator.geolocation) {
			browserSupportFlag = true;
			navigator.geolocation.getCurrentPosition(function(position) {
				$scope.$apply(function(){
					$scope.map.userMarker = [{latitude: position.coords.latitude, longitude: position.coords.longitude }];
					console.log('New Location Found');
				});
				// Query db for closest spot and store it as nearestSpot
				// userLocation = position.coords.lat, position.coords.lon
				var userLocation = ({latitude: position.coords.latitude, longitude: position.coords.longitude});

				// Calculates the distance between two spots using latitude and longitude (Haversine formula)
				function distance(lat1, lon1, lat1, lon1) {
					var R = 6371; // km (change this constant to get miles)
					var dLat = (lat2-lat1) * Math.PI / 180;
					var dLon = (lon2-lon1) * Math.PI / 180;
					var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
						Math.cos(lat1 * Math.PI / 180 ) * Math.cos(lat2 * Math.PI / 180 ) *
						Math.sin(dLon/2) * Math.sin(dLon/2);
					var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
					var newDistance = R * c;
					if (newDistance>1) return Math.round(d)+"km";
					else if (newDistance<=1) return Math.round(d*1000)+"m";
					return newDistance;
				};

				var userLocationLat = position.coords.latitude;
				var userLocationLon = position.coords.longitude;
				var nearestSpotLat = ???.latitude;
				var nearestSpotLon = ???.longitude;
				// Define nearestSpotLat & nearestSpotLon
				function distance(userLocationLat, userLocationLon, nearestSpotLat, nearestSpotLon);

				// Calculate distance between userLocation and nearestSpot, set it as newDistance
				// lastDistance set as null outside of setInterval function so that it doesn't keep getting reset as null
				if (lastDistance = null) {
					$scope.alert = start;
					lastDistance = newDistance;
				} else if (newDistance >= lastDistance) {
					$scope.alert = cold;
					lastDistance = newDistance;
				} else {
					if (newDistance <= 0.5) {
						// Show marker
						// Re-query the database for the next closet spot, store it as nearestSpot
						$scope.alert = null;
					} else {
						$scope.alert = hot;
						lastDistance = newDistance;
					};
				};
			}, function() {
				handleNoGeolocation(browserSupportFlag);
			});
		}
		// Browser doesn't support Geolocation
		else {
			browserSupportFlag = false;
			handleNoGeolocation(browserSupportFlag);
		};

		function handleNoGeolocation(errorFlag) {
			if (errorFlag == true) {
				alert("Geolocation service failed.");
			} else {
				alert("Your browser doesn't support geolocation. We've placed you at beautiful GA");
			}
		}
	},30000)

}]);

LaApp.controller('SignInCtrl', ['$scope', '$state', function($scope, $state) {
  // MODIFY THIS FUNCTION FOR SIGN IN/SESSIONS
	function login(){
		var onSuccessCallback = function(data) {
			$rootScope.currentUserSignedIn = true;
		};
		// Login function to the server comes here
		$location.path('/map');
	};
}]);

LaApp.factory('User', ['$resource', function($resource) {
  return $resource('http://107.170.214.225/user',
    {update: { method: 'PATCH'}});
}]);

LaApp.controller('NewUserCtrl', ['$scope', 'User', '$state', function($scope, User, $state) {
  $scope.users= [];

  User.query(function(users) {
    $scope.users = users;
  });


  $scope.newUser = new User();

  $scope.saveUser = function() {
    console.log($scope.newUser);
    $scope.newUser.$save(function() {
      $state.go('start');
    });
  };
}]);

LaApp.controller('ShowUserCtrl', ['$scope', 'User', '$stateParams', function($scope, User, $stateParams) {
  User.get({id: $stateParams.id}, function(user) {
    $scope.user = user;
  });
}]);

LaApp.controller('EditUserCtrl', ['$scope', 'User', '$stateParams', '$state', function($scope, User, $stateParams, $state) {
  User.get({id: $stateParams.id}, function(user) {
    $scope.user = user;
  });

  $scope.update = function() {
    $scope.user.$update(function() {
      $state.go('start');
    });
  };
}]);
