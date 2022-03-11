import { Settings } from '../../common/types';
import { DEFAULT_SETTINGS, SETTINGS_PATH } from './meta.utils';
import { readFileAsync, writeFileAsync } from './async.utils';
import { existsSync } from 'fs';
import { openWithCommand } from '../../ui/utils/platform.utils';
import { BrowserWindow } from 'electron';
import { WINDOW_WIDTH, WINDOW_HEIGHT_EXPANDED, WINDOW_HEIGHT_DEFAULT } from '../window';

export const mergeDefaultSettings = (settings: Partial<Settings>): Settings => ({
  general: {
    ...DEFAULT_SETTINGS.general,
    ...settings.general,
    theme: {
      ...DEFAULT_SETTINGS.general.theme,
      ...settings.general?.theme,
    },
  },
  profiles: {
    ...DEFAULT_SETTINGS.profiles,
    ...settings.profiles,
  },
});

export let editingProfileId: string | undefined;
export const showSettings = (window: BrowserWindow, profileId: string) => {
  editingProfileId = profileId;
  window.setSize(WINDOW_WIDTH, WINDOW_HEIGHT_EXPANDED, true);
};
export const hideSettings = (window: BrowserWindow) => {
  editingProfileId = undefined;
  window.setSize(WINDOW_WIDTH, WINDOW_HEIGHT_DEFAULT, true);
};

export const loadSettings = async (): Promise<Settings> => {
  if (!existsSync(SETTINGS_PATH)) {
    return mergeDefaultSettings({});
  }
  const buffer = await readFileAsync(SETTINGS_PATH);
  let settings = {};
  try {
    settings = JSON.parse(buffer.toString());
  } catch (error) {
    // do not handle invalid settings file
  }
  return mergeDefaultSettings(settings);
};

export const saveSettings = async (settings: Settings): Promise<void> => {
  const data = JSON.stringify(mergeDefaultSettings(settings), null, 2);
  await writeFileAsync(SETTINGS_PATH, data);
};

export const openSettings = () => openWithCommand(SETTINGS_PATH);
