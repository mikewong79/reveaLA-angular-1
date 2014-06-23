var LaApp = angular.module('LaApp', ["ui.router", "mgcrea.ngStrap", 'mgcrea.ngStrap.modal']);

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
	  })
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

	$scope.newUser = function() {
		$scope.user = {};
	}

	$scope.addUser = function() {
		$http.post('107.170.214.225/users', {'user': $scope.user})
		.success(function(response, status, headers, config) {
			$scope.users.push(response.user);
		})
		.error(function(response, status, headers, config) {
			$scope.error_message = response.error_message;
		});
	}

	function login(){
	    var onSuccessCallback = function(data) {
	        $rootScope.currentUserSignedIn = true;
	    };
	    // Login function to the server comes here
	    $location.path('/map')
	};

});