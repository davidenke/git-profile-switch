import { contextBridge } from 'electron';
import { API } from './common/types';
import { processIfValid, request, listen } from './server/utils/request.utils';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('api', {
  subscribe(subject, callback) {
    return processIfValid(subject, () => {
      const handler = (_, { payload }) => callback(payload);
      return listen(subject, handler);
    }, () => null);
  },
  get(subject, payload) {
    return processIfValid(subject, () => request('get', subject, payload));
  },
  set(subject, payload) {
    return processIfValid(subject, () => request('set', subject, payload));
  }
} as unknown as API);
