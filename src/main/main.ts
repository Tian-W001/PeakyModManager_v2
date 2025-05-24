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
import { app, BrowserWindow, shell, ipcMain, dialog, protocol } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import store from './store';
import fs from 'fs-extra';
import MenuBuilder from './menu';
import { combineObjects, resolveHtmlPath } from './util';
import { DEFAULT_METADATA, TMetadata } from '../types/metadataType';
import { TLanguage } from '../types/languageType';
import { exec } from 'child_process';
import { installExtension, REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } from "electron-devtools-installer";
import { registerCharacterHandlers } from './hotUpdateHandler';
import { modImageScheme, registerImageProtocol } from './Protocols/modImageProtocol';
import { characterImageScheme, registerCharacterImageProtocol } from './Protocols/characterImageProtocol';


const HARD_RESET_METADATA = false;
const UPDATE_METADATA_STRUCTURE = false;

const METADATA_FILENAME = 'metadata.json';
export const IMG_TYPES = new Set(['.png', '.jpg', '.jpeg', '.webp']);

class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow: BrowserWindow | null = null;

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

protocol.registerSchemesAsPrivileged([
  modImageScheme,
  characterImageScheme,
]);

const createWindow = async () => {
  if (isDebug) {
    await installExtensions();
  }

  const RESOURCES_PATH = app.isPackaged
  //? path.join(process.resourcesPath, 'assets')
    ? process.resourcesPath
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

app.whenReady()
  .then(() => {
    installExtension([REDUX_DEVTOOLS, REACT_DEVELOPER_TOOLS])
    .then(([redux, react]) => console.log(`Added Extensions:  ${redux.name}, ${react.name}`))
    .catch((err) => console.log('An error occurred: ', err));
  })
  .then(() => {
    registerImageProtocol();
    registerCharacterImageProtocol();
    registerCharacterHandlers();
  })
  .then(() => {
    createWindow();
    app.on('activate', () => {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (mainWindow === null) createWindow();
    });
  })
  .catch(console.log);


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
  
  try {
    // metadata doesn't exist, create new metadata file
    if (HARD_RESET_METADATA || !(await fs.pathExists(modMetadataPath))) {
      await fs.outputFile(modMetadataPath, JSON.stringify(DEFAULT_METADATA, null, 2));
      return DEFAULT_METADATA;
    }
    const rawData = await fs.readFile(modMetadataPath, 'utf-8');
    const currentMetadata = JSON.parse(rawData);
    if (!UPDATE_METADATA_STRUCTURE) {
      // metadata exists, read and return
      return currentMetadata;
    } else {
      // metadata outdatated, update
      const newMetadata = combineObjects(currentMetadata, DEFAULT_METADATA);
      await fs.outputFile(modMetadataPath, JSON.stringify(newMetadata, null, 2));
      return newMetadata;
    }

  } catch (error) {
    console.error('Error updating mod metadata:', error);
    return null;
  }
};


ipcMain.handle('fetch-mod-resources-metadata', async () => {
  const modResourcesPath = store.get('modResourcesPath');
  if (modResourcesPath) {
    return await updateAllModMetadata(modResourcesPath);
  }
  return null;
});

ipcMain.handle('update-mod-metadata', async (_event, modName: string, newMetadata: TMetadata) => {
  const modResourcesPath = store.get('modResourcesPath');
  const metadataPath = path.join(modResourcesPath, modName, METADATA_FILENAME);

  try {
    await fs.writeJson(metadataPath, newMetadata, { spaces: 2 });
    return true;
  } catch (error) {
    console.error(`Failed to update mod ${modName}: ${error}`);
    return false;
  }
});

ipcMain.handle('get-first-image', async (_event, modName: string) => {
  //return the name of the first image in modResourcesPath/modName
  const modResourcesPath = store.get('modResourcesPath');
  const modPath = path.join(modResourcesPath, modName);
  for (const file of await fs.readdir(modPath)) {
    const ext = path.extname(file).toLowerCase();
    if(IMG_TYPES.has(ext)) {
      return file;
    }
  }
  return null;
});

ipcMain.handle('get-readme-content', async (_event, modName: string) => {
  //return readme or readme.txt content in modResourcesPath/modName
  const readmeFilenames = ['readme', 'readme.txt'];
  const modResourcesPath = store.get('modResourcesPath');
  const modPath = path.join(modResourcesPath, modName);
  for (const file of await fs.readdir(modPath)) {
    if (readmeFilenames.includes(file.toLowerCase())) {
      const content = await fs.readFile(path.join(modPath, file), 'utf-8');
      return content;
    }
  }
  return null;
});

ipcMain.handle("copy-cover-image", async (_event, modName, srcImagePath) => {
  const modResourcesPath = store.get('modResourcesPath');
  const modPath = path.join(modResourcesPath, modName);
  const imageName = path.basename(srcImagePath);
  const imagePath = path.join(modPath, imageName);
  try {
    //check if image is with IMG_TYPES
    const ext = path.extname(srcImagePath).toLowerCase();
    if (!IMG_TYPES.has(ext)) {
      console.error('Selected path is not a file or invalid image type');
      return false;
    }
    //check if image is already exists
    if (await fs.pathExists(imagePath)) {
      console.error('Image already exists in modResources');
      return true;
    }
    await fs.copy(srcImagePath, imagePath);
    return true;
  } catch (error) {
    console.error('Error copying image:', error);
    return false;
  }
});

