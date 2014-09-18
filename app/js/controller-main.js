var ctlMod = angular.module( "sparkCoreBrowserApp.controller-main", [] );


ctlMod.controller( "Main", [ "$scope", "$rootScope", "$location", "$timeout", "GUI",
    function ( $scope, $rootScope, $location, $timeout, GUI ) {

        $scope.isActiveNavItem = function ( view ) {

            return view === $location.path();

        };

        $scope.$on( "error", function ( e, args ) {

            $rootScope.callRunning = false;
            $rootScope.errorMessage = args.message;

        } );

        $scope.$on( "authSuccess", function () {

            $location.path( "/devices" );

        } );

        $scope.$on( "claimDevice", function () {

            $scope.$apply( function () {
                $location.path( "/claim-device" );
            } );

        } );

        $scope.$on( "claimSuccess", function () {

            $rootScope.callRunning = false;
            $location.path( "/devices" );

        } );

        $scope.$on( "callRunning", function () {

            $rootScope.callRunning = true;

        } );

        $scope.$on( "callFinish", function ( e, args ) {

            $rootScope.callSuccess = args.type == "success";
            $rootScope.callRunning = false;

            $timeout( function () {
                $rootScope.callSuccess = false;
            }, 2000 );

        } );

        $rootScope.callSuccess = false;
        $rootScope.callRunning = false;

    } ] );
