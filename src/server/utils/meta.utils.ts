import { app } from 'electron';
import { join } from 'path';

export { appId as APP_ID } from '../../electron.json';

export const HOME_PATH = app.getPath('home');
export const CONFIG_PATH = join(HOME_PATH, '.gitconfig');
