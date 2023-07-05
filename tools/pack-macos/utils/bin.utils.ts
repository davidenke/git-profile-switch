import { join } from 'node:path';
import { arch } from 'node:process';

export function prepareBinaryPath(dist: string, name: string): string {
  return join(dist, name, `${name}-mac_${arch}`);
}
