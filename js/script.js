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
			templateUrl: "../reveaLA-angular/partials/map.html",
			controller: 'MapCtrl'
		})
		.state("start", {
			url: "/start",
			templateUrl: "../reveaLA-angular/partials/start.html"
		})
		.state("signup", {
			url: "/signup",
			templateUrl: "../reveaLA-angular/partials/signup.html",
      controller: 'NewUserCtrl'
		})
		.state("signin", {
			url: "/signin",
			templateUrl: "../reveaLA-angular/partials/signin.html",
			controller: 'SignInCtrl'
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

LaApp.controller('LaController', function ($scope) {
	function skrollr() {
    var s = skrollr.init();
	};
});

LaApp.factory('Spot', ['$resource', function($resource) {
  return $resource('http://107.170.214.225/spots/',
    {update: { method: 'GET'}});
}]);

LaApp.controller('MapCtrl', function ($scope) {

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

		function handleNoGeolocation(errorFlag) {
			if (errorFlag == true) {
				alert("Geolocation service failed.");

			} else {
				alert("Your browser doesn't support geolocation. We've placed you at beautiful GA");
			}
		}
	},30000);
});

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
  return $resource('http://107.170.214.225/users/:id',
    {id: '@id'},
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
