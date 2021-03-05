import { promisify } from 'util';
import { exec } from 'child_process';
import { readFile, unlink, writeFile } from 'fs';

export const execAsync = promisify(exec);
export const deleteFileAsync = promisify(unlink);
export const readFileAsync = promisify(readFile);
export const writeFileAsync = promisify(writeFile);
