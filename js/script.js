var LaApp = angular.module('LaApp', ["ui.router", "mgcrea.ngStrap", 'mgcrea.ngStrap.modal', 'google-maps']);

LaApp.config(function($stateProvider, $urlRouterProvider) {
  // For any unmatched url, redirect to start modal
  $urlRouterProvider.otherwise("/");

  // Sets up the states
  $stateProvider
		.state("map", {
			url: "/map",
			templateUrl: "../reveaLA-angular/partials/map.html"
		})
		.state("start", {
			url: "/start",
			templateUrl: "../reveaLA-angular/partials/start.html"
		})
		.state("signup", {
			url: "/signup",
			templateUrl: "../reveaLA-angular/partials/signup.html"
		})
		.state("signin", {
			url: "/signin",
			templateUrl: "../reveaLA-angular/partials/signin.html"
		})
		.state("tutorial", {
			url: "/tutorial",
			templateUrl: "../reveaLA-angular/partials/tutorial.html"
		})
		.state("tourtype", {
			url: "/tourtype",
			templateUrl: "../reveaLA-angular/partials/tourtype.html"
		})
		.state("found", {
			url: "/found",
			templateUrl: "../reveaLA-angular/partials/found.html"
		});
});

LaApp.factory('User', ['$resource', function($resource) {
  return $resource('107.170.214.225/users/:id',
     {id: '@id'},
     {update: { method: 'PUT'}});
}]);

LaApp.controller('LaController', function ($scope) {

	function skrollr() {
    var s = skrollr.init();
	};

	function login(){
		var onSuccessCallback = function(data) {
			$rootScope.currentUserSignedIn = true;
		};
		// Login function to the server comes here
		$location.path('/map');
	}

	$scope.map = {
    control : {},
    center: {
        latitude: 45,
        longitude: -73
    },
    zoom: 16,
    markers: [{
			latitude: 45,
			longitude: -73
    }]
	};

	if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(function(position){
      $scope.$apply(function(){
				$scope.map.markers = [{latitude: position.coords.latitude, longitude: position.coords.longitude }];
				$scope.map.center = {latitude: position.coords.latitude, longitude: position.coords.longitude };
				console.log('Original Location Found');
      });
    });
  }

  setInterval(function(){
    // Try W3C Geolocation (Preferred)
    if(navigator.geolocation) {
			browserSupportFlag = true;
			navigator.geolocation.getCurrentPosition(function(position) {
				$scope.$apply(function(){
					$scope.map.markers.push({latitude: position.coords.latitude, longitude: position.coords.longitude })
					console.log('New Location Found');
				});
			}, function() {
				handleNoGeolocation(browserSupportFlag);
			});
		}
		// Browser doesn't support Geolocation
		else {
			browserSupportFlag = false;
			handleNoGeolocation(browserSupportFlag);
		}

		// function handleNoGeolocation(errorFlag) {
		// 	if (errorFlag == true) {
		// 		alert("Geolocation service failed.");

		// 	} else {
		// 		alert("Your browser doesn't support geolocation. We've placed you at beautiful GA");
		// 	}
		// }
	},30000);
});
