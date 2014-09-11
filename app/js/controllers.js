var ctlMod = angular.module( "sparkCoreBrowserApp.controllers", [] );

SPARK = require( "spark" );


ctlMod.controller( "Main", [ "$scope", "$location",
    function ( $scope, $location ) {

        $scope.isActiveNavItem = function ( view ) {

            return view === $location.path();

        };

        SPARK.on( 'login', function () {
            $location.path( "/devices" );
        } );

    } ] );


ctlMod.controller( "Login", [ "$scope", "$location",
    function ( $scope, $location ) {

        $scope.submitted = false;

        $scope.login = function () {
            if ( $scope.loginForm.$valid ) {
                SPARK.login( {
                    username: $scope.username,
                    password: $scope.password
                } );
            } else {
                $scope.submitted = true;
            }
        };

    } ] );


ctlMod.controller( "Devices", [ "$scope",
    function ( $scope ) {

    } ] );
