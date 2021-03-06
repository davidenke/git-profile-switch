import { ipcRenderer, IpcRendererEvent } from 'electron';
import { RequestType, Subject } from '../../common/types';

export const generateId = (): string => Math
  .random()
  .toString(16)
  .slice(2);

export const processIfValid = <R, F>(subject: Subject, handler: () => R, fail?: F): R | F => {
  // whitelist channels
  const validSubjects = Object.values(Subject);
  if (!validSubjects.includes(subject)) {
    return fail;
  }

  // process if valid
  return handler();
};

export const listen = (subject: Subject, handler: (event: IpcRendererEvent, ...args: any[]) => void): () => void => {
  console.log(`Listen ${ subject }`);
  const _handler = (event: IpcRendererEvent, ...args: any[]) => {
    console.log(`Received ${ subject }`, ...args);
    handler(event, ...args);
  };
  const unsubscribe = () => { ipcRenderer.off(subject, _handler); };
  ipcRenderer.on(subject, _handler);
  return unsubscribe;
};

export const request = async <R, T extends RequestType = 'get', S extends Subject = any, P = any>(type: T, subject: S, payload?: P): Promise<R> => {
  return new Promise((resolve => {
    // we need an id to associate the response with the request
    const id = generateId();

    // register listener (to be removed by reference later)
    const unsubscribe = listen(subject, (_, response: { id: string; type: T; payload: R }) => {
      // kill listener if matching and resolve
      if (response.id === id && response.type === type) {
        unsubscribe();
        resolve(response.payload);
      }
    });

    // request with extended payload
    ipcRenderer.send(subject, { id, type, payload });
  }));
};
