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
            $scope.submitted = true;

        };

    } ] );


ctlMod.controller( "Devices", [ "$scope", "$rootScope", "Spark",
    function ( $scope, $rootScope, Spark ) {

        Spark.devices( function ( err, data ) {
            if ( err ) {
                console.log( err );
                return $rootScope.$broadcast( "error", {
                    message: err.data.error_description
                } );
            }

            for ( var d = 0; d < data.length; d++ ) {
                data[ d ].connectedClass = data[ d ].connected ? "text-success" : "text-danger";
                data[ d ].connectedMessage = data[ d ].connected ? "Connected" : "Disconnected";
            }

            $scope.devices = data;
        } );

    } ] );
