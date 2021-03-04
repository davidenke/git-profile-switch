import { watch } from 'fs';
import { BrowserWindow, ipcMain, Tray } from 'electron';
import { Action, Profile } from '../types';
import { CONFIG_PATH, getProfile, updateProfile } from './profile';

export const registerActions = (tray: Tray, window: BrowserWindow) => {
  ipcMain.on(Action.GetAllProfiles, () => {
    window.webContents.send(Action.ReceiveAllProfiles, [
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
      }
    ] as Profile[]);
  });

  ipcMain.on(Action.GetCurrentProfile, async () => {
    const profile = await getProfile();
    tray.setTitle(profile?.user?.email);
    window.webContents.send(Action.ReceiveCurrentProfile, profile);
  });

  ipcMain.on(Action.SetCurrentProfile, async (_, profile: Profile) => {
    await updateProfile(profile);
    tray.setTitle(profile?.user?.email);
    window.webContents.send(Action.ReceiveCurrentProfile, profile);
  });

  // https://thisdavej.com/how-to-watch-for-files-changes-in-node-js/
  watch(CONFIG_PATH, async (event) => {
    if (event !== 'change') {
      return;
    }

    const profile = await getProfile();
    tray.setTitle(profile?.user?.email);
    window.webContents.send(Action.ReceiveCurrentProfile, profile);
  })

};
