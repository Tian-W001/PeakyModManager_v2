import { contextBridge, ipcRenderer, webUtils } from 'electron';
import { TMetadata } from '../types/metadataType';
import { TLanguage } from '../types/languageType';

contextBridge.exposeInMainWorld('electron', {
  //settings
  getModResourcesPath: () => ipcRenderer.invoke('get-mod-resources-path'),
  setModResourcesPath: (path: string) => ipcRenderer.invoke('set-mod-resources-path', path),
  getTargetPath: () => ipcRenderer.invoke('get-target-path'),
  setTargetPath: (path: string) => ipcRenderer.invoke('set-target-path', path),
  getLauncherPath: () => ipcRenderer.invoke('get-launcher-path'),
  setLauncherPath: (path: string) => ipcRenderer.invoke('set-launcher-path', path),
  getGamePath: () => ipcRenderer.invoke('get-game-path'),
  setGamePath: (path: string) => ipcRenderer.invoke('set-game-path', path),
  getLanguage: () => ipcRenderer.invoke('get-language'),
  setLanguage: (lang: TLanguage) => ipcRenderer.invoke('set-language', lang),
  selectFolder: () => ipcRenderer.invoke('select-folder'),
  selectFile: (path: string, extnames: string[]) => ipcRenderer.invoke('select-file', path, extnames),

  //mod resources
  fetchModResourcesMetadata: () => ipcRenderer.invoke('fetch-mod-resources-metadata'),
  addNewMod: (srcModPath: string) => ipcRenderer.invoke('add-new-mod', srcModPath),
  deleteMod: (modName: string) => ipcRenderer.invoke('delete-mod', modName),
  updateMod: (modName: string, newMetadata: TMetadata) => ipcRenderer.invoke('update-mod-metadata', modName, newMetadata),
  applyMods: (isActiveModList: Record<string,boolean>) => ipcRenderer.invoke('apply-mods', isActiveModList),
  getModPath: (file: File) => webUtils.getPathForFile(file),

  //executables
  openModLauncher: () => ipcRenderer.invoke('open-mod-launcher'),
  openGame: () => ipcRenderer.invoke('open-game'),
  openFileExplorer: (path: string) => ipcRenderer.invoke('reveal-in-file-explorer', path),
});