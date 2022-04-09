import { app } from 'electron';
import { join } from 'path';

import type { Settings } from '../../common/types';
import { appId } from '../../electron.json';

export const APP_ID = appId;
export const HOME_PATH = app.getPath('home');
export const TEMP_PATH = app.getPath('temp');

export const CONFIG_PATH = join(HOME_PATH, '.gitconfig');
export const SETTINGS_PATH = join(HOME_PATH, '.git-profile-switch.settings.json');
export const IMAGES_PATH = join(TEMP_PATH, APP_ID, 'images');

export const DEFAULT_SETTINGS: Settings = {
  general: {
    autoStart: false,
    theme: { overrideSystem: false },
  },
  profiles: {},
};
