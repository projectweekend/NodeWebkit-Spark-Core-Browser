var angMod = angular.module( "sparkCoreBrowserApp", [
    "ngRoute",
    "sparkCoreBrowserApp.controllers",
    "sparkCoreBrowserApp.services"
] );


angMod.config( [
    "$routeProvider",
    "$locationProvider",
    "$sceDelegateProvider",
    function ( $routeProvider, $locationProvider, $sceDelegateProvider ) {

        $routeProvider.when( "/login", {
            templateUrl: "templates/login.html",
            controller: "Login"
        } );

        $routeProvider.when( "/devices", {
            templateUrl: "templates/devices.html",
            controller: "Devices"
        } );

        $routeProvider.otherwise( {
            redirectTo: "/login"
        } );

} ] );

var ctlMod = angular.module( "sparkCoreBrowserApp.controllers", [] );


ctlMod.controller( "Main", [ "$scope", "$rootScope", "$location",
    function ( $scope, $rootScope, $location ) {

        $scope.isActiveNavItem = function ( view ) {

            return view === $location.path();

        };

        $scope.$on( "error", function ( e, args ) {

            $scope.errorMessage = args.message;

        } );

        $scope.$on( "authSuccess", function () {

            $location.path( "/devices" );

        } );

    } ] );


ctlMod.controller( "Login", [ "$scope", "$rootScope", "$window", "Spark",
    function ( $scope, $rootScope, $window, Spark ) {

        $scope.submitted = false;

        var loginCallback = function ( err, data ) {

            if ( err ) {
                return $rootScope.$broadcast( "error", {
                    message: err.data.error_description
                } );
            }
            $window.sessionStorage.token = data.access_token;
            return $rootScope.$broadcast( "authSuccess" );

        };

        $scope.login = function () {

            if ( $scope.loginForm.$valid ) {
                return Spark.authenticate( {
                    username: $scope.username,
                    password: $scope.password
                }, loginCallback );
            }
            $scope.submitted = true;

        };

    } ] );


ctlMod.controller( "Devices", [ "$scope", "$rootScope", "Spark",
    function ( $scope, $rootScope, Spark ) {

    } ] );

var svcMod = angular.module( "sparkCoreBrowserApp.services", [] );


svcMod.factory( "GUI", [ function () {

    var gui = require('nw.gui');

    return gui;

} ] );


svcMod.factory( 'Base64', function () {
    var keyStr = 'ABCDEFGHIJKLMNOP' +
        'QRSTUVWXYZabcdef' +
        'ghijklmnopqrstuv' +
        'wxyz0123456789+/' +
        '=';

    return {
        encode: function ( input ) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;

            do {
                chr1 = input.charCodeAt( i++ );
                chr2 = input.charCodeAt( i++ );
                chr3 = input.charCodeAt( i++ );

                enc1 = chr1 >> 2;
                enc2 = ( ( chr1 & 3 ) << 4 ) | ( chr2 >> 4 );
                enc3 = ( ( chr2 & 15 ) << 2 ) | ( chr3 >> 6 );
                enc4 = chr3 & 63;

                if ( isNaN( chr2 ) ) {
                    enc3 = enc4 = 64;
                } else if ( isNaN( chr3 ) ) {
                    enc4 = 64;
                }

                output = output +
                    keyStr.charAt( enc1 ) +
                    keyStr.charAt( enc2 ) +
                    keyStr.charAt( enc3 ) +
                    keyStr.charAt( enc4 );
                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";
            } while ( i < input.length );

            return output;
        },

        decode: function ( input ) {
            var output = "";
            var chr1, chr2, chr3 = "";
            var enc1, enc2, enc3, enc4 = "";
            var i = 0;

            // remove all characters that are not A-Z, a-z, 0-9, +, /, or =
            var base64test = /[^A-Za-z0-9\+\/\=]/g;
            if ( base64test.exec( input ) ) {
                alert( "There were invalid base64 characters in the input text.\n" +
                    "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" +
                    "Expect errors in decoding." );
            }
            input = input.replace( /[^A-Za-z0-9\+\/\=]/g, "" );

            do {
                enc1 = keyStr.indexOf( input.charAt( i++ ) );
                enc2 = keyStr.indexOf( input.charAt( i++ ) );
                enc3 = keyStr.indexOf( input.charAt( i++ ) );
                enc4 = keyStr.indexOf( input.charAt( i++ ) );

                chr1 = ( enc1 << 2 ) | ( enc2 >> 4 );
                chr2 = ( ( enc2 & 15 ) << 4 ) | ( enc3 >> 2 );
                chr3 = ( ( enc3 & 3 ) << 6 ) | enc4;

                output = output + String.fromCharCode( chr1 );

                if ( enc3 != 64 ) {
                    output = output + String.fromCharCode( chr2 );
                }
                if ( enc4 != 64 ) {
                    output = output + String.fromCharCode( chr3 );
                }

                chr1 = chr2 = chr3 = "";
                enc1 = enc2 = enc3 = enc4 = "";

            } while ( i < input.length );

            return output;
        }
    };
});


svcMod.factory( 'API', [ "$http", "$window", function ( $http, $window ) {

    var apiRequest = function ( method, path, requestData, callback ) {

        var headers = {
            "Content-Type": "application/json"
        };

        if ( $window.sessionStorage.token ) {
            headers.Authorization = "Bearer " + $window.sessionStorage.token;
        }

        var options = {
            method: method,
            url: path,
            headers: headers,
            data: requestData
        };

        $http( options )
            .success( function ( data, status, headers, config ) {

                callback( null, data );

            } )
            .error( function ( data, status, headers, config ) {

                var error = {
                    data: data,
                    status: status
                };

                callback( error, null );

            } );

    };

    return {
        $get: function ( path, callback ) {
            return apiRequest( 'GET', path, {}, callback );
        },
        $post: function ( path, requestData, callback ) {
            return apiRequest( 'POST', path, requestData, callback );
        },
        $put: function ( path, requestData, callback ) {
            return apiRequest( 'PUT', path, requestData, callback );
        },
        $patch: function ( path, requestData, callback ) {
            return apiRequest( 'PATCH', path, requestData, callback );
        },
        $delete: function ( path, callback ) {
            return apiRequest( 'DELETE', path, {}, callback );
        }
    };

} ] );


svcMod.factory( "Spark", [ "$http", "API", "Base64",
    function ( $http, API, Base64 ) {

    var apiBase = "https://api.spark.io";

    return {
        authenticate: function ( options, callback ) {

            var authUserEncoded = Base64.encode( "spark:spark" );

            $http( {
                method: "POST",
                url: apiBase + "/oauth/token",
                headers: {
                    "Authorization": "Basic " + authUserEncoded,
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                data: $.param( {
                    grant_type: "password",
                    username: options.username,
                    password: options.password
                } )
            } )
            .success( function ( data, status, headers, config ) {

                return callback( null, data );

            } )
            .error( function ( data, status, headers, config ) {

                var error = {
                    data: data,
                    status: status
                };

                callback( error, null );

            } );
        },
        devices: function ( callback ) {

            return API.$get( apiBase + "/v1/devices", callback );

        }
    };

} ] );
