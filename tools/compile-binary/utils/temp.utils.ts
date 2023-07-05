import { existsSync } from 'node:fs';
import { rm } from 'node:fs/promises';
import { join } from 'node:path';

import { updateSources } from './source.utils.js';

export async function prepareTempDir(path: string, forceClean = false): Promise<boolean> {
  // doesn't exist
  if (!existsSync(path)) return false;

  // exists, try to update
  if (!forceClean || existsSync(join(path, '.git'))) {
    try {
      await updateSources(path);
      return true;
    } catch (error) {
      return await prepareTempDir(path, true);
    }
  } else {
    log.info('> Remove temp folder');
    await rm(path, { recursive: true, force: true });
    return false;
  }
}
