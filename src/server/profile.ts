import { existsSync } from 'fs';
import { join } from 'path';
import mkdirp from 'mkdirp';

import { Profile } from '../common/types';
import { deleteFileAsync, readFileAsync, writeFileAsync } from './utils/async.utils';
import { parseConfig, serializeConfig, updateConfig } from './utils/config.utils';
import { downloadGravatarImage } from './utils/gravatar.utils';
import { CONFIG_PATH, IMAGES_PATH } from './utils/meta.utils';

export const getProfile = async (): Promise<Profile> => {
  return parseConfig(await readFileAsync(CONFIG_PATH)) as Profile;
};

export const updateProfile = async (profile: Profile) => {
  if (!existsSync(CONFIG_PATH)) {
    // prepare file contents from scratch
    await writeFileAsync(CONFIG_PATH, serializeConfig(profile));
  } else {
    // read and replace contents
    const updated = updateConfig(profile, await readFileAsync(CONFIG_PATH));
    await writeFileAsync(CONFIG_PATH, serializeConfig(updated));
  }
};

export const getProfileImagePath = async (email?: string, size = 16, force = false): Promise<string> => {
  // use the fallback
  const fallback = join(__dirname, 'assets/icon/tray@1.png');
  if (email === undefined) {
    return fallback;
  }

  // prepare temp image path
  const imagePath = join(IMAGES_PATH, `${ email }@${ size }.png`);

  // use existing image (unless regeneration is enforced)
  if (existsSync(imagePath)) {
    if (!force) {
      return imagePath;
    }
    await deleteFileAsync(imagePath);
  }

  // prepare target directory (if necessary)
  await mkdirp(IMAGES_PATH);

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
  return `data:image/png;charset=utf-8;base64,${ imageBlob }`;
};
