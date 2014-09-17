var ctlMod = angular.module( "sparkCoreBrowserApp.controller-devices-detail", [] );


ctlMod.controller( "DevicesDetail", [ "$scope", "$rootScope", "$routeParams", "$interval", "Spark", "Error",
    function ( $scope, $rootScope, $routeParams, $interval, Spark, Error ) {

        $scope.deviceVariables = [];
        $scope.deviceFunctions = [];

        $scope.call = function ( device ) {

            $rootScope.$broadcast( "callRunning" );

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
                $rootScope.$broadcast( "callFinish", { type: "success" } );
            } );
        };

        var makeVariable = function ( name ) {

            var variable = {
                name: name,
                value: "",
                refresh: function () {
                    var self = this;
                    Spark.readVariable( {
                        id: $routeParams.deviceId,
                        name: self.name
                    }, function ( err, data ) {
                        self.value = data.result;
                    } );
                }
            };

            return variable;
        };

        var refreshVariables = function () {
            $scope.deviceVariables.map( function ( variable ) {
                variable.refresh();
            } );
        };

        Spark.readDetail( $routeParams.deviceId, function ( err, data ) {

            if ( err ) {
                return Error( err );
            }

            for ( var v in data.variables ) {
                if ( data.variables.hasOwnProperty( v ) ) {
                    $scope.deviceVariables.push( makeVariable( v ) );
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

            refreshVariables();
            $interval( refreshVariables, 10000 );

        } );

    } ] );
