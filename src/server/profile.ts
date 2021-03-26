import { existsSync, readFileSync } from 'fs';
import { extname, join } from 'path';
import { sync as glob } from 'glob';
import mkdirp from 'mkdirp';
import Store from 'electron-store';

import { Profile } from '../common/types';
import { deleteFileAsync, readFileAsync, writeFileAsync } from './utils/async.utils';
import { parseConfig, serializeConfig, updateConfig } from './utils/config.utils';
import { downloadGravatarImage } from './utils/gravatar.utils';
import { CONFIG_PATH, IMAGES_PATH } from './utils/meta.utils';

const store = new Store<{ profiles: Profile[] }>({
  defaults: {
    profiles: [
      parseConfig(readFileSync(CONFIG_PATH)) as Profile
    ]
  }
});

export const getProfiles = async (): Promise<Profile[]> => {
  return store.get('profiles');
};

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

export const getProfileImagePath = async (email?: string, size = 16, force = false): Promise<{ path: string; mime: string; }> => {
  // use the fallback
  const fallback = join(__dirname, 'assets/icon/tray@1.png');
  if (email === undefined) {
    return { path: fallback, mime: 'image/png' };
  }

  // prepare temp image path
  const [imagePath] = glob(join(IMAGES_PATH, `${ email }@${ size }.*`));

  // use existing image (unless regeneration is enforced)
  if (imagePath !== undefined) {
    if (!force) {
      const mime = `image/${ extname(imagePath).substr(1) }`;
      return { path: imagePath, mime };
    }
    await deleteFileAsync(imagePath);
  }

  // prepare target directory (if necessary)
  await mkdirp(IMAGES_PATH);

  // fetch temp image from gravatar (if existing)
  try {
    const { buffer, mime } = await downloadGravatarImage(email, size);
    const [, type] = mime.split('/');
    const path = join(IMAGES_PATH, `${ email }@${ size }.${ type }`);
    await writeFileAsync(path, buffer);
    return { path, mime };
  } catch (e) {
    return { path: fallback, mime: 'image/png' };
  }
};

export const getProfileImage = async (email?: string, size?: number, force = false): Promise<string> => {
  const { path, mime } = await getProfileImagePath(email, size, force);
  const imageBlob = await readFileAsync(path, 'base64');
  return `data:${ mime };charset=utf-8;base64,${ imageBlob }`;
};
