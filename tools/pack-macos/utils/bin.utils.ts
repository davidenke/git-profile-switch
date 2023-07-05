import { join } from 'node:path';

export function prepareBinaryPath(dist: string, name: string): string {
  return join(dist, name, `${name}-mac_universal`);
}
