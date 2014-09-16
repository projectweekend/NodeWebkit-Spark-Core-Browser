var ctlMod = angular.module( "sparkCoreBrowserApp.controller-devices-list", [] );


ctlMod.controller( "DevicesList", [ "$scope", "Spark", "Error",
    function ( $scope, Spark, Error ) {

        Spark.listDevices( function ( err, data ) {
            if ( err ) {
                return Error( err );
            }
            $scope.devices = data;
        } );

    } ] );
