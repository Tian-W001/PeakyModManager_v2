/* eslint global-require: off, no-console: off, promise/always-return: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `npm run build` or `npm run build:main`, this file is compiled to
 * `./src/main.js` using webpack. This gives us some performance wins.
 */
import path from 'path';
import { app, BrowserWindow, shell, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import Store from 'electron-store';
import fs from 'fs';
import MenuBuilder from './menu';
import { combineObjects, resolveHtmlPath } from './util';
import { TCharacter } from '../types/characterType';
import { Tmod } from '../types/modType';
import { TMetadata } from '../types/metadataType';

const METADATA_VERSION = 1;
const METADATA_FILENAME = 'metadata.json';

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

const updateAllModMetadata = async (modResourcesPath: string): Promise<TMetadata[]> => {
  try {
    const files = await fs.promises.readdir(modResourcesPath);
    const modFolders = await Promise.all(
      files.map(async (file) => {
        const filePath = path.join(modResourcesPath, file);
        return (await fs.promises.stat(filePath)).isDirectory() ? file : null;
      })
    );
    
    const validModFolders = modFolders.filter(Boolean) as string[];
    return Promise.all(
      validModFolders.map(mod => updateModMetadata(modResourcesPath, mod))
    );
  } catch (error) {
    console.error('Error updating mod metadata:', error);
    return [];
  }
};

const updateModMetadata = async (
  modResourcesPath: string,
  mod: string
): Promise<TMetadata> => {
  const modPath = path.join(modResourcesPath, mod);
  const modMetadataPath = path.join(modPath, METADATA_FILENAME);
  
  const defaultMetadata: TMetadata = {
    character: 'Unknown', 
    description: '',
    name: mod,
    modType: 'Unknown',
    image: '',
    sourceUrl: '',
    active: false,
    metadataVersion: METADATA_VERSION,
  };

  try {
    await fs.promises.access(modMetadataPath);
    const rawData = await fs.promises.readFile(modMetadataPath, 'utf-8');
    const currentMetadata = JSON.parse(rawData);

    if (currentMetadata.metadataVersion === METADATA_VERSION) {
      return currentMetadata;
    }

    const newMetadata = combineObjects(currentMetadata, defaultMetadata);
    await fs.promises.writeFile(modMetadataPath, JSON.stringify(newMetadata, null, 2));
    return newMetadata;
  } catch (error) {
    // File doesn't exist or other error
    await fs.promises.writeFile(modMetadataPath, JSON.stringify(defaultMetadata, null, 2));
    return defaultMetadata;
  }
};

const store = new Store<{ modResourcesPath: string }>();

ipcMain.handle('set-mod-resources-path', (_event, modResourcesPath: string) => {
  store.set('modResourcesPath', modResourcesPath);
  return true;
});

ipcMain.handle('get-mod-resources-path', () => {
  return store.get('modResourcesPath');
});

ipcMain.handle('fetch-mod-resources-metadata', async () => {
  const modResourcesPath = store.get('modResourcesPath');
  if (modResourcesPath) {
    return await updateAllModMetadata(modResourcesPath);
  }
  return [];
});

ipcMain.on('ipc-example', async (event, arg) => {
  const msgTemplate = (pingPong: string) => `IPC test: ${pingPong}`;
  console.log(msgTemplate(arg));
  event.reply('ipc-example', msgTemplate('pong'));
});

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

const isDebug =
  process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true';

if (isDebug) {
  require('electron-debug').default();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS'];

  return installer
    .default(
      extensions.map((name) => installer[name]),
      forceDownload,
    )
    .catch(console.log);
};

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
    ? path.join(process.resourcesPath, 'assets')
    : path.join(__dirname, '../../assets');

  const getAssetPath = (...paths: string[]): string => {
    return path.join(RESOURCES_PATH, ...paths);
  };

  mainWindow = new BrowserWindow({
    show: false,
    width: 1024,
    height: 728,
    autoHideMenuBar: true,
    icon: getAssetPath('icon.png'),
    webPreferences: {
      preload: app.isPackaged
        ? path.join(__dirname, 'preload.js')
        : path.join(__dirname, '../../.erb/dll/preload.js'),
    },
  });

  mainWindow.loadURL(resolveHtmlPath('index.html'));

  mainWindow.on('ready-to-show', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  // Open urls in the user's browser
  mainWindow.webContents.setWindowOpenHandler((edata) => {
    shell.openExternal(edata.url);
    return { action: 'deny' };
  });

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
};

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app
  .whenReady()
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);
