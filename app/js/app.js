var angMod = angular.module( "sparkCoreBrowserApp", [
    "ngRoute",
    "sparkCoreBrowserApp.controllers",
    "sparkCoreBrowserApp.services"
] );


angMod.config( [
    "$routeProvider",
    "$locationProvider",
    "$sceDelegateProvider",
    function ( $routeProvider, $locationProvider, $sceDelegateProvider ) {

        $routeProvider.when( "/home", {
            templateUrl: "templates/home.html",
            controller: "Home"
        } );

        $routeProvider.otherwise( {
            redirectTo: "/home"
        } );

} ] );
