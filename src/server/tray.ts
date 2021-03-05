import { createWriteStream, readFile, writeFile } from 'fs';
import { join } from 'path';
import { promisify } from 'util';
import { app, Tray } from 'electron';
import { PNG } from 'pngjs';

import { Profile } from '../common/types';
import { downloadGravatarImage } from '../common/utils/gravatar.utils';
import { getProfile } from './profile';

const readFileAsync = promisify(readFile);
const writeFileAsync = promisify(writeFile);

export const createTray = async (icon: string, onClick: () => void = () => null): Promise<Tray> => {
  const tray = new Tray(join(icon));
  tray.on('click', () => onClick());
  const profile = await getProfile();
  await updateTray(tray, profile);
  return tray;
};

export const updateTray = async (tray: Tray, profile: Profile) => {
  // shorthand title to space with some prefix...
  const setTitle = (email: string) => tray.setTitle(` ${email}`);
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
  const imagePath = join(tempPath, `${profile.user.email}.png`);

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
    const png = PNG.sync.read(await readFileAsync(imagePath));
    for (let y = 0; y < png.height; y++) {
      for (let x = 0; x < png.width; x++) {
        const idx = (png.width * y + x) << 2;
        const radius = png.height / 2;
        if (y >= Math.sqrt(Math.pow(radius, 2) - Math.pow(x - radius, 2)) + radius || y <= -(Math.sqrt(Math.pow(radius, 2) - Math.pow(x - radius, 2))) + radius) {
          png.data[idx + 3] = 0;
        }
      }
    }
    await writeFileAsync(imagePath, PNG.sync.write(png));
  } catch (e) {
  }

  // update icon from temp image
  setImage(imagePath);
};
