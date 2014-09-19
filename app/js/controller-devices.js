var ctlMod = angular.module( "sparkCoreBrowserApp.controller-devices", [] );


ctlMod.controller( "Devices", [ "$scope", "$rootScope", "$interval", "Error", "Spark",
    function ( $scope, $rootScope, $interval, Error, Spark ) {

        $scope.devices = [];


        var refreshVariables = function () {
            $scope.detailVariables.map( function ( variable ) {
                variable.refresh();
            } );
        };


        $scope.call = function ( f ) {

            $rootScope.$broadcast( "callRunning" );

            Spark.callFunction( {
                id: f.deviceId,
                name: f.name,
                argsName: f.argsName,
                argsValue: f.argsValue
            }, function ( err, data ) {
                if ( err ) {
                    return Error( err );
                }
                $rootScope.$broadcast( "callFinish", { type: "success" } );
            } );
        };


        $scope.loadDetail = function ( device ) {

            $scope.detailVariables = [];
            $scope.detailFunctions = [];

            var makeVariable = function ( name ) {
                var variable = {
                    name: name,
                    value: "",
                    refresh: function () {
                        var self = this;
                        Spark.readVariable( {
                            id: device.id,
                            name: self.name
                        }, function ( err, data ) {
                            self.value = data.result;
                        } );
                    }
                };
                return variable;
            };

            if ( !device.connected ) {
                $scope.detail = device;
                return;
            }

            Spark.readDetail( device.id, function ( err, data ) {
                if ( err ) {
                    return Error( err );
                }
                for ( var v in data.variables ) {
                    if ( data.variables.hasOwnProperty( v ) ) {
                        $scope.detailVariables.push( makeVariable( v ) );
                    }
                }
                for ( var f = 0; f < data.functions.length; f++ ) {
                    $scope.detailFunctions.push( {
                        deviceId: device.id,
                        name: data.functions[ f ],
                        argsName: "",
                        argsValue: ""
                    } );
                }
                $scope.detail = data;

                refreshVariables();
                $interval( refreshVariables, 5000 );

            } );

        };


        $scope.confirmDelete = function () {

            $rootScope.$broadcast( "confirmDelete", { deviceId: $scope.detail.id } );

        };

        $scope.loadDeviceList = function () {
            Spark.listDevices( function ( err, data ) {
                if ( err ) {
                    return Error( err );
                }
                $scope.devices = data;
                $scope.loadDetail( $scope.devices[ 0 ] );
            } );
        };

        $scope.loadDeviceList();

    } ] );
