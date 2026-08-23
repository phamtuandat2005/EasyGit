import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('electron', {
  platform: process.platform,

  // Dialog
  openDirectory: () => ipcRenderer.invoke('dialog:openDirectory'),

  // Git IPC
  git: {
    openRepo:      (path: string)                              => ipcRenderer.invoke('git:openRepo', path),
    log:           (path: string, maxCount?: number)           => ipcRenderer.invoke('git:log', path, maxCount),
    status:        (path: string)                              => ipcRenderer.invoke('git:status', path),
    branches:      (path: string)                              => ipcRenderer.invoke('git:branches', path),
    stashes:       (path: string)                              => ipcRenderer.invoke('git:stashes', path),
    remotes:       (path: string)                              => ipcRenderer.invoke('git:remotes', path),
    tags:          (path: string)                              => ipcRenderer.invoke('git:tags', path),
    diff:          (path: string, file: string, staged: boolean) => ipcRenderer.invoke('git:diff', path, file, staged),
    currentBranch: (path: string)                              => ipcRenderer.invoke('git:currentBranch', path),
    createBranch:  (path: string, name: string)                => ipcRenderer.invoke('git:createBranch', path, name),
    checkout:      (path: string, branch: string)              => ipcRenderer.invoke('git:checkout', path, branch),
    syncStatus:    (path: string)                              => ipcRenderer.invoke('git:syncStatus', path),
    stage:         (path: string, file: string)                => ipcRenderer.invoke('git:stage', path, file),
    unstage:       (path: string, file: string)                => ipcRenderer.invoke('git:unstage', path, file),
    stageAll:      (path: string)                              => ipcRenderer.invoke('git:stageAll', path),
    unstageAll:    (path: string)                              => ipcRenderer.invoke('git:unstageAll', path),
    commit:        (path: string, message: string)             => ipcRenderer.invoke('git:commit', path, message),
    push:          (path: string)                              => ipcRenderer.invoke('git:push', path),
    pull:          (path: string)                              => ipcRenderer.invoke('git:pull', path),
    fetch:         (path: string)                              => ipcRenderer.invoke('git:fetch', path),
    init:          (path: string)                              => ipcRenderer.invoke('git:init', path),
    clone:         (url: string, destination: string)          => ipcRenderer.invoke('git:clone', url, destination),
    stash:         (path: string)                              => ipcRenderer.invoke('git:stash', path),
    undoCommit:    (path: string)                              => ipcRenderer.invoke('git:undoCommit', path),
    // ── New actions ──
    merge:          (path: string, branch: string, noFF?: boolean) => ipcRenderer.invoke('git:merge', path, branch, noFF),
    abortMerge:     (path: string)                              => ipcRenderer.invoke('git:abortMerge', path),
    mergeStatus:    (path: string)                              => ipcRenderer.invoke('git:mergeStatus', path),
    resolveConflict:(path: string, file: string, resolution: 'ours' | 'theirs') => ipcRenderer.invoke('git:resolveConflict', path, file, resolution),
    deleteBranch:   (path: string, name: string, force?: boolean) => ipcRenderer.invoke('git:deleteBranch', path, name, force),
    renameBranch:   (path: string, oldName: string, newName: string) => ipcRenderer.invoke('git:renameBranch', path, oldName, newName),
    discardFile:    (path: string, filePath: string)            => ipcRenderer.invoke('git:discardFile', path, filePath),
    stashPop:       (path: string, index?: number)              => ipcRenderer.invoke('git:stashPop', path, index),
    stashApply:     (path: string, index?: number)              => ipcRenderer.invoke('git:stashApply', path, index),
    stashDrop:      (path: string, index: number)               => ipcRenderer.invoke('git:stashDrop', path, index),
    reset:          (path: string, mode: 'soft' | 'mixed' | 'hard', target?: string) => ipcRenderer.invoke('git:reset', path, mode, target),
    revert:         (path: string, commitHash: string)          => ipcRenderer.invoke('git:revert', path, commitHash),
  },

  // Menu → Renderer listeners
  onMenuAction: (cb: (action: string) => void) => {
    const h = (_: Electron.IpcRendererEvent, a: string) => cb(a);
    ipcRenderer.on('menu-action', h);
    return () => ipcRenderer.removeListener('menu-action', h);
  },
  onOpenRepository: (cb: (path: string) => void) => {
    const h = (_: Electron.IpcRendererEvent, p: string) => cb(p);
    ipcRenderer.on('open-repository', h);
    return () => ipcRenderer.removeListener('open-repository', h);
  },
  onInitRepository: (cb: (path: string) => void) => {
    const h = (_: Electron.IpcRendererEvent, p: string) => cb(p);
    ipcRenderer.on('init-repository', h);
    return () => ipcRenderer.removeListener('init-repository', h);
  },
});
