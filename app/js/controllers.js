var ctlMod = angular.module( "sparkCoreBrowserApp.controllers", [] );


ctlMod.controller( "Main", [ "$scope", "$rootScope", "$location",
    function ( $scope, $rootScope, $location ) {

        $scope.isActiveNavItem = function ( view ) {

            return view === $location.path();

        };

        $scope.$on( "error", function ( e, args ) {

            $scope.errorMessage = args.message;

        } );

        $scope.$on( "authSuccess", function () {

            $location.path( "/devices" );

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

        $scope.deviceId = $routeParams.deviceId;

    } ] );
