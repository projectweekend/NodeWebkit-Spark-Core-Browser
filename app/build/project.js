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

        $routeProvider.when( "/home", {
            templateUrl: "templates/home.html",
            controller: "Home"
        } );

        $routeProvider.otherwise( {
            redirectTo: "/home"
        } );

} ] );

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

var svcMod = angular.module( "sparkCoreBrowserApp.services", [] );


svcMod.factory( "GUI", [ function () {

    var gui = require('nw.gui');

    return gui;

} ] );
