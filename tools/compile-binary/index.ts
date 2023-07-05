/**
 * In order to align the sources of the binaries, they have to be compiled afterwards.
 * https://neutralino.js.org/docs/contributing/framework-developer-guide/#setup-and-build-the-framework
 *
 * git clone https://github.com/neutralinojs/neutralinojs.git
 */

import { parseArgs } from 'node:util';
import { cwd } from 'node:process';
import { join } from 'node:path';

import { prepareLogger } from './utils/log.utils.js';
import { buildBinary, copyBinary, getSources } from './utils/source.utils.js';
import { prepareTempDir } from './utils/temp.utils.js';

import { patch } from './patch.js';

// read arguments
const { values } = parseArgs({
  options: {
    tempDir: { type: 'string' },
    target: { type: 'string' },
    repo: { type: 'string' },
    pythonBin: { type: 'string' },
    silent: { type: 'boolean' },
  },
});
const {
  tempDir = join(cwd(), '.tmp'),
  target = join(cwd(), 'bin'),
  repo = 'neutralinojs/neutralinojs',
  pythonBin = 'python',
  silent = false,
} = values;

const ghRepo = `https://github.com/${repo}.git`;

// prepare logger globally
prepareLogger(silent);

// start process
const exists = await prepareTempDir(tempDir);
if (!exists) await getSources(tempDir, ghRepo);

// patch sources -> or use forked repo?
await patch(tempDir);

// build binaries from sources
await buildBinary(tempDir, pythonBin);

// copy binaries to target
await copyBinary(tempDir, target);
