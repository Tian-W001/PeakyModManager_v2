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
import fs from 'fs-extra';
import MenuBuilder from './menu';
import { combineObjects, resolveHtmlPath } from './util';
import { TMetadata } from '../types/metadataType';
import { execFile, exec } from 'child_process';
import mime from 'mime-types';

const METADATA_VERSION = 2;
const METADATA_FILENAME = 'metadata.json';
const IMG_TYPES = new Set(['.png', '.jpg', '.jpeg', '.webp']);

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

const updateAllModMetadata = async (modResourcesPath: string): Promise<Record<string, TMetadata>> => {
  try {
    const files = await fs.promises.readdir(modResourcesPath);
    const modFolders = await Promise.all(
      files.map(async (file) => {
        const filePath = path.join(modResourcesPath, file);
        return (await fs.promises.stat(filePath)).isDirectory() ? file : null;
      })
    );
    
    const validModFolders = modFolders.filter(Boolean) as string[];

    const metadataEntries = await Promise.all(
      validModFolders.map(async mod => [mod, await updateModMetadata(path.join(modResourcesPath, mod))])
    );
    return Object.fromEntries(metadataEntries);

  } catch (error) {
    console.error('Error updating mod metadata:', error);
    return {};
  }
};

const updateModMetadata = async (modPath: string): Promise<TMetadata|null> => {
  const modMetadataPath = path.join(modPath, METADATA_FILENAME);
  
  const defaultMetadata: TMetadata = {
    modType: 'Unknown',
    character: 'Unknown', 
    description: '',
    image: '',
    sourceUrl: '',
    active: false,
    metadataVersion: METADATA_VERSION,
  };

  try {
    // metadata doesn't exist, create new metadata file
    if (!(await fs.pathExists(modMetadataPath))) {
      await fs.outputFile(modMetadataPath, JSON.stringify(defaultMetadata, null, 2));
      return defaultMetadata;
    }
    const rawData = await fs.readFile(modMetadataPath, 'utf-8');
    const currentMetadata = JSON.parse(rawData);
    if (currentMetadata.metadataVersion === METADATA_VERSION) {
      // metadata exists, read and return
      return currentMetadata;
    } else {
      // metadata outdatated, update 
      const newMetadata = combineObjects(currentMetadata, defaultMetadata);
      await fs.outputFile(modMetadataPath, JSON.stringify(newMetadata, null, 2));
      return newMetadata;
    }

  } catch (error) {
    console.error('Error updating mod metadata:', error);
    return null;
  }
};


const store = new Store<{ modResourcesPath: string }>();

ipcMain.handle('set-mod-resources-path', (_event, modResourcesPath: string) => {
  store.set('modResourcesPath', modResourcesPath);
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

ipcMain.handle('update-mod-metadata', async (_event, modName: string, newMetadata: TMetadata) => {
  const modResourcesPath = store.get('modResourcesPath');
  if (!modResourcesPath) return false;
  try {
    const modPath = path.join(modResourcesPath, modName);
    await fs.promises.writeFile(
      path.join(modPath, METADATA_FILENAME),
      JSON.stringify(newMetadata, null, 2)
    );
    return true;
  } catch (error) {
    console.log(`Failed to update mod ${modName}: ${error}`);
    return false;
  }
});

ipcMain.handle('fetch-image', async (_event, imagePath: string) => {
  if (!imagePath) return undefined;
  try {
    const ext = path.extname(imagePath);
    if (!IMG_TYPES.has(ext)) {
      console.error(`Invalid image type: ${ext}`);
      return undefined;
    }
    const mimeType = mime.lookup(ext);

    const imageBuffer = await fs.promises.readFile(imagePath);
    const imageData = imageBuffer.toString('base64');
    return `data:${mimeType};base64,${imageData}`;

  } catch (error) {
    console.error(`Failed to read image file: ${error}`);
    return undefined;
  }
});

ipcMain.handle('add-new-mod', async (_event, srcModPath) => {
  try {
    if (!(await fs.stat(srcModPath)).isDirectory()) {
      console.error('Selected path is not a directory');
      return null;
    }
    const targetPath = store.get('modResourcesPath');
    if (!targetPath) {
      console.error('Target path not set');
      return null;
    }
    const targetModPath = path.join(targetPath, path.basename(srcModPath));
    const modResourcesPath = store.get('modResourcesPath');
    if (!modResourcesPath) {
      console.error('Mod resources path not set');
      return null;
    }
    await fs.ensureDir(modResourcesPath);
    if (await fs.pathExists(targetModPath)) {
      console.error('Mod already exists in target path');
      return null;
    }
    await fs.copy(srcModPath, targetModPath);
    return await updateModMetadata(targetModPath);

  } catch (error) {
    console.error('Error copying mod:', error);
    return null;
  }
});

ipcMain.handle('delete-mod', async (_event, modName: string) => {
  const modResourcesPath = store.get('modResourcesPath');
  if (!modResourcesPath) {
    console.error('Mod resources path not set');
    return false;
  }
  const modPath = path.join(modResourcesPath, modName);
  try {
    if (await fs.pathExists(modPath)) {
      await fs.remove(modPath);
      return true;
    } else {
      console.error('Mod does not exist');
      return false;
    }
  } catch (error) {
    console.error('Error deleting mod:', error);
    return false;
  }
});

ipcMain.handle('get-target-path', () => {
  return store.get('targetPath');
});
ipcMain.handle('set-target-path', (_event, targetPath: string) => {
  store.set('targetPath', targetPath);
});

ipcMain.handle('get-launcher-path', () => {
  console.log('[electron]get launcher path', store.get('launcherPath'));
  return store.get('launcherPath');
});
ipcMain.handle('set-launcher-path', (_event, launcherPath: string) => {
  store.set('launcherPath', launcherPath);
});

ipcMain.handle('get-game-path', () => {
  return store.get('gamePath');
});
ipcMain.handle('set-game-path', (_event, gamePath: string) => {
  store.set('gamePath', gamePath);
});

ipcMain.handle('open-mod-launcher', () => {
  const path = store.get('launcherPath');
  if (!path) {
    console.error('Launcher path not set');
    return;
  }
  exec(`"${path}"`, (error) => {
    if (error) {
      console.error('Failed to start:', error);
      return error;
    }
  });
  return;
});

ipcMain.handle('open-game', () => {
  const path = store.get('gamePath');
  if (!path) {
    console.error('Game path not set');
    return;
  }
  exec(`"${path}"`, (error) => {
    if (error) {
      console.error('Failed to start:', error);
      return error;
    }
  });
  return;
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
      contextIsolation: true,
      nodeIntegration: false,
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
