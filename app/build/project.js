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

        $routeProvider.when( "/login", {
            templateUrl: "templates/login.html",
            controller: "Login"
        } );

        $routeProvider.otherwise( {
            redirectTo: "/login"
        } );

} ] );

var ctlMod = angular.module( "sparkCoreBrowserApp.controllers", [] );


ctlMod.controller( "Main", [ "$scope", "$location",
    function ( $scope, $location ) {

        $scope.isActiveNavItem = function ( view ) {

            return view === $location.path();

        };

    } ] );


ctlMod.controller( "Login", [ "$scope", "$location",
    function ( $scope, $location ) {

        $scope.submitted = false;

        $scope.login = function () {
            if ( $scope.loginForm.$valid ) {
                // stuffToDo
            } else {
                $scope.submitted = true;
            }
        };

    } ] );

var svcMod = angular.module( "sparkCoreBrowserApp.services", [] );


svcMod.factory( "GUI", [ function () {

    var gui = require('nw.gui');

    return gui;

} ] );
