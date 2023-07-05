import { readFile } from 'node:fs/promises';

export type Config = {
  name: string;
  title: string;
  uid: string;
  version: string;
};

export async function readConfig(path: string): Promise<Config> {
  // read the config file
  const configContent = await readFile(path, 'utf-8');
  const { applicationId, cli, modes, version } = JSON.parse(configContent);

  return {
    name: cli?.binaryName,
    title: modes?.window?.title,
    uid: applicationId,
    version,
  };
}
