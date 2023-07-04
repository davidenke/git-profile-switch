import { readFile } from 'node:fs/promises';

export type Config = {
  name: string;
  title: string;
  uid: string;
};

export async function readConfig(path: string): Promise<Config> {
  // read the config file
  const configContent = await readFile(path, 'utf-8');
  const { applicationId, cli, modes } = JSON.parse(configContent);

  return {
    name: cli?.binaryName,
    title: modes?.window?.title,
    uid: applicationId,
  };
}
