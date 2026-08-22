"use strict";
const electron = require("electron");
electron.contextBridge.exposeInMainWorld("electron", {
  platform: process.platform,
  // Dialog
  openDirectory: () => electron.ipcRenderer.invoke("dialog:openDirectory"),
  // Git IPC
  git: {
    openRepo: (path) => electron.ipcRenderer.invoke("git:openRepo", path),
    log: (path, maxCount) => electron.ipcRenderer.invoke("git:log", path, maxCount),
    status: (path) => electron.ipcRenderer.invoke("git:status", path),
    branches: (path) => electron.ipcRenderer.invoke("git:branches", path),
    stashes: (path) => electron.ipcRenderer.invoke("git:stashes", path),
    remotes: (path) => electron.ipcRenderer.invoke("git:remotes", path),
    tags: (path) => electron.ipcRenderer.invoke("git:tags", path),
    diff: (path, file, staged) => electron.ipcRenderer.invoke("git:diff", path, file, staged),
    currentBranch: (path) => electron.ipcRenderer.invoke("git:currentBranch", path),
    createBranch: (path, name) => electron.ipcRenderer.invoke("git:createBranch", path, name),
    checkout: (path, branch) => electron.ipcRenderer.invoke("git:checkout", path, branch),
    syncStatus: (path) => electron.ipcRenderer.invoke("git:syncStatus", path),
    stage: (path, file) => electron.ipcRenderer.invoke("git:stage", path, file),
    unstage: (path, file) => electron.ipcRenderer.invoke("git:unstage", path, file),
    stageAll: (path) => electron.ipcRenderer.invoke("git:stageAll", path),
    unstageAll: (path) => electron.ipcRenderer.invoke("git:unstageAll", path),
    commit: (path, message) => electron.ipcRenderer.invoke("git:commit", path, message),
    push: (path) => electron.ipcRenderer.invoke("git:push", path),
    pull: (path) => electron.ipcRenderer.invoke("git:pull", path),
    fetch: (path) => electron.ipcRenderer.invoke("git:fetch", path),
    init: (path) => electron.ipcRenderer.invoke("git:init", path),
    clone: (url, destination) => electron.ipcRenderer.invoke("git:clone", url, destination)
  },
  // Menu → Renderer listeners
  onMenuAction: (cb) => {
    const h = (_, a) => cb(a);
    electron.ipcRenderer.on("menu-action", h);
    return () => electron.ipcRenderer.removeListener("menu-action", h);
  },
  onOpenRepository: (cb) => {
    const h = (_, p) => cb(p);
    electron.ipcRenderer.on("open-repository", h);
    return () => electron.ipcRenderer.removeListener("open-repository", h);
  },
  onInitRepository: (cb) => {
    const h = (_, p) => cb(p);
    electron.ipcRenderer.on("init-repository", h);
    return () => electron.ipcRenderer.removeListener("init-repository", h);
  }
});
