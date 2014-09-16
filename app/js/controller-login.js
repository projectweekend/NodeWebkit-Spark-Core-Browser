var ctlMod = angular.module( "sparkCoreBrowserApp.controller-login", [] );


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
