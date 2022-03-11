import { Settings } from '../../common/types';
import { DEFAULT_SETTINGS, SETTINGS_PATH } from './meta.utils';
import { readFileAsync, writeFileAsync } from './async.utils';
import { existsSync } from 'fs';
import { openWithCommand } from '../../ui/utils/platform.utils';

export const mergeDefaultSettings = (settings: Partial<Settings>): Settings => ({
  general: {
    ...DEFAULT_SETTINGS.general,
    ...settings.general,
    theme: {
      ...DEFAULT_SETTINGS.general.theme,
      ...settings.general.theme,
    },
  },
  profiles: {
    ...DEFAULT_SETTINGS.profiles,
    ...settings.profiles,
  },
});

export let showSettings: boolean = false;
export const toggleSettings = (visible: boolean) => (showSettings = visible);

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
