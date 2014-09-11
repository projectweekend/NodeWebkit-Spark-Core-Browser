var ctlMod = angular.module( "sparkCoreBrowserApp.controllers", [] );

SPARK = require( "spark" );


ctlMod.controller( "Main", [ "$scope", "$location",
    function ( $scope, $location ) {

        $scope.isActiveNavItem = function ( view ) {

            return view === $location.path();

        };

        SPARK.on( "login", function () {
            console.log( "FINISH: logging in" );
            $scope.$apply( function () {
                $location.path( "/devices" );
            } );
        } );

    } ] );


ctlMod.controller( "Login", [ "$scope", "$location",
    function ( $scope, $location ) {

        $scope.submitted = false;

        $scope.login = function () {
            if ( $scope.loginForm.$valid ) {

                console.log( "START: logging in" );

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

        SPARK.listDevices( function ( err, data ) {
            if ( err ) {
                console.log( "ERROR" );
                return console.log( err );
            }
            console.log( data );
        } );

        $scope.$apply( function () {
            SPARK.listDevices( function ( err, data ) {
                if ( err ) {
                    console.log( "ERROR" );
                    return console.log( err );
                }
                console.log( data );
            } );
        } );

    } ] );
