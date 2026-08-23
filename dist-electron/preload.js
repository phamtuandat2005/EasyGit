<<<<<<< HEAD
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
    rebase: (path, branch) => electron.ipcRenderer.invoke("git:rebase", path, branch),
    init: (path) => electron.ipcRenderer.invoke("git:init", path),
    clone: (url, destination) => electron.ipcRenderer.invoke("git:clone", url, destination),
    stash: (path) => electron.ipcRenderer.invoke("git:stash", path),
    undoCommit: (path) => electron.ipcRenderer.invoke("git:undoCommit", path),
    // ── New actions ──
    merge: (path, branch, noFF) => electron.ipcRenderer.invoke("git:merge", path, branch, noFF),
    abortMerge: (path) => electron.ipcRenderer.invoke("git:abortMerge", path),
    mergeStatus: (path) => electron.ipcRenderer.invoke("git:mergeStatus", path),
    resolveConflict: (path, file, resolution) => electron.ipcRenderer.invoke("git:resolveConflict", path, file, resolution),
    deleteBranch: (path, name, force) => electron.ipcRenderer.invoke("git:deleteBranch", path, name, force),
    renameBranch: (path, oldName, newName) => electron.ipcRenderer.invoke("git:renameBranch", path, oldName, newName),
    discardFile: (path, filePath) => electron.ipcRenderer.invoke("git:discardFile", path, filePath),
    stashPop: (path, index) => electron.ipcRenderer.invoke("git:stashPop", path, index),
    stashApply: (path, index) => electron.ipcRenderer.invoke("git:stashApply", path, index),
    stashDrop: (path, index) => electron.ipcRenderer.invoke("git:stashDrop", path, index),
    reset: (path, mode, target) => electron.ipcRenderer.invoke("git:reset", path, mode, target),
    revert: (path, commitHash) => electron.ipcRenderer.invoke("git:revert", path, commitHash)
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
=======
"use strict";const i=require("electron");i.contextBridge.exposeInMainWorld("electron",{platform:process.platform,openDirectory:()=>i.ipcRenderer.invoke("dialog:openDirectory"),git:{openRepo:e=>i.ipcRenderer.invoke("git:openRepo",e),log:(e,r)=>i.ipcRenderer.invoke("git:log",e,r),status:e=>i.ipcRenderer.invoke("git:status",e),branches:e=>i.ipcRenderer.invoke("git:branches",e),stashes:e=>i.ipcRenderer.invoke("git:stashes",e),remotes:e=>i.ipcRenderer.invoke("git:remotes",e),tags:e=>i.ipcRenderer.invoke("git:tags",e),diff:(e,r,n)=>i.ipcRenderer.invoke("git:diff",e,r,n),currentBranch:e=>i.ipcRenderer.invoke("git:currentBranch",e),createBranch:(e,r)=>i.ipcRenderer.invoke("git:createBranch",e,r),checkout:(e,r)=>i.ipcRenderer.invoke("git:checkout",e,r),syncStatus:e=>i.ipcRenderer.invoke("git:syncStatus",e),stage:(e,r)=>i.ipcRenderer.invoke("git:stage",e,r),unstage:(e,r)=>i.ipcRenderer.invoke("git:unstage",e,r),stageAll:e=>i.ipcRenderer.invoke("git:stageAll",e),unstageAll:e=>i.ipcRenderer.invoke("git:unstageAll",e),commit:(e,r)=>i.ipcRenderer.invoke("git:commit",e,r),push:e=>i.ipcRenderer.invoke("git:push",e),pull:e=>i.ipcRenderer.invoke("git:pull",e),fetch:e=>i.ipcRenderer.invoke("git:fetch",e),init:e=>i.ipcRenderer.invoke("git:init",e),clone:(e,r)=>i.ipcRenderer.invoke("git:clone",e,r),stash:e=>i.ipcRenderer.invoke("git:stash",e),undoCommit:e=>i.ipcRenderer.invoke("git:undoCommit",e),merge:(e,r,n)=>i.ipcRenderer.invoke("git:merge",e,r,n),abortMerge:e=>i.ipcRenderer.invoke("git:abortMerge",e),mergeStatus:e=>i.ipcRenderer.invoke("git:mergeStatus",e),resolveConflict:(e,r,n)=>i.ipcRenderer.invoke("git:resolveConflict",e,r,n),deleteBranch:(e,r,n)=>i.ipcRenderer.invoke("git:deleteBranch",e,r,n),renameBranch:(e,r,n)=>i.ipcRenderer.invoke("git:renameBranch",e,r,n),discardFile:(e,r)=>i.ipcRenderer.invoke("git:discardFile",e,r),stashPop:(e,r)=>i.ipcRenderer.invoke("git:stashPop",e,r),stashApply:(e,r)=>i.ipcRenderer.invoke("git:stashApply",e,r),stashDrop:(e,r)=>i.ipcRenderer.invoke("git:stashDrop",e,r),reset:(e,r,n)=>i.ipcRenderer.invoke("git:reset",e,r,n),revert:(e,r)=>i.ipcRenderer.invoke("git:revert",e,r)},onMenuAction:e=>{const r=(n,t)=>e(t);return i.ipcRenderer.on("menu-action",r),()=>i.ipcRenderer.removeListener("menu-action",r)},onOpenRepository:e=>{const r=(n,t)=>e(t);return i.ipcRenderer.on("open-repository",r),()=>i.ipcRenderer.removeListener("open-repository",r)},onInitRepository:e=>{const r=(n,t)=>e(t);return i.ipcRenderer.on("init-repository",r),()=>i.ipcRenderer.removeListener("init-repository",r)}});
>>>>>>> 675534764cce2d6380ec24f6ed2abb07df8fed57
