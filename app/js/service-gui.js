var gui = require( "nw.gui" );

var svcMod = angular.module( "sparkCoreBrowserApp.service-gui", [] );


var nativeMenuBar = new gui.Menu( { type: "menubar" } );
nativeMenuBar.createMacBuiltin( "Spark Manager" );

var win = gui.Window.get();
win.menu = nativeMenuBar;


svcMod.factory( "GUI", [ function () {

    return gui;

} ] );
