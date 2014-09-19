var ctlMod = angular.module( "sparkCoreBrowserApp.controller-confirm-delete", [] );


ctlMod.controller( "ConfirmDelete", [ "$scope", "$rootScope", "$routeParams", "Spark",
    function ( $scope, $rootScope, $routeParams, Spark ) {

        $scope.listDevices = function () {
            $rootScope.$broadcast( "goToDevices" );
        };


        $scope.deleteDevice = function () {

            $rootScope.$broadcast( "callRunning" );

            var success = function ( data ) {

                if ( typeof data.errors !== "undefined" ) {
                    return Error( data );
                }
                $rootScope.$broadcast( "claimDeleteSuccess" );
            };

            var failure = function ( err ) {

                return $rootScope.$broadcast( "error", {
                    message: err.message
                } );

            };

            Spark.removeDevice( $routeParams.deviceId ).then( success, failure );
        };

    } ] );
