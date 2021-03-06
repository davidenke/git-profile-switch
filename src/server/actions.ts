import { watch } from 'fs';
import { BrowserWindow, ipcMain, Tray } from 'electron';

import { Profile, Subject } from '../common/types';
import { CONFIG_PATH } from './utils/meta.utils';

import { updateTray } from './tray';
import { getProfile, getProfileImage, updateProfile } from './profile';
import { generateId } from './utils/request.utils';

export const registerActions = (tray: Tray, window: BrowserWindow) => {
  ipcMain.on(Subject.AllProfiles, (_, { id, type }) => {
    const payload = [
      {
        user: {
          email: 'david@enke.dev',
          name: 'David Enke'
        }
      },
      {
        user: {
          email: 'post@davidenke.de',
          name: 'David Enke'
        }
      },
      {
        user: {
          email: 'david.enke@zalari.de',
          name: 'David Enke'
        }
      },
      {
        user: {
          email: 'david.enke.ext@zeiss.com',
          name: 'David Enke'
        }
      }
    ] as Profile[];
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

  // https://thisdavej.com/how-to-watch-for-files-changes-in-node-js/
  watch(CONFIG_PATH, async (event) => {
    if (event !== 'change') {
      return;
    }

    const profile = await getProfile();
    await updateTray(tray, profile);
    window.webContents.send(Subject.CurrentProfile, { id: generateId(), type: 'get', payload: profile });
  });

};
