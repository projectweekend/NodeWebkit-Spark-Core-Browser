var angMod = angular.module( "sparkCoreBrowserApp", [
    "ngRoute",
    "sparkCoreBrowserApp.controller-main",
    "sparkCoreBrowserApp.controller-login",
    "sparkCoreBrowserApp.controller-devices",
    "sparkCoreBrowserApp.controller-claim-device",
    "sparkCoreBrowserApp.controller-confirm-delete",
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

        $routeProvider.when( "/devices/:deviceId/confirm-delete", {
            templateUrl: "templates/confirm-delete.html",
            controller: "ConfirmDelete"
        } );

        $routeProvider.when( "/claim-device", {
            templateUrl: "templates/claim-device.html",
            controller: "ClaimDevice"
        } );

        $routeProvider.otherwise( {
            redirectTo: "/login"
        } );

} ] );
