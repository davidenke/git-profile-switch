import { existsSync } from 'fs';
import { join } from 'path';

import { app } from 'electron';
import { flatten } from 'flat';
import mkdirp from 'mkdirp';
import { Config, sync as parseConfig } from 'parse-git-config';

import { Profile } from '../common/types';
import { deleteFileAsync, execAsync, readFileAsync, writeFileAsync } from './utils/async.utils';
import { downloadGravatarImage } from './utils/gravatar.utils';
import { APP_ID, CONFIG_PATH } from './utils/meta.utils';

export const getProfile = async (): Promise<Profile> => {
  const profile = parseConfig({ cwd: '/', path: CONFIG_PATH });
  return profile as Profile;
};

export const updateProfile = async (profile: Profile) => {
  const config: Config = flatten(profile);
  for await (let key of Object.keys(config)) {
    await execAsync(`git config --global ${key} "${config[key]}"`);
  }
};

export const getProfileImagePath = async (email?: string, size = 16, force = false): Promise<string> => {
  // use the fallback
  const fallback = join(__dirname, 'assets/icon/tray@1.png');
  if (email === undefined) {
    return fallback;
  }

  // prepare temp image path
  const tempDir = app.getPath('temp');
  const imageDir = join(tempDir, APP_ID, 'images');
  const imagePath = join(imageDir, `${email}@${size}.png`);

  // use existing image (unless regeneration is enforced)
  if (existsSync(imagePath)) {
    if (!force) {
      return imagePath;
    }
    await deleteFileAsync(imagePath);
  }

  // prepare target directory (if necessary)
  await mkdirp(imageDir);

  // fetch temp image from gravatar (if existing)
  try {
    const buffer = await downloadGravatarImage(email, size);
    await writeFileAsync(imagePath, buffer);
    return imagePath;
  } catch (e) {
    return fallback;
  }
};

export const getProfileImage = async (email?: string, size?: number, force = false): Promise<string> => {
  const imagePath = await getProfileImagePath(email, size, force);
  const imageBlob = await readFileAsync(imagePath, 'base64');
  return `data:image/png;charset=utf-8;base64,${imageBlob}`;
};
