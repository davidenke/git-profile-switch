import { readFile, unlink, writeFile } from 'fs';
import { promisify } from 'util';

export const deleteFileAsync = promisify(unlink);
export const readFileAsync = promisify(readFile);
export const writeFileAsync = promisify(writeFile);
