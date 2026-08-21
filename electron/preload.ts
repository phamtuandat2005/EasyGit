import { contextBridge, ipcRenderer } from 'electron';

// --------- Expose some API to the Renderer process ---------
contextBridge.exposeInMainWorld('electron', {
  platform: process.platform,
  openDirectory: () => ipcRenderer.invoke('dialog:openDirectory'),
  
  git: {
    status: (repoPath: string) => ipcRenderer.invoke('git:status', repoPath),
    log: (repoPath: string, maxCount?: number) => ipcRenderer.invoke('git:log', repoPath, maxCount),
    diff: (repoPath: string, file?: string) => ipcRenderer.invoke('git:diff', repoPath, file),
    // other methods would be mapped here
  }
});
