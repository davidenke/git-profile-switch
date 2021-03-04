import { createWriteStream } from 'fs';
import { join } from 'path';
import { app, Tray } from 'electron';
import jimp from 'jimp';

import { Profile } from '../types';
import { downloadGravatarImage } from '../utils/gravatar.utils';
import { getProfile } from './profile';

export const createTray = async (icon: string, onClick: () => void = () => null): Promise<Tray> => {
  const tray = new Tray(join(icon));
  tray.on('click', () => onClick());
  const profile = await getProfile();
  await updateTray(tray, profile);
  return tray;
};

export const updateTray = async (tray: Tray, profile: Profile) => {
  // shorthand title to space with some prefix...
  const setTitle = (email: string) => tray.setTitle(` ${ email }`);
  const setImage = (image: string) => tray.setImage(image);

  // use the fallback
  const fallback = join(__dirname, '../assets/icon/tray@1.png');
  if (profile?.user?.email === undefined) {
    setTitle('unknown');
    setImage(fallback);
    return;
  }

  // update title from email
  setTitle(profile.user.email);

  // prepare temp image
  const tempPath = app.getPath('temp');
  const imagePath = join(tempPath, `${ profile.user.email }.png`);

  // fetch temp image from gravatar
  try {
    const imageStream = createWriteStream(imagePath);
    await downloadGravatarImage(profile.user.email, 16, imageStream);
  } catch (e) {
    setImage(fallback);
    return;
  }

  // prepare native image from temp file
  try {
    const image = await jimp.read(imagePath);
    await image.circle().writeAsync(imagePath);
  } catch (e) {}

  // update icon from temp image
  setImage(imagePath);
};
