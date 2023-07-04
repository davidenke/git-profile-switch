import { existsSync } from 'node:fs';
import { chmod, copyFile, mkdir, rm, writeFile } from 'node:fs/promises';
import { join, parse } from 'node:path';

export async function prepareTarget(path: string, name: string, clean = true): Promise<string> {
  const target = join(path, `${name}.app`);

  // remove the target folder if it exists
  if (clean && existsSync(target)) await rm(target, { recursive: true });

  // create the target folder
  await mkdir(join(target, 'Contents', 'MacOS'), { recursive: true });
  await mkdir(join(target, 'Contents', 'Resources'), { recursive: true });

  // return the name of the target folder
  return target;
}

export async function copyBinary(target: string, path: string) {
  const { base: filename } = parse(path);
  const binPath = join(target, 'Contents', 'MacOS', filename);
  await copyFile(path, binPath);
  await chmod(binPath, 0x755);
}

export async function copyIcon(target: string, path: string) {
  const { base: filename } = parse(path);
  await copyFile(path, join(target, 'Contents', 'Resources', filename));
}

export async function copyResources(target: string, path: string) {
  const { base: filename } = parse(path);
  await copyFile(path, join(target, 'Contents', 'Resources', filename));
}

export async function writeBinaryLauncher(target: string, wrapper: string) {
  const binPath = join(target, 'Contents', 'MacOS', 'launch');
  await writeFile(binPath, wrapper);
  await chmod(binPath, 0x755);
}

export async function writeInfoPlist(target: string, plist: string) {
  await writeFile(join(target, 'Contents', 'Info.plist'), plist);
}
