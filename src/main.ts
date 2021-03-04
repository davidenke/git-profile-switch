import { join } from 'path';
import { app, BrowserWindow, Tray } from 'electron';
import { is } from 'electron-util';

import { createTray } from './server/tray';
import { createWindow, toggleWindow } from './server/window';
import { registerActions } from './server/actions';

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let tray: Tray;
let window: BrowserWindow;

// Don't show the app in the dock
app.dock.hide();

// Initialize tray and detail window
app.on('ready', async () => {
  tray = await createTray(join(__dirname, 'assets/icon/tray@1.png'), () => toggleWindow(tray, window));
  window = await createWindow(is.development, 3333);

  // Register listeners for ipc events
  registerActions(tray, window);
});

