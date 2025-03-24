import { contextBridge, ipcRenderer } from 'electron';
import { TMetadata } from '../types/metadataType';

contextBridge.exposeInMainWorld('electron', {
  getModResourcesPath: () => ipcRenderer.invoke('get-mod-resources-path'),
  setModResourcesPath: (path: string) => ipcRenderer.invoke('set-mod-resources-path', path),
  fetchModResourcesMetadata: () => ipcRenderer.invoke('fetch-mod-resources-metadata'),
});