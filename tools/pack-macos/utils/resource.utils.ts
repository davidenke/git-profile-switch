import { join } from 'node:path';

export function prepareResourcesPath(dist: string, name: string, resources = 'resources.neu'): string {
  return join(dist, name, resources);
}
