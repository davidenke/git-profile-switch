import { app, BrowserWindow, Menu, Tray } from 'electron';
import { is } from 'electron-util';

import { registerActions } from './server/actions';
import { updateProfile } from './server/profile';
import { createMenu } from './server/menu';
import { createTray } from './server/tray';
import { createWindow, toggleWindow } from './server/window';

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let window: BrowserWindow;
let tray: Tray;
let menu: Menu;

// Don't show the app in the dock
app.dock.hide();

// Initialize tray and detail window
app.on('ready', async () => {
  menu = await createMenu(
    profile => {
      updateProfile(profile);
      menu.items.forEach(item => item.checked = item.label === profile.user.email);
      tray.setContextMenu(menu);
    },
    () => toggleWindow(tray, window)
  );
  tray = await createTray();
  window = await createWindow(is.development, 3333);

  // register listeners for tray
  tray.on('right-click', () => toggleWindow(tray, window));

  // set profiles as menu
  tray.setContextMenu(menu);

  // register listeners for ipc events
  registerActions(tray, window);
});

