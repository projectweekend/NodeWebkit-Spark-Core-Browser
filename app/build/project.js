var angMod = angular.module( "sparkCoreBrowserApp", [
    "ngRoute",
    "sparkCoreBrowserApp.controller-main",
    "sparkCoreBrowserApp.controller-login",
    "sparkCoreBrowserApp.controller-devices",
    "sparkCoreBrowserApp.controller-claim-device",
    "sparkCoreBrowserApp.controller-confirm-delete",
    "sparkCoreBrowserApp.service-error",
    "sparkCoreBrowserApp.service-spark-core",
    "sparkCoreBrowserApp.service-gui"
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

        $routeProvider.when( "/devices/:deviceId/confirm-delete", {
            templateUrl: "templates/confirm-delete.html",
            controller: "ConfirmDelete"
        } );

        $routeProvider.when( "/claim-device", {
            templateUrl: "templates/claim-device.html",
            controller: "ClaimDevice"
        } );

        $routeProvider.otherwise( {
            redirectTo: "/login"
        } );

} ] );

var ctlMod = angular.module("sparkCoreBrowserApp.controller-claim-device", [] );


ctlMod.controller( "ClaimDevice", [ "$scope", "$rootScope", "Error", "Spark",
    function ( $scope, $rootScope, Error, Spark ) {

        $scope.claim = function () {

            $rootScope.$broadcast( "callRunning" );

            var success = function ( data ) {
                if ( typeof data.errors !== "undefined" ) {
                    return Error( data );
                }
                $rootScope.$broadcast( "claimDeleteSuccess" );
            };

            var failure = function ( err ) {
                return Error( err );
            };

            Spark.claimDevice( $scope.coreId ).then( success, failure );
        };

    } ] );

var ctlMod = angular.module( "sparkCoreBrowserApp.controller-confirm-delete", [] );


ctlMod.controller( "ConfirmDelete", [ "$scope", "$rootScope", "$routeParams", "Spark",
    function ( $scope, $rootScope, $routeParams, Spark ) {

        $scope.listDevices = function () {
            $rootScope.$broadcast( "goToDevices" );
        };


        $scope.deleteDevice = function () {

            $rootScope.$broadcast( "callRunning" );

            var success = function ( data ) {

                if ( typeof data.errors !== "undefined" ) {
                    return Error( data );
                }
                $rootScope.$broadcast( "claimDeleteSuccess" );
            };

            var failure = function ( err ) {

                return $rootScope.$broadcast( "error", {
                    message: err.message
                } );

            };

            Spark.removeDevice( $routeParams.deviceId ).then( success, failure );
        };

    } ] );

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
            return $rootScope.$broadcast( "goToDevices" );

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


ctlMod.controller( "Main", [ "$scope", "$rootScope", "$location", "$timeout", "GUI",
    function ( $scope, $rootScope, $location, $timeout, GUI ) {

        $scope.isActiveNavItem = function ( view ) {

            return view === $location.path();

        };


        $scope.$on( "error", function ( e, args ) {

            $rootScope.callRunning = false;
            $rootScope.errorMessage = args.message;

        } );


        $scope.$on( "goToDevices", function () {

            $location.path( "/devices" );

        } );


        $scope.$on( "claimDevice", function () {

            $scope.$apply( function () {
                $location.path( "/claim-device" );
            } );

        } );


        $scope.$on( "confirmDelete", function ( e, args ) {

            $location.path( "/devices/" + args.deviceId + "/confirm-delete" );

        } );


        $scope.$on( "claimDeleteSuccess", function () {

            $rootScope.callRunning = false;
            $location.path( "/devices" );

        } );


        $scope.$on( "callRunning", function () {

            $rootScope.callRunning = true;

        } );


        $scope.$on( "callFinish", function ( e, args ) {

            $rootScope.callSuccess = args.type == "success";
            $rootScope.callRunning = false;

            $timeout( function () {
                $rootScope.callSuccess = false;
            }, 2000 );

        } );


        $rootScope.callSuccess = false;
        $rootScope.callRunning = false;

    } ] );

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

var gui = require( "nw.gui" );

var svcMod = angular.module( "sparkCoreBrowserApp.service-gui", [] );


var nativeMenuBar = new gui.Menu( { type: "menubar" } );
nativeMenuBar.createMacBuiltin( "Spark Core Manager" );

var win = gui.Window.get();
win.menu = nativeMenuBar;

var fileMenu = new gui.Menu();
var helpMenu = new gui.Menu();

win.menu.insert( new gui.MenuItem( { label: "File", submenu: fileMenu } ), 1 );
win.menu.append( new gui.MenuItem( { label: "Help", submenu: helpMenu } ) );



svcMod.factory( "GUI", [ "$rootScope", function ( $rootScope ) {

    var newCoreOptions = {
        label: "New Core",
        click: function () {
            $rootScope.$broadcast( "claimDevice" );
        },
        key: "n",
        modifiers: "cmd"
    };

    fileMenu.append( new gui.MenuItem( newCoreOptions ) );

    return gui;

} ] );

var spark = require( "spark" );


var svcMod = angular.module( "sparkCoreBrowserApp.service-spark-core", [] );


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


svcMod.factory( "Spark", [ "$http", "$q", "API", "Base64",
    function ( $http, $q, API, Base64 ) {

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

                spark.login( { accessToken: data.access_token } );

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
        claimDevice: function ( id ) {
            var deferred = $q.defer();

            var success = function ( data ) {
                return deferred.resolve( data );
            };

            var failure = function ( err ) {
                return deferred.reject( err );
            };

            spark.claimCore( id ).then( success, failure );

            return deferred.promise;
        },
        removeDevice: function ( id ) {
            var deferred = $q.defer();

            var success = function ( data ) {
                return deferred.resolve( data );
            };

            var failure = function ( err ) {
                return deferred.reject( err );
            };

            spark.removeCore( id ).then( success, failure );

            return deferred.promise;
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
