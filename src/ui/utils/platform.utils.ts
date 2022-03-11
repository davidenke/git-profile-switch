import { ChildProcess, exec } from 'child_process';

/**
 * Delivers the platform specific command for opening a file
 * @returns command
 */
export const getOpenCommand = (): string => {
  switch (process.platform as NodeJS.Platform & 'win64') {
    case 'darwin':
      return 'open';
    case 'win32':
      return 'start';
    case 'win64':
      return 'start';
    default:
      return 'xdg-open';
  }
};

/**
 * Opens a given file path in the platforms default application
 * @param file 
 * @returns process
 */
export const openWithCommand = (file: string): ChildProcess => {
  return exec(`${getOpenCommand()} ${file}`);
};
