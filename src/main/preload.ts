import { contextBridge, ipcRenderer } from 'electron';
import { TMetadata } from '../types/metadataType';

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

  //mod resources
  fetchModResourcesMetadata: () => ipcRenderer.invoke('fetch-mod-resources-metadata'),
  addNewMod: (srcModPath: string) => ipcRenderer.invoke('add-new-mod'),
  updateMod: (modName: string, newMetadata: TMetadata) => ipcRenderer.invoke('update-mod-metadata', modName, newMetadata),
  fetchImage: (modName: string, imgName: string) => ipcRenderer.invoke('fetch-image', modName, imgName),
  
  //executables
  openModLauncher: () => ipcRenderer.invoke('open-mod-launcher'),
  openGame: () => ipcRenderer.invoke('open-game'),
});