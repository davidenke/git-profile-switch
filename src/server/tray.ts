import { Tray } from 'electron';
import { join } from 'path';
import { getProfile } from './profile';

export const createTray = async (icon: string, onClick: () => void = () => null): Promise<Tray> => {
  const tray = new Tray(join(icon))
  tray.on('click', () => onClick());
  const profile = await getProfile();
  tray.setTitle(profile?.user?.email);
  return tray;
}
