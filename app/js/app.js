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

        $routeProvider.when( "/login", {
            templateUrl: "templates/login.html",
            controller: "Login"
        } );

        $routeProvider.when( "/devices", {
            templateUrl: "templates/devices-list.html",
            controller: "DevicesList"
        } );

        $routeProvider.when( "/devices/:deviceId", {
            templateUrl: "templates/devices-detail.html",
            controller: "DevicesDetail"
        } );

        $routeProvider.otherwise( {
            redirectTo: "/login"
        } );

} ] );
