import { promisify } from 'util';
import { exec } from 'child_process';

import { flatten } from 'flat';
import { default as getConfigPath } from 'git-config-path';
import { Config, sync as parseConfig } from 'parse-git-config';
import { Profile } from '../types';

const execAsync = promisify(exec);

export const CONFIG_PATH = getConfigPath('global');

export const getProfile = async (): Promise<Profile> => {
  const profile = parseConfig({ cwd: '/', path: CONFIG_PATH });
  return profile as Profile;
};

export const updateProfile = async (profile: Profile) => {
  const config: Config = flatten(profile);
  for await (let key of Object.keys(config)) {
    await execAsync(`git config --global ${ key } "${ config[key] }"`);
  }
};
