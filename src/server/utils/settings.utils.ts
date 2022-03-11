import { Settings } from '../../common/types';
import { DEFAULT_SETTINGS, SETTINGS_PATH } from './meta.utils';
import { readFileAsync, writeFileAsync } from './async.utils';
import { existsSync } from 'fs';
import { openWithCommand } from '../../ui/utils/platform.utils';

export const mergeDefaultSettings = (settings: Settings): Settings => ({
  general: {
    ...DEFAULT_SETTINGS.general,
    ...settings.general,
  },
  git: {
    ...DEFAULT_SETTINGS.git,
    ...settings.git,
  },
  theme: {
    ...DEFAULT_SETTINGS.theme,
    ...settings.theme,
  },
});

export let showSettings: boolean = false;
export const toggleSettings = (visible: boolean) => (showSettings = visible);

export const loadSettings = async (): Promise<Settings> => {
  if (!existsSync(SETTINGS_PATH)) {
    return mergeDefaultSettings({} as Settings);
  }
  const buffer = await readFileAsync(SETTINGS_PATH);
  const settings = JSON.parse(buffer.toString());
  return mergeDefaultSettings(settings);
};

export const saveSettings = async (settings: Settings): Promise<void> => {
  const data = JSON.stringify(mergeDefaultSettings(settings), null, 2);
  await writeFileAsync(SETTINGS_PATH, data);
};

export const openSettings = () => openWithCommand(SETTINGS_PATH);
