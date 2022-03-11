import { watch } from 'fs';
import { BrowserWindow, ipcMain, Menu, Tray } from 'electron';

import { Subject } from '../common/types';
import { CONFIG_PATH, SETTINGS_PATH } from './utils/meta.utils';
import { generateId } from './utils/request.utils';
import { loadSettings, openSettings, saveSettings, showSettings, hideSettings, editingProfileId } from './utils/settings.utils';

import { updateTray } from './tray';
import { getProfile, getProfileImage, getProfiles, updateProfile } from './profile';
import { updateMenu } from './menu';

export const registerActions = (tray: Tray, window: BrowserWindow, onMenuUpdated: (menu: Menu) => void) => {
  ipcMain.on(Subject.AllProfiles, async (_, { id, type }) => {
    const payload = await getProfiles();
    window.webContents.send(Subject.AllProfiles, { id, type, payload });
  });

  ipcMain.on(Subject.CurrentProfile, async (_, { id, type, payload }) => {
    if (type === 'get') {
      const profile = await getProfile();
      await updateTray(tray, profile);
      window.webContents.send(Subject.CurrentProfile, { id, type, payload: profile });
    } else if (type === 'set' && payload !== undefined) {
      await updateProfile(payload);
      await updateTray(tray, payload);
      window.webContents.send(Subject.CurrentProfile, { id, type, payload });
    }
  });

  ipcMain.on(Subject.ProfileImage, async (_, { id, type, payload: { email, size } }) => {
    const image = await getProfileImage(email, size);
    window.webContents.send(Subject.ProfileImage, { id, type, payload: image });
  });

  ipcMain.on(Subject.Ping, async (_, { id, type }) => {
    window.webContents.send(Subject.Ping, { id, type, payload: +new Date() });
  });

  ipcMain.on(Subject.Settings, async (_, { id, type, payload }) => {
    if (type === 'get') {
      const settings = await loadSettings();
      window.webContents.send(Subject.Settings, { id, type, payload: settings });
    } else if (type === 'set' && payload !== undefined) {
      await saveSettings(payload);
      const profiles = await getProfiles();
      const currentProfile = await getProfile();
      onMenuUpdated(await updateMenu(profiles, currentProfile));
      window.webContents.send(Subject.Settings, { id, type, payload });
    }
  });

  ipcMain.on(Subject.ShowSettings, async (_, { id, type, payload }) => {
    if (type === 'get') {
      window.webContents.send(Subject.ShowSettings, { id, type, payload: editingProfileId });
    } else if (type === 'set') {
      showSettings(window, payload);
      window.webContents.send(Subject.ShowSettings, { id, type, payload });
    }
  });

  ipcMain.on(Subject.HideSettings, async (_, { id, type }) => {
    if (type === 'get') {
      window.webContents.send(Subject.HideSettings, { id, type });
    } else if (type === 'set') {
      hideSettings(window);
      window.webContents.send(Subject.ShowSettings, { id, type });
    }
  });

  ipcMain.on(Subject.OpenSettings, () => openSettings());

  // https://thisdavej.com/how-to-watch-for-files-changes-in-node-js/
  watch(CONFIG_PATH, async event => {
    if (event !== 'change') {
      return;
    }

    const profile = await getProfile();
    await updateTray(tray, profile);
    window.webContents.send(Subject.CurrentProfile, { id: generateId(), type: 'get', payload: profile });
  });

  watch(SETTINGS_PATH, async event => {
    if (event !== 'change') {
      return;
    }

    const settings = await loadSettings();
    window.webContents.send(Subject.Settings, { id: generateId(), type: 'get', payload: settings });
  });
};
