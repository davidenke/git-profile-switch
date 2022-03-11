import { resolve } from 'path';

import { app, BrowserWindow, Menu, Tray } from 'electron';
import { is } from 'electron-util';

import { registerActions } from './server/actions';
import { getProfile, getProfiles, updateProfile } from './server/profile';
import { createMenu } from './server/menu';
import { createTray } from './server/tray';
import { createWindow, showWindow } from './server/window';
import { Subject } from './common/types';
import { generateId } from './server/utils/request.utils';
import { showSettings } from './server/utils/settings.utils';

// configure reload behaviour in development environment
// https://github.com/yan-foto/electron-reload
if (is.development) {
  import('electron-reload').then(module => {
    const electron = resolve(__dirname, '../', 'node_modules', '.bin', 'electron');
    module.default(__dirname, { electron });
  });
}

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
    // activate clicked profile
    profile => {
      updateProfile(profile);
      menu.items.forEach(item => (item.checked = item.label === profile.user.email));
      tray.setContextMenu(menu);
    },
    // create new profile
    () => {
      showSettings(window, '');
      showWindow(tray, window);
      window.webContents.send(Subject.ShowSettings, { id: generateId(), type: 'set', payload: '' });
    },
    // open settings
    async () => {
      const { user } = await getProfile();
      showSettings(window, user.email);
      showWindow(tray, window);
      window.webContents.send(Subject.ShowSettings, { id: generateId(), type: 'set', payload: user.email });
    },
  );
  tray = await createTray();
  window = await createWindow(is.development, 3333);

  // register listeners for tray
  tray.on('right-click', async () => {
    const { user } = await getProfile();
    showSettings(window, user.email);
    showWindow(tray, window);
    window.webContents.send(Subject.ShowSettings, { id: generateId(), type: 'set', payload: user.email });
  });

  // set profiles as menu
  tray.setContextMenu(menu);

  // register listeners for ipc events
  registerActions(tray, window);
});
