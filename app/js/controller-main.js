var ctlMod = angular.module( "sparkCoreBrowserApp.controller-main", [] );


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
