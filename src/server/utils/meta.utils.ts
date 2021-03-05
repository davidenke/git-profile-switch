import { default as getConfigPath } from 'git-config-path';

export { appId as APP_ID } from '../../electron.json';
export const CONFIG_PATH = getConfigPath('global');
