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
			controller: 'NewSessionCtrl'
		})

		.state("found", {
			url: "/found",
			templateUrl: "/partials/found.html"
		});

});

LaApp.controller('LaController', function ($scope) {
	function skrollr() {
    var s = skrollr.init();
	}
});


LaApp.factory('Spot', ['$resource', function($resource) {
  return $resource('https://reveala-rails.herokuapp.com/spots');
}]);


LaApp.controller('MapCtrl', ['$scope', 'Spot', '$state', '$http', function ($scope, Spot, $state, $http) {

	// // Create empty array that we can populate with all of the spots pulled in by the query
	// $scope.spots = [];

	// // Pulling in the spots from the API
	// Spot.query(function(spots) {
 //    $scope.spots = spots;
 //  });

	// Sets map
	$scope.map = {
    control : {},
    center: {
        latitude: 45,
        longitude: -73
    },
    zoom: 18
	};
  $scope.urlMarker = "http://reveala.s3-website-us-west-2.amazonaws.com/images/resizedmarker.png"
  // Calculates the distance between two spots using latitude and longitude (Haversine formula)
  var newDistance;
  var nearestSpot;
  var currentLatLng;
  var lastDistance;
  var browserSupportFlag;
  var spotsFound = [0];
  var distance = function(lat1, lon1, lat2, lon2) {
    var R = 6371; // km (change this constant to get miles)
    var dLat = (lat2-lat1) * Math.PI / 180;
    var dLon = (lon2-lon1) * Math.PI / 180;
    var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180 ) * Math.cos(lat2 * Math.PI / 180 ) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    newDistance = R * c;
    return newDistance;
    // if (newDistance>1) return Math.round(newDistance)+"km";
    // else if (newDistance<=1) return Math.round(newDistance*1000)+"m";
    // return newDistance;
  };

  var navAlert = document.getElementById("nav-alert");
  // console.log(navAlert.innerHTML);
  // if (navAlert.innerHTML = null) {
  //   navAlert.style.display = "none";
  //   console.log(navAlert.innerHTML);
  // };

	// Uses geolocation to find user's current location
	if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position){
      $scope.$apply(function(){
        currentLatLng = {latitude: position.coords.latitude, longitude: position.coords.longitude };
        // userMarker places a marker at the user's current location
				$scope.map.userMarker = [(currentLatLng)];
				$scope.map.center = currentLatLng;
				console.log('Original Location Found');
        navAlert.innerHTML = 'START';
        setTimeout(function(){
          navAlert.innerHTML = null;
        },5000);
    		// Populated with all of the spots' latitudes and longitudes
				$scope.map.spotMarkers = [];

				// // Looping through all of those spots and pulling out their latitude and longitude
    //     for(var n=0; n < $scope.spots.length; n++) {
    //       $scope.map.spotMarkers.push({latitude: $scope.spots[n].latitude, longitude: $scope.spots[n].longitude });
				// }
        // Make http call to backend to find closet spot.
        var requestData = {latitude: currentLatLng.latitude, longitude: currentLatLng.longitude, spot_id: 0, found_spots: spotsFound };
        $http.post('https://reveala-rails.herokuapp.com/closest', requestData).success(function(data){
          console.log(newDistance);
          // console.log(data);
          nearestSpot = data;
          lastDistance = distance(currentLatLng.latitude, currentLatLng.longitude, nearestSpot.latitude, nearestSpot.longitude);
          console.log(newDistance);
          console.log(lastDistance);
        });
      });
    });
  }

  // Keep checking current location
  setInterval(function(){
    // Try W3C Geolocation (Preferred)
    if(navigator.geolocation) {
			browserSupportFlag = true;
			navigator.geolocation.getCurrentPosition(function(position) {
				$scope.$apply(function(){
          currentLatLng = {latitude: position.coords.latitude, longitude: position.coords.longitude};
					console.log('New Location Found');
          distance(currentLatLng.latitude, currentLatLng.longitude, nearestSpot.latitude, nearestSpot.longitude);
          console.log(newDistance);
          console.log(lastDistance);

          if (Math.abs(newDistance-lastDistance) > 0.007) {
            $scope.map.userMarker = [(currentLatLng)];
            $scope.map.center = currentLatLng;
            if (newDistance >= lastDistance) {
              navAlert.innerHTML = 'COLDER';
              navAlert.style.color = 'blue';
              lastDistance = newDistance;
            } else {
              if (newDistance <= 0.05) {
                // Show marker
                // Re-query the database for the next closet spot, store it as nearestSpot
                navAlert.innerHTML = nearestSpot.name;
                $scope.map.spotMarkers.push({latitude: nearestSpot.latitude, longitude: nearestSpot.longitude });
                console.log("Found It!!!, do you see a marker?");
                spotsFound.push(nearestSpot.spot_id);
                var newRequestData = {latitude: currentLatLng.latitude, longitude: currentLatLng.longitude, spot_id: nearestSpot.spot_id, found_spots: spotsFound };
                $http.post('https://reveala-rails.herokuapp.com/closest', newRequestData).success(function(data){
                  console.log(newDistance);
                  console.log(data);
                  nearestSpot = data;
                  lastDistance = distance(currentLatLng.latitude, currentLatLng.longitude, nearestSpot.latitude, nearestSpot.longitude);
                  console.log(newDistance);
                  console.log(lastDistance);
                });
              } else {
                navAlert.innerHTML = 'HOTTER';
                navAlert.style.color = 'red';
                lastDistance = newDistance;
              };
            };
          } else {
            console.log('Move your ass!');
          }
				});
				// Query db for closest spot and store it as nearestSpot
				// userLocation = position.coords.lat, position.coords.lon


				// var userLocationLat = position.coords.latitude;
				// var userLocationLon = position.coords.longitude;
				// var nearestSpotLat = ???.latitude;
				// var nearestSpotLon = ???.longitude;

				// Define nearestSpotLat & nearestSpotLon


				// Calculate distance between userLocation and nearestSpot, set it as newDistance
				// lastDistance set as null outside of setInterval function so that it doesn't keep getting reset as null

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
	},500)

}]);

