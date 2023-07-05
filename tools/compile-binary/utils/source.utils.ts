import { exec as execAsync } from 'node:child_process';
import { existsSync } from 'node:fs';
import { copyFile } from 'node:fs/promises';
import { arch } from 'node:process';
import { promisify } from 'node:util';

// prepare async versions
const exec = promisify(execAsync);

// updates the repo in a given path
export async function updateSources(path: string) {
  log.info('> Update existing sources');
  await exec(`git -C ${path} reset --hard`);
  await exec(`git -C ${path} fetch`);
  await exec(`git -C ${path} pull --ff-only`);
}

// clones the repo into a given path
export async function getSources(tmp: string, repo: string) {
  try {
    log.info(`> Cloning NeutralinoJS repository into temp folder ${tmp}`);
    await exec(`git clone --depth 1 ${repo} ${tmp}`);
  } catch (error) {
    log.error(error);
  }
}

// builds the binaries from the sources
export async function buildBinary(tmp: string, py = 'python') {
  try {
    log.info('> Build binary');
    await exec(`${py} scripts/bz.py`, { cwd: tmp });
  } catch (error) {
    log.error(error);
  }
}

// copies the binary folder to the target path
export async function copyBinary(tmp: string, target: string) {
  try {
    const name = `neutralino-mac_${arch}`;
    log.info(`> Copy binary ${name} to ${target}`);
    if (!existsSync(target)) await exec(`mkdir -p ${target}`);
    await copyFile(`${tmp}/bin/${name}`, `${target}/${name}`);
  } catch (error) {
    log.error(error);
  }
}
