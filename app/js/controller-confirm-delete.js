var ctlMod = angular.module( "sparkCoreBrowserApp.controller-confirm-delete", [] );


ctlMod.controller( "ConfirmDelete", [ "$scope", "$rootScope",
    function ( $scope, $rootScope ) {

        $scope.listDevices = function () {
            $rootScope.$broadcast( "goToDevices" );
        };

    } ] );
