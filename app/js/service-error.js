var svcMod = angular.module( "sparkCoreBrowserApp.service-error", [] );


svcMod.factory( "Error", [ "$rootScope", function ( $rootScope ) {

    return function ( err ) {
        console.log( err );
        return $rootScope.$broadcast( "error", {
            message: err.data.error_description
        } );
    };

} ] );
