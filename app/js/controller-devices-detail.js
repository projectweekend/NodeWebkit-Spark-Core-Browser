var ctlMod = angular.module( "sparkCoreBrowserApp.controller-devices-detail", [] );


ctlMod.controller( "DevicesDetail", [ "$scope", "$routeParams", "Spark", "Error",
    function ( $scope, $routeParams, Spark, Error ) {

        $scope.deviceVariables = [];
        $scope.deviceFunctions = [];

        $scope.call = function ( device ) {

            console.log( device );
            console.log( $routeParams.deviceId );

            Spark.callFunction( {
                id: $routeParams.deviceId,
                name: device.name,
                argsName: device.argsName,
                argsValue: device.argsValue
            }, function ( err, data ) {
                if ( err ) {
                    console.log( err );
                    return Error( err );
                }
                console.log( data );
                $scope.$broadcast( "callSuccess" );
            } );
        };

        Spark.readDetail( $routeParams.deviceId, function ( err, data ) {

            if ( err ) {
                return Error( err );
            }

            for ( var v in data.variables ) {
                if ( data.variables.hasOwnProperty( v ) ) {
                    $scope.deviceVariables.push( v );
                }
            }

            for ( var f = 0; f < data.functions.length; f++ ) {
                $scope.deviceFunctions.push( {
                    name: data.functions[ f ],
                    argsName: "",
                    argsValue: ""
                } );
            }

            $scope.device = data;

        } );

    } ] );
