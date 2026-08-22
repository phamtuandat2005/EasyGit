import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electron', {
  platform: process.platform,

  // Dialog
  openDirectory: () => ipcRenderer.invoke('dialog:openDirectory'),

  // Git IPC
  git: {
    status:  (repoPath: string)                  => ipcRenderer.invoke('git:status', repoPath),
    log:     (repoPath: string, maxCount?: number) => ipcRenderer.invoke('git:log', repoPath, maxCount),
    diff:    (repoPath: string, file?: string)    => ipcRenderer.invoke('git:diff', repoPath, file),
  },

  // Menu action listener (main → renderer)
  onMenuAction: (callback: (action: string) => void) => {
    const handler = (_: Electron.IpcRendererEvent, action: string) => callback(action);
    ipcRenderer.on('menu-action', handler);
    return () => ipcRenderer.removeListener('menu-action', handler);
  },

  // Open repository from menu
  onOpenRepository: (callback: (path: string) => void) => {
    const handler = (_: Electron.IpcRendererEvent, path: string) => callback(path);
    ipcRenderer.on('open-repository', handler);
    return () => ipcRenderer.removeListener('open-repository', handler);
  },
});
