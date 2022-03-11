import { contextBridge, IpcRendererEvent } from 'electron';
import { API, Subject } from './common/types';
import { processIfValid, request, listen } from './server/utils/request.utils';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('api', {
  subscribe(subject: Subject, callback: any) {
    return processIfValid(subject, () => {
      const handler = (_: IpcRendererEvent, { payload }) => callback(payload);
      return listen(subject, handler);
    }, () => null);
  },
  get(subject: Subject, payload: any) {
    return processIfValid(subject, () => request('get', subject, payload));
  },
  set(subject: Subject, payload: any) {
    return processIfValid(subject, () => request('set', subject, payload));
  }
} as API);
