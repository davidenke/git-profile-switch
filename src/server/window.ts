import { join } from 'path';
import { BrowserWindow, Tray } from 'electron';

export const WINDOW_HEIGHT_DEFAULT = 80;
export const WINDOW_HEIGHT_EXPANDED = 275;
export const WINDOW_WIDTH = 250;

export const createWindow = async (isDevelopment = false, port = 3333): Promise<BrowserWindow> => {
  // Create the browser window.
  const window = new BrowserWindow({
    width: WINDOW_WIDTH,
    height: WINDOW_HEIGHT_DEFAULT,
    show: false,
    frame: false,
    fullscreenable: false,
    resizable: false,
    transparent: true,
    webPreferences: {
      devTools: isDevelopment,
      nodeIntegration: false, // is default value after Electron v5
      contextIsolation: true, // protect against prototype pollution
      preload: join(__dirname, 'preload.js'), // inject ipc api methods
      spellcheck: false // disable spellcheck
    }
  });

  // and load the index.html of the app.
  if (isDevelopment) {
    await window.loadURL(`http://localhost:${ port }`);
    window.webContents.openDevTools({ mode: 'detach' });
  } else {
    await window.loadURL(`file://${ join(__dirname, 'index.html') }`);
  }

  // Hide the window when it loses focus
  window.on('blur', () => {
    if (!window.webContents.isDevToolsOpened()) {
      window.hide();
    }
  });

  return window;
};

export const getWindowPosition = (tray: Tray, window: BrowserWindow) => {
  const windowBounds = window.getBounds();
  const trayBounds = tray.getBounds();

  // Center window horizontally below the tray icon
  const x = Math.round(trayBounds.x + (trayBounds.width / 2) - (windowBounds.width / 2));

  // Position window 4 pixels vertically below the tray icon
  const y = Math.round(trayBounds.y + trayBounds.height + 4);

  return { x, y };
};

export const closeWindow = (window: BrowserWindow) => {
  window.hide();
};

export const showWindow = (tray: Tray, window: BrowserWindow) => {
  const { x, y } = getWindowPosition(tray, window);
  window.setPosition(x, y, false);
  window.show();
};
