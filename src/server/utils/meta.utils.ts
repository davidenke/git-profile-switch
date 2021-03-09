import { app } from 'electron';
import { join } from 'path';

import { Settings } from '../../common/types';
import { appId } from '../../electron.json';

export const APP_ID = appId;
export const HOME_PATH = app.getPath('home');
export const TEMP_PATH = app.getPath('temp');

export const CONFIG_PATH = join(HOME_PATH, '.gitconfig');
export const IMAGES_PATH = join(TEMP_PATH, APP_ID, 'images');
export const SETTINGS_PATH = join(TEMP_PATH, APP_ID, 'settings.json');

export const DEFAULT_SETTINGS: Settings = {
  general: { autoStart: false },
  git: { editor: 'vim' },
  theme: { overrideSystem: false },
};
