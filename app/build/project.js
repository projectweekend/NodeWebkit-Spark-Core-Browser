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
            templateUrl: "templates/devices.html",
            controller: "Devices"
        } );

        $routeProvider.otherwise( {
            redirectTo: "/login"
        } );

} ] );

var ctlMod = angular.module( "sparkCoreBrowserApp.controllers", [] );

SPARK = require( "spark" );


ctlMod.controller( "Main", [ "$scope", "$location",
    function ( $scope, $location ) {

        $scope.isActiveNavItem = function ( view ) {

            return view === $location.path();

        };

    } ] );


ctlMod.controller( "Login", [ "$scope", "$location",
    function ( $scope, $location ) {

        $scope.submitted = false;

        $scope.login = function () {
            $location.path( "/devices" );
            if ( $scope.loginForm.$valid ) {

                console.log( "START: logging in" );

                SPARK.login( {
                    username: $scope.username,
                    password: $scope.password
                }, function ( err, data ) {

                    $scope.$apply( function () {
                        console.log( "FINISH: logging in" );
                        $location.path( "/devices" );
                    } );

                } );

            } else {
                $scope.submitted = true;
            }
        };

    } ] );


ctlMod.controller( "Devices", [ "$scope",
    function ( $scope ) {

    } ] );

var svcMod = angular.module( "sparkCoreBrowserApp.services", [] );


svcMod.factory( "GUI", [ function () {

    var gui = require('nw.gui');

    return gui;

} ] );


// svcMod.factory( "Spark", [ function (  ) {

//     var spark = require( "spark" );

//     return spark;

// } ] );
