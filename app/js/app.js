var angMod = angular.module( "sparkCoreBrowserApp", [
    "ngRoute",
    "sparkCoreBrowserApp.controller-main",
    "sparkCoreBrowserApp.controller-login",
    "sparkCoreBrowserApp.controller-devices",
    "sparkCoreBrowserApp.service-error",
    "sparkCoreBrowserApp.service-spark-core",
    "sparkCoreBrowserApp.service-gui"
] );


angMod.config( [
    "$routeProvider",
    "$locationProvider",
    "$sceDelegateProvider",
    function ( $routeProvider, $locationProvider, $sceDelegateProvider ) {

        $routeProvider.when( "/login", {
            templateUrl: "templates/login.html",
            controller: "Login"
        } );

        $routeProvider.when( "/devices", {
            templateUrl: "templates/devices.html",
            controller: "Devices"
        } );

        $routeProvider.otherwise( {
            redirectTo: "/login"
        } );

} ] );
