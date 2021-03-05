import { join } from 'path';
import { BrowserWindow, Tray } from 'electron';

export const createWindow = async (isDevelopment = false, port = 3333): Promise<BrowserWindow> => {
  // Create the browser window.
  const window = new BrowserWindow({
    width: 180,
    height: 87,
    show: false,
    frame: false,
    fullscreenable: false,
    resizable: false,
    transparent: true,
    webPreferences: {
      devTools: isDevelopment,
      nodeIntegration: false, // is default value after Electron v5
      contextIsolation: true, // protect against prototype pollution
      enableRemoteModule: false, // turn off remote
      preload: join(__dirname, 'preload.js') // use a preload script
    }
  });

  // and load the index.html of the app.
  if (isDevelopment) {
    window.loadURL(`http://localhost:${ port }`);
    // window.webContents.openDevTools({ mode: 'detach' });
  } else {
    window.loadURL(`file://${ join(__dirname, 'index.html') }`);
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

  return { x: x, y: y };
};

export const toggleWindow = (tray: Tray, window: BrowserWindow) => {
  window.isVisible() ? window.hide() : showWindow(tray, window);
};

export const showWindow = (tray: Tray, window: BrowserWindow) => {
  const position = getWindowPosition(tray, window);
  window.setPosition(position.x, position.y, false);
  window.show();
};