import { Settings } from '../../common/types';
import { DEFAULT_SETTINGS, SETTINGS_PATH } from './meta.utils';
import { readFileAsync, writeFileAsync } from './async.utils';

export const mergeDefaultSettings = (settings: Settings): Settings => ({
  general: {
    ...DEFAULT_SETTINGS.general,
    ...settings.general
  },
  git: {
    ...DEFAULT_SETTINGS.git,
    ...settings.git
  },
  theme: {
    ...DEFAULT_SETTINGS.theme,
    ...settings.theme
  }
});

export const loadSettings = async (): Promise<Settings> => {
  const buffer = await readFileAsync(SETTINGS_PATH);
  const settings = JSON.parse(buffer.toString());
  return mergeDefaultSettings(settings);
};

export const saveSettings = async (settings: Settings): Promise<void> => {
  const data = JSON.stringify(mergeDefaultSettings(settings));
  await writeFileAsync(SETTINGS_PATH, data);
}
