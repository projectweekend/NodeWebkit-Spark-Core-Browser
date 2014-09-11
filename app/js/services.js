var spark = require( "spark" );

var svcMod = angular.module( "sparkCoreBrowserApp.services", [] );


svcMod.factory( "GUI", [ function () {

    var gui = require('nw.gui');

    return gui;

} ] );


svcMod.factory( "Spark", [ function (  ) {

    return spark;

} ] );
