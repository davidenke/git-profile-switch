import { nativeImage, Tray } from 'electron';

import { Profile } from '../common/types';
import { getProfile, getProfileImage } from './profile';

export const createTray = async (): Promise<Tray> => {
  const tray = new Tray(nativeImage.createEmpty());
  const profile = await getProfile();
  await updateTray(tray, profile);
  return tray;
};

export const updateTray = async (tray: Tray, profile: Profile) => {
  const dataUrl = await getProfileImage(profile?.user?.email);
  const image = nativeImage.createFromDataURL(dataUrl);
  tray.setTitle(` ${ profile?.user?.email }`);
  tray.setImage(image);
};
