var gui = require( "nw.gui" );

var svcMod = angular.module( "sparkCoreBrowserApp.service-gui", [] );


win = gui.Window.get();
var nativeMenuBar = new gui.Menu( { type: "menubar" } );
nativeMenuBar.createMacBuiltin( "Spark Manager" );
win.menu = nativeMenuBar;


svcMod.factory( "GUI", [ function () {

    return gui;

} ] );
