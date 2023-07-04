import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { parseArgs } from 'node:util';

/**
 * We assume that some arguments are provided:
 *  - a neutralino.config.json path (default: <cwd>/neutralino.config.json)
 *  - a dist path (default: <cwd>/dist)
 *  - a target path (default: <cwd>/dist)
 *  - a macOS icon path (default: <cwd>/icon.icns)
 *  - a flag indicating whether the app is an agent app that runs in the background and doesn't appear in the Dock (default: false)
 *    -> https://developer.apple.com/documentation/bundleresources/information_property_list/lsuielement
 */

export type Args = {
  config: string;
  dist: string;
  target: string;
  icon: string;
  agent: boolean;
};

export function getArgs(cwd: string, validate = true): Args {
  // parse cli arguments
  const {
    values: {
      config = join(cwd, 'neutralino.config.json'),
      dist = join(cwd, 'dist'),
      target = join(cwd, 'dist'),
      icon = join(cwd, 'icon.icns'),
      agent = false,
    },
  } = parseArgs({
    options: {
      config: { type: 'string', short: 'c' },
      dist: { type: 'string', short: 'd' },
      target: { type: 'string', short: 't' },
      icon: { type: 'string', short: 'i' },
      agent: { type: 'boolean', short: 'a' },
    },
  });

  const args = { config, dist, target, icon, agent };
  if (validate) validateArgs(args);

  return args;
}

export function validateArgs({ config, dist, icon }: Args) {
  // check if the config file exists
  if (!existsSync(config)) {
    console.error(`Config file not found: ${config}`);
    process.exit(1);
  }

  // check if the dist folder exists
  if (!existsSync(dist)) {
    console.error(`Dist folder not found: ${dist}`);
    process.exit(1);
  }

  // check if the icon file exists
  if (!existsSync(icon)) {
    console.error(`Icon file not found: ${icon}`);
    process.exit(1);
  }
}
