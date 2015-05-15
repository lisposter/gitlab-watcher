'use strict';

var app = require('app');
var Menu = require('menu');
var Tray = require('tray');
var BrowserWindow = require('browser-window');

var appIcon = null;
app.on('ready', function(){
  appIcon = new Tray('resources/icon.png');
  var contextMenu = Menu.buildFromTemplate([
    {
      label: 'Preferences',
      click: openConfig
    },
    {
      label: 'About GitLab App',
      selector: 'orderFrontStandardAboutPanel:'
    },
    {
      label: 'Quit',
      accelerator: 'Command+Q',
      click: function() { app.quit(); }
    }
  ]);
  appIcon.setToolTip('I am watching GitLab for you!');
  appIcon.setContextMenu(contextMenu);
});

var configWindow = null;
function openConfig() {
  configWindow = new BrowserWindow({width: 800, height: 600});

  configWindow.loadUrl('file://' + __dirname + '/index.html');

  configWindow.openDevTools();

  configWindow.on('closed', function() {
    configWindow = null;
  });
}
