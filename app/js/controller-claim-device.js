var ctlMod = angular.module("sparkCoreBrowserApp.controller-claim-device", [] );


ctlMod.controller( "ClaimDevice", [ "$scope", "$rootScope", "Error", "Spark",
    function ( $scope, $rootScope, Error, Spark ) {

        $scope.claim = function () {

            var success = function ( data ) {
                if ( data.errors.length > 0 ) {
                    return Error( data );
                }
                console.log( data );
            };

            var failure = function ( err ) {
                return Error( err );
            };

            Spark.claimDevice( $scope.coreId ).then( success, failure );
        };

    } ] );
