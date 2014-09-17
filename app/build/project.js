var angMod = angular.module( "sparkCoreBrowserApp", [
    "ngRoute",
    "sparkCoreBrowserApp.controller-main",
    "sparkCoreBrowserApp.controller-login",
    "sparkCoreBrowserApp.controller-devices-list",
    "sparkCoreBrowserApp.controller-devices-detail",
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
            templateUrl: "templates/devices-list.html",
            controller: "DevicesList"
        } );

        $routeProvider.when( "/devices/:deviceId", {
            templateUrl: "templates/devices-detail.html",
            controller: "DevicesDetail"
        } );

        $routeProvider.otherwise( {
            redirectTo: "/login"
        } );

} ] );

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

var ctlMod = angular.module( "sparkCoreBrowserApp.controller-login", [] );


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

        };

    } ] );

var ctlMod = angular.module( "sparkCoreBrowserApp.controller-main", [] );


ctlMod.controller( "Main", [ "$scope", "$rootScope", "$location", "$timeout",
    function ( $scope, $rootScope, $location, $timeout ) {

        $scope.isActiveNavItem = function ( view ) {

            return view === $location.path();

        };

        $scope.$on( "error", function ( e, args ) {

            $rootScope.errorMessage = args.message;

        } );

        $scope.$on( "authSuccess", function () {

            $location.path( "/devices" );

        } );

        $scope.$on( "callRunning", function () {

            $rootScope.callRunning = true;
            console.log( "running" );

        } );

        $scope.$on( "callFinish", function ( e, args ) {

            $rootScope.callSuccess = args.type == "success";
            $rootScope.callRunning = false;
            console.log( "finish" );

            $timeout( function () {
                $rootScope.callSuccess = false;
            }, 2000 );

        } );

        $rootScope.callSuccess = false;
        $rootScope.callRunning = false;

    } ] );

var gui = require( "nw.gui" );

var svcMod = angular.module( "sparkCoreBrowserApp.services", [] );


win = gui.Window.get();
var nativeMenuBar = new gui.Menu( { type: "menubar" } );
nativeMenuBar.createMacBuiltin( "Spark Manager" );
win.menu = nativeMenuBar;


svcMod.factory( "GUI", [ function () {

    return gui;

} ] );

var svcMod = angular.module( "sparkCoreBrowserApp.services", [] );


svcMod.factory( "Error", [ "$rootScope", function ( $rootScope ) {

    return function ( err ) {
        console.log( err );
        return $rootScope.$broadcast( "error", {
            message: err.data.error_description
        } );
    };

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

    var makeRequest = function ( options, callback ) {
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

        return makeRequest( options, callback );

    };

    var formRequest = function ( method, path, requestData, callback ) {

        var headers = {
            "Content-Type": "application/x-www-form-urlencoded"
        };

        if ( $window.sessionStorage.token ) {
            headers.Authorization = "Bearer " + $window.sessionStorage.token;
        }

        var options = {
            method: method,
            url: path,
            headers: headers,
            data: $.param( requestData )
        };

        return makeRequest( options, callback );

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
        },
        $postForm: function ( path, requestData, callback ) {
            return formRequest( 'POST', path, requestData, callback );
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
        listDevices: function ( callback ) {
            return API.$get( apiBase + "/v1/devices", callback );
        },
        readDetail: function ( id, callback ) {
            return API.$get( apiBase + "/v1/devices/" + id, callback );
        },
        readVariable: function ( options, callback ) {
            var url = apiBase + "/v1/devices/" + options.id + "/" + options.name;
            return API.$get( url, callback );
        },
        callFunction: function ( options, callback ) {
            var url = apiBase + "/v1/devices/" + options.id + "/" + options.name;
            var postData = {};
            postData[ options.argsName ] = options.argsValue;
            return API.$postForm( url, postData, callback );
        }
    };

} ] );
