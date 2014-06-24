var LaApp = angular.module('LaApp', ["ui.router", "mgcrea.ngStrap", 'mgcrea.ngStrap.modal', 'google-maps', 'ngResource']);

// LaApp.config(['$httpProvider', function($httpProvider) {
//     var authToken = angular.element("meta[name=\"csrf-token\"]").attr("content");
//     var defaults = $httpProvider.defaults.headers;

//     defaults.common["X-CSRF-TOKEN"] = authToken;
//     defaults.patch = defaults.patch || {};
//     defaults.patch['Content-Type'] = 'application/json';
//     defaults.common['Accept'] = 'application/json';
// }]);

LaApp.config(function($stateProvider, $urlRouterProvider) {
  // For any unmatched url, redirect to start modal
  $urlRouterProvider.otherwise("/start");

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
			templateUrl: "../reveaLA-angular/partials/signup.html",
      controller: 'UserCtrl'
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
  return $resource('http://107.170.214.225/users/',
     { method: 'GET'});
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

		function handleNoGeolocation(errorFlag) {
			if (errorFlag == true) {
				alert("Geolocation service failed.");

			} else {
				alert("Your browser doesn't support geolocation. We've placed you at beautiful GA");
			}
		}
	},30000);
});

LaApp.controller('UserCtrl', ['$scope', 'User', function($scope, User) {
    $scope.users= [];

    $scope.newUser = new User();

    User.query(function(users) {
      $scope.users = users;
   });

    $scope.saveUser = function () {
      $scope.newUser.$save(function(user) {
        $scope.users.push(user)
        $scope.newUser = new User();
      });
    }

    // $scope.deleteYogurt = function (user) {
    //   yogurt.$delete(function() {
    //     position = $scope.users.indexOf(user);
    //     $scope.users.splice(position, 1);
    //   }, function(errors) {
    //     $scope.errors = errors.data
    //   });
    // }

    // $scope.showYogurt = function(user) {
    //   yogurt.details = true;
    //   yogurt.editing = false;
    // }

    // $scope.hideYogurt = function(user) {
    //   yogurt.details = false;
    // }

    // $scope.editYogurt = function(user) {
    //   yogurt.editing = true;
    //   yogurt.details = false;
    // }

    // $scope.updateYogurt = function(user) {
    //   yogurt.$update(function() {
    //     yogurt.editing = false;
    //   }, function(errors) {
    //     $scope.errors = errors.data
    //   });
    // }

    $scope.clearErrors = function() {
      $scope.errors = null;
    }
}])
