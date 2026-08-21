"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("electron", {
  platform: process.platform,
  openDirectory: () => electron.ipcRenderer.invoke("dialog:openDirectory"),
  git: {
    status: (repoPath) => electron.ipcRenderer.invoke("git:status", repoPath),
    log: (repoPath, maxCount) => electron.ipcRenderer.invoke("git:log", repoPath, maxCount),
    diff: (repoPath, file) => electron.ipcRenderer.invoke("git:diff", repoPath, file)
    // other methods would be mapped here
  }
});
