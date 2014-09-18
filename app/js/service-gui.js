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