LaApp.factory('User', ['$resource', function($resource) {
  return $resource('https://reveala-rails.herokuapp.com/user',
    {update: { method: 'PATCH'}});
}]);

LaApp.controller('NewUserCtrl', ['$scope', 'User', '$state', function($scope, User, $state) {
  console.log(User);
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

LaApp.factory('MySession', ['$resource', function($resource) {
  return $resource('https://reveala-rails.herokuapp.com/session', {});
}]);

LaApp.controller('NewSessionCtrl', ['$scope', 'MySession', '$state', function($scope, MySession, $state) {

  $scope.newSession = new MySession();

  $scope.signIn = function() {
    console.log($scope.newSession);
    $scope.newSession.$save(function(data) {
      console.log(data);
      $state.go('start');
    });
  };
}]);


// LaApp.controller('SignInCtrl', ['$scope', '$state', function($scope, $state) {
//   // MODIFY THIS FUNCTION FOR SIGN IN/SESSIONS
//  function login(){
//    var onSuccessCallback = function(data) {
//      $rootScope.currentUserSignedIn = true;
//    };
//    // Login function to the server comes here
//    $location.path('/map');
//  };
// }]);

// LaApp.controller('NewSessionCtrl', ['$scope', 'Session', '$state', function($scope, Session, $state) {

//   var sessionURL = "http://107.170.214.255/session";

//   $scope.newSession = {
//     password: "",
//     email: ""
//   };

//   $http({
//       method: 'POST',
//       url: sessionURL,
//       data: JSON.stringify({
//         password: $scope.sessionPassword,
//         email: $scope.sessionEmail,
//       })}).
//     success(function(data, status, headers, config) {
//       console.log("success!");
//     }).
//     error(function(data, status, headers, config) {
//       console.log("fail");
//     });

// }]);
