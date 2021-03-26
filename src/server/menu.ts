import { Menu, MenuItem, nativeImage, NativeImage } from 'electron';
import { getProfile, getProfileImage, getProfiles } from './profile';
import { Profile } from '../common/types';

export const createMenu = async (
  onProfileClick: (profile: Profile) => void = () => null,
  onSettingsClick: () => void = () => null
): Promise<Menu> => {
  const profiles = await getProfiles();
  const currentProfile = await getProfile();
  const icons: { [email: string]: NativeImage; } = {};

  for await (const { user: { email } } of profiles) {
    const url = await getProfileImage(email, 12);
    icons[email] = nativeImage.createFromDataURL(url);
  }

  return Menu.buildFromTemplate([
    ...profiles.map(profile => ({
      label: profile.user.email,
      icon: icons[profile.user.email],
      type: 'checkbox',
      checked: profile.user.email === currentProfile.user.email,
      click: () => onProfileClick(profile)
    } as unknown as MenuItem)),
    { type: 'separator' },
    { label: 'Settings', click: () => onSettingsClick() },
    { label: 'Quit', role: 'quit' }
  ]);
};
