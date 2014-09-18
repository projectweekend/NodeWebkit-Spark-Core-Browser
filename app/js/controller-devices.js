var ctlMod = angular.module( "sparkCoreBrowserApp.controller-devices", [] );


ctlMod.controller( "Devices", [ "$scope", "Spark", function ( $scope, Spark ) {

    Spark.listDevices( function ( err, data ) {
        if ( err ) {
            return Error( err );
        }
        $scope.devices = data;
    } );

} ] );