ipcMain.handle('add-new-mod', async (_event, srcModPath) => {
  try {
    if (!(await fs.stat(srcModPath)).isDirectory()) {
      console.error('Selected path is not a directory');
      return null;
    }
    const modResourcesPath = store.get('modResourcesPath');
    const modPath = path.join(modResourcesPath, path.basename(srcModPath));

    if (await fs.pathExists(modPath)) {
      console.error('Mod already exists in modResources');
      return null;
    }
    await fs.copy(srcModPath, modPath);
    return await updateModMetadata(modPath);

  } catch (error) {
    console.error('Error copying mod:', error);
    return null;
  }
});

ipcMain.handle('delete-mod', async (_event, modName: string) => {
  const modResourcesPath = store.get('modResourcesPath');
  const targetPath = store.get('targetPath');

  const modPath = path.join(modResourcesPath, modName);
  const linkPath = path.join(targetPath, modName);

  try {
    await fs.remove(modPath);
    await fs.remove(linkPath);
    return true;
  } catch (error) {
    console.error('Error deleting mod:', error);
    return false;
  }
});

// undefined diffList means disable all mods
async function applyMods(diffList?: Record<string, boolean>) {
  const modResourcesPath = store.get('modResourcesPath');
  const targetPath = store.get('targetPath');

  const applyMod = async (modName: string, isActive: boolean) => {
    const modPath = path.join(modResourcesPath, modName);
    const linkPath = path.join(targetPath, modName);
    const metadataPath = path.join(modPath, METADATA_FILENAME);
    if (!await fs.pathExists(metadataPath)) {
      console.error(`Metadata file not found for mod ${modName}, skipping...`);
      return;
    }
    const metadata: TMetadata = await fs.readJSON(metadataPath);
    if (!metadata) {
      console.error(`Failed to read metadata for mod ${modName}`);
      return;
    }
    metadata.active = isActive;
    await fs.writeJSON(metadataPath, metadata, { spaces: 2 });

    if (isActive) { // Create a dir link for the mod
      if (!await fs.pathExists(linkPath)) {
        await fs.symlink(modPath, linkPath, 'junction');
      }
    } else {        // Remove the link
      await fs.remove(linkPath);
    }
  };

  try {
    if (diffList) {
      for (const [modName, isActive] of Object.entries(diffList)) {
        await applyMod(modName, isActive);
      }
    } else {
      const modNames = (await fs.readdir(modResourcesPath, { withFileTypes: true }))
                      .filter(dirent => dirent.isDirectory())
                      .map(dirent => dirent.name);
      for (const modName of modNames) {
        await applyMod(modName, false);
      }
    }
    return true;
  } catch (error) {
    console.error('Error applying mods:', error);
    return false;
  }
}


ipcMain.handle('apply-mods', async (_event, diffList: Record<string,boolean>) => {
  return await applyMods(diffList);
});

ipcMain.handle('disable-all-mods', async () => {
  return await applyMods();
});

ipcMain.handle('remove-all-metadata-files', async () => {
  const modResourcesPath = store.get('modResourcesPath');
  try {
    const modNames = (await fs.readdir(modResourcesPath, { withFileTypes: true }))
                      .filter(dirent => dirent.isDirectory())
                      .map(dirent => dirent.name);

    for (const modName of modNames) {
      const metadataPath = path.join(modResourcesPath, modName, METADATA_FILENAME);
      await fs.remove(metadataPath);
    }
    return true;

  } catch (error) {
    console.error('Error removing metadata files:', error);
    return false;
  }
});

async function clearPath(targetPath: string) {
  const files = await fs.readdir(targetPath);
    for (const file of files) {
      const filePath = path.join(targetPath, file);
      await fs.remove(filePath);
    }
}

ipcMain.handle('get-mod-resources-path', () => {
  return store.get('modResourcesPath');
});

ipcMain.handle('set-mod-resources-path', (_event, modResourcesPath: string) => {
  const oldModResourcesPath = store.get('modResourcesPath');
  if (oldModResourcesPath && oldModResourcesPath !== modResourcesPath) {
    store.set('modResourcesPath', modResourcesPath);
    const targetPath = store.get('targetPath');
    clearPath(targetPath);
  }
});


ipcMain.handle('get-target-path', () => {
  return store.get('targetPath');
});
ipcMain.handle('set-target-path', async (_event, targetPath: string) => {
  const oldTargetPath = store.get('targetPath');
  if (oldTargetPath && oldTargetPath !== targetPath) {
    store.set('targetPath', targetPath);
    clearPath(oldTargetPath);
    clearPath(targetPath);
  }
});

ipcMain.handle('get-launcher-path', () => {
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

ipcMain.handle('get-language', () => {
  return store.get('language');
});
ipcMain.handle('set-language', (_event, lang: TLanguage) => {
  store.set('language', lang);
})

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

ipcMain.handle('reveal-in-file-explorer', (_event, path) => {
  exec(`start "" "${path}"`, error => {
    if (error) {
      console.error('Failed to start:', error);
      return error;
    }
  });
});

ipcMain.handle('select-folder', async () => {
  const result = await dialog.showOpenDialog({
    properties: ['openDirectory']
  });

  if (result.canceled || result.filePaths.length === 0)
    return null;
  else
    return result.filePaths[0];
});

ipcMain.handle('select-file', async (_event, path: string, extnames:string[] = []) => {
  const result = await dialog.showOpenDialog({
    properties: ['openFile'],
    defaultPath: path,
    filters: [
      { name: "Files", extensions: extnames }
    ]
  });
  
  if (result.canceled || result.filePaths.length === 0)
    return null;
  else
    return result.filePaths[0];
});
