import { Menu, MenuItem, nativeImage, NativeImage } from 'electron';
import { getProfileImage } from './profile';
import { Profile } from '../common/types';

let profileClickAction = (_profile: Profile): void => null;
let createClickAction = (): void => null;
let settingsClickAction = (): void => null;

const prepareMenu = async (profiles: Profile[], currentProfile: Profile): Promise<Menu> => {
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
      click: () => profileClickAction(profile)
    } as unknown as MenuItem)),
    { type: 'separator' },
    { label: 'Create new profile', click: () => createClickAction() },
    { label: 'Settings', click: () => settingsClickAction() },
    { label: 'Quit', role: 'quit' }
  ]);
};


export const updateMenu = async (profiles: Profile[], currentProfile: Profile): Promise<Menu> => {
  return prepareMenu(profiles, currentProfile);
}

export const createMenu = async (
  profiles: Profile[],
  currentProfile: Profile,
  onProfileClick: typeof profileClickAction,
  onCreateClick: typeof createClickAction,
  onSettingsClick: typeof settingsClickAction
): Promise<Menu> => {
  profileClickAction = onProfileClick;
  createClickAction = onCreateClick;
  settingsClickAction = onSettingsClick;

  return prepareMenu(profiles, currentProfile);
};
