var ctlMod = angular.module( "sparkCoreBrowserApp.controllers", [] );


ctlMod.controller( "Main", [ "$scope", "$rootScope", "$location", "$timeout",
    function ( $scope, $rootScope, $location, $timeout ) {

        $scope.isActiveNavItem = function ( view ) {

            return view === $location.path();

        };

        $scope.$on( "error", function ( e, args ) {

            $scope.errorMessage = args.message;

        } );

        $scope.$on( "authSuccess", function () {

            $location.path( "/devices" );

        } );

        $scope.$on( "callSuccess", function () {

            $scope.callSuccess = true;

            $timeout( function ( ) {
                $scope.callSuccess = false;
            }, 2000 );

        } );

    } ] );


ctlMod.controller( "Login", [ "$scope", "$rootScope", "$window", "Spark",
    function ( $scope, $rootScope, $window, Spark ) {

        $scope.submitted = false;

        var loginCallback = function ( err, data ) {

            if ( err ) {
                return $rootScope.$broadcast( "error", {
                    message: err.data.error_description
                } );
            }
            $window.sessionStorage.token = data.access_token;
            return $rootScope.$broadcast( "authSuccess" );

        };

        $scope.login = function () {

            if ( $scope.loginForm.$valid ) {
                return Spark.authenticate( {
                    username: $scope.username,
                    password: $scope.password
                }, loginCallback );
            }

        };

    } ] );


ctlMod.controller( "DevicesList", [ "$scope", "Spark", "Error",
    function ( $scope, Spark, Error ) {

        Spark.listDevices( function ( err, data ) {
            if ( err ) {
                return Error( err );
            }
            $scope.devices = data;
        } );

    } ] );


ctlMod.controller( "DevicesDetail", [ "$scope", "$routeParams", "Spark", "Error",
    function ( $scope, $routeParams, Spark, Error ) {

        $scope.deviceVariables = [];
        $scope.deviceFunctions = [];

        $scope.call = function ( device ) {
            Spark.callFunction( {
                id: $routeParams.deviceId,
                name: device.name,
                args: device.args
            }, function ( err, data ) {
                if ( err ) {
                    return Error( err );
                }
                $scope.$broadcast( "callSuccess" );
            } );
        };

        Spark.readDetail( $routeParams.deviceId, function ( err, data ) {

            if ( err ) {
                return Error( err );
            }

            for ( var v in data.variables ) {
                if ( data.variables.hasOwnProperty( v ) ) {
                    $scope.deviceVariables.push( v );
                }
            }

            for ( var f = 0; f < data.functions.length; f++ ) {
                $scope.deviceFunctions.push( {
                    name: data.functions[ f ],
                    args: ""
                } );
            }

            $scope.device = data;

        } );

    } ] );
