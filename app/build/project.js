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

        $scope.$on( "authenticated", function () {
            $scope.$apply( function () {
                $location.path( "/devices" );
            } );
        } );

    } ] );


ctlMod.controller( "Login", [ "$scope", "$rootScope", "$location", "Spark",
    function ( $scope, $rootScope, $location, Spark ) {

        $scope.submitted = false;

        $scope.login = function () {
            if ( $scope.loginForm.$valid ) {

                Spark.login( {
                    username: $scope.username,
                    password: $scope.password
                }, function ( err, data ) {
                    if ( err ) {
                        console.log( "ERROR" );
                        return console.log( err );
                    }
                    $rootScope.$broadcast( "authenticated" );
                } );

            } else {

                $scope.submitted = true;

            }
        };

    } ] );


ctlMod.controller( "Devices", [ "$scope",
    function ( $scope ) {

        SPARK.listDevices( function ( err, data ) {

            if ( err ) {
                console.log( "ERROR" );
                return console.log( err );
            }

            $scope.$apply( function () {
                $scope.devices = data;
            } );

        } );

    } ] );

var spark = require( "spark" );

var svcMod = angular.module( "sparkCoreBrowserApp.services", [] );


svcMod.factory( "GUI", [ function () {

    var gui = require('nw.gui');

    return gui;

} ] );


svcMod.factory( "Spark", [ function (  ) {

    return spark;

} ] );
