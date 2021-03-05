import { contextBridge, ipcRenderer } from 'electron';
import { API, Subject } from './common/types';
import { request } from './server/utils/request.utils';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('api', {
  subscribe(this, subject, callback) {
    const handler = (_, { payload }) => callback(payload);
    const unsubscribe = () => { ipcRenderer.off(subject, handler); };
    ipcRenderer.on(subject, handler);
    return unsubscribe;
  },
  get: async (subject, payload) => {
    // whitelist channels
    const validSubjects = Object.values(Subject);
    if (!validSubjects.includes(subject)) {
      return;
    }

    // execute request
    return request('get', subject, payload);
  },
  set: async (subject, payload) => {
    // whitelist channels
    const validSubjects = Object.values(Subject);
    if (!validSubjects.includes(subject)) {
      return;
    }

    // execute request
    return request('set', subject, payload);
  }
} as API);
