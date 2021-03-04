import { contextBridge, ipcRenderer } from 'electron';
import { Action, API } from '../common/types';

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
  'api', {
    send: (action, data) => {
      // whitelist channels
      const validActions = Object.values(Action);
      if (validActions.includes(action)) {
        ipcRenderer.send(action, data);
      }
    },
    receive: (action, func) => {
      const validActions = Object.values(Action);
      if (validActions.includes(action)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.on(action, (_event, ...args) => func(...args));
      }
    }
  } as API
);
