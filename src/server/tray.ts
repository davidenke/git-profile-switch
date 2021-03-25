import { nativeImage, Tray } from 'electron';

import { Profile } from '../common/types';
import { getProfile, getProfileImagePath } from './profile';

export const createTray = async (): Promise<Tray> => {
  const tray = new Tray(nativeImage.createEmpty());
  const profile = await getProfile();
  await updateTray(tray, profile);
  return tray;
};

export const updateTray = async (tray: Tray, profile: Profile) => {
  tray.setTitle(` ${ profile?.user?.email }`);
  tray.setImage(await getProfileImagePath(profile?.user?.email));
};
