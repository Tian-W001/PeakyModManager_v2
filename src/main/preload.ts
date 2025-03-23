import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electron', {
  getModResourcesPath: () => ipcRenderer.invoke('get-mod-resources-path'),
  setModResourcesPath: (path: string) => ipcRenderer.invoke('set-mod-resources-path', path),
  onModResourcesData: (callback: (files: string[]) => void) => {
    ipcRenderer.on('mod-resources-data', (_, files) => callback(files));
  },
});