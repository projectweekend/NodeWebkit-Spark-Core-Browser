var ctlMod = angular.module( "sparkCoreBrowserApp.controllers", [] );


ctlMod.controller( "Main", [ "$scope", "$location",
    function ( $scope, $location ) {

        $scope.isActiveNavItem = function ( view ) {

            return view === $location.path();

        };

    } ] );


ctlMod.controller( "Home", [ "$scope", "$location",
    function ( $scope, $location ) {


    } ] );
