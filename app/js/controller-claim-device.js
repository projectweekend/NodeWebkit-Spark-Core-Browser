var ctlMod = angular.module("sparkCoreBrowserApp.controller-claim-device", [] );


ctlMod.controller( "ClaimDevice", [ "$scope", "$rootScope", "Error", "Spark",
    function ( $scope, $rootScope, Error, Spark ) {

        $scope.claim = function () {

            $rootScope.$broadcast( "callRunning" );

            var success = function ( data ) {

                if ( typeof data.errors !== "undefined" ) {
                    return Error( data );
                }

                console.log( data );
                $rootScope.$broadcast( "claimDeleteSuccess" );
            };

            var failure = function ( err ) {
                return Error( err );
            };

            Spark.claimDevice( $scope.coreId ).then( success, failure );
        };

    } ] );
