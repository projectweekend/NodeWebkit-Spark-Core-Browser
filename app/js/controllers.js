var ctlMod = angular.module( "sparkCoreBrowserApp.controllers", [] );


ctlMod.controller( "Main", [ "$scope", "$location",
    function ( $scope, $location ) {

        $scope.isActiveNavItem = function ( view ) {

            return view === $location.path();

        };

    } ] );


ctlMod.controller( "Login", [ "$scope", "$rootScope", "$location", "Spark",
    function ( $scope, $rootScope, $location, Spark ) {

        $scope.submitted = false;

        $scope.login = function () {
            if ( $scope.loginForm.$valid ) {
                Spark.authenticate( {
                    username: $scope.username,
                    password: $scope.password
                }, function ( err, data ) {
                    if ( err ) {
                        console.log( "ERROR" );
                        console.log( err );
                        return;
                    }
                    console.log( data );
                } );
            } else {

                $scope.submitted = true;

            }
        };

    } ] );


ctlMod.controller( "Devices", [ "$scope",
    function ( $scope ) {

    } ] );
