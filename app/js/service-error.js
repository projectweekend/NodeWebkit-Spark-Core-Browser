var svcMod = angular.module( "sparkCoreBrowserApp.service-error", [] );


svcMod.factory( "Error", [ "$rootScope", function ( $rootScope ) {

    return function ( err ) {
        var errorMessage = "";

        if ( typeof err.data !== "undefined" && err.data.error_description !== "undefined" ) {
            errorMessage = err.data.error_description;
        } else if ( typeof err.errors !== "undefined" ) {
            errorMessage = err.errors[ 0 ];
        } else {
            errorMessage = "An error occurred";
        }

        return $rootScope.$broadcast( "error", {
            message: errorMessage
        } );
    };

} ] );
