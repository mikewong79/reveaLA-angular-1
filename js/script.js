var LaApp = angular.module ('LaApp', ["ui.router"]);

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
	  	url: "tourtype",
	  	templateUrl: "../reveaLA-angular/partials/tourtype.html"
	  })
	  .state("found", {
	  	url: "found",
	  	templateUrl: "../reveaLA-angular/partials/found.html"
	  })
});