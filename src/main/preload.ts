import { contextBridge, ipcRenderer } from 'electron';
import { TMetadata } from '../types/metadataType';

contextBridge.exposeInMainWorld('electron', {
  getModResourcesPath: () => ipcRenderer.invoke('get-mod-resources-path'),
  setModResourcesPath: (path: string) => ipcRenderer.invoke('set-mod-resources-path', path),
  getTargetPath: () => ipcRenderer.invoke('get-target-path'),
  setTargetPath: (path: string) => ipcRenderer.invoke('set-target-path', path),
  fetchModResourcesMetadata: () => ipcRenderer.invoke('fetch-mod-resources-metadata'),
  updateMod: (modName: string, newMetadata: TMetadata) => ipcRenderer.invoke('update-mod-metadata', modName, newMetadata),
  fetchImage: (modName: string, imgName: string) => ipcRenderer.invoke('fetch-image', modName, imgName),
  getLauncherPath: () => ipcRenderer.invoke('get-launcher-path'),
  setLauncherPath: (path: string) => ipcRenderer.invoke('set-launcher-path', path),
  getGamePath: () => ipcRenderer.invoke('get-game-path'),
  setGamePath: (path: string) => ipcRenderer.invoke('set-game-path', path),
  openModLauncher: () => ipcRenderer.invoke('open-mod-launcher'),
});