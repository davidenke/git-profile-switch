import { ipcRenderer } from 'electron';
import { Subject } from '../../common/types';

export const generateId = (): string => Math
  .random()
  .toString(16)
  .slice(2);

export const request = async <R, T extends 'get' | 'set' = 'get', S extends Subject = any, P = any>(type: T, subject: S, payload?: P): Promise<R> => {
  return new Promise((resolve => {
    // we need an id to associate the response with the request
    const id = generateId();

    // prepare listener (to be removed by reference later)
    const responseListener = (_, response: { id: string; type: T; payload: R }) => {
      if (response.id !== id || response.type !== type) {
        return;
      }

      // kill listener and resolve
      ipcRenderer.off(subject, responseListener);
      resolve(response.payload);
    };
    // register listener for response
    ipcRenderer.on(subject, responseListener);

    // request with extended payload
    ipcRenderer.send(subject, { id, type, payload });
  }));
};
