"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("electron", {
  platform: process.platform,
  // Dialog
  openDirectory: () => electron.ipcRenderer.invoke("dialog:openDirectory"),
  // Git IPC
  git: {
    status: (repoPath) => electron.ipcRenderer.invoke("git:status", repoPath),
    log: (repoPath, maxCount) => electron.ipcRenderer.invoke("git:log", repoPath, maxCount),
    diff: (repoPath, file) => electron.ipcRenderer.invoke("git:diff", repoPath, file)
  },
  // Menu action listener (main → renderer)
  onMenuAction: (callback) => {
    const handler = (_, action) => callback(action);
    electron.ipcRenderer.on("menu-action", handler);
    return () => electron.ipcRenderer.removeListener("menu-action", handler);
  },
  // Open repository from menu
  onOpenRepository: (callback) => {
    const handler = (_, path) => callback(path);
    electron.ipcRenderer.on("open-repository", handler);
    return () => electron.ipcRenderer.removeListener("open-repository", handler);
  }
});
