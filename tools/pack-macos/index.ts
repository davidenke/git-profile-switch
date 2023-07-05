import { cwd } from 'node:process';
import { parse } from 'node:path';

import { getArgs } from './args.js';
import { readConfig } from './config.js';

import { getBinaryLauncher, prepareBinaryPath } from './bin.js';
import { copyBinary, copyIcon, copyResources, prepareTarget, writeBinaryLauncher, writeInfoPlist } from './target.js';
import { generatePlist } from './info.plist.js';
import { prepareResourcesPath } from './resources.js';

/**
 * Packs a Neutralino app as macOS app.
 * The typical structure of a macOS app is as follows:
 * - Name.app
 *   └ Contents
 *     ├ MacOS
 *     │  ├ binary (dist)
 *     │  └ parametrized (generated)
 *     ├ Resources
 *     │  ├ icon.icns
 *     │  └ resources.neu (dist)
 *     └ Info.plist
 *
 * Most important, the Info.plist file must be generated.
 */

// gather all arguments and read the config file
const args = getArgs(cwd());
const config = await readConfig(args.config);

// prepare target
const target = await prepareTarget(args.target, config.title);

// copy binaries and resources
const binary = prepareBinaryPath(args.dist, config.name);
const binName = parse(binary).base;
const wrapper = getBinaryLauncher(binName);
await copyBinary(target, binary);
await writeBinaryLauncher(target, wrapper);

const resources = prepareResourcesPath(args.dist, config.name);
await copyResources(target, resources);
await copyIcon(target, args.icon);

// write Info.plist
const plist = generatePlist(config.name, config.title, config.uid, config.version, args.agent);
await writeInfoPlist(target, plist);

// done
console.info(`> Packed ${config.title} as macOS app.`);
