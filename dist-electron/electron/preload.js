"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
electron_1.contextBridge.exposeInMainWorld('electron', {
    platform: process.platform,
    openDirectory: () => electron_1.ipcRenderer.invoke('dialog:openDirectory'),
    git: {
        openRepo: (path) => electron_1.ipcRenderer.invoke('git:openRepo', path),
        log: (path, maxCount) => electron_1.ipcRenderer.invoke('git:log', path, maxCount),
        status: (path) => electron_1.ipcRenderer.invoke('git:status', path),
        listFiles: (path) => electron_1.ipcRenderer.invoke('git:listFiles', path),
        isTracked: (path, filePath) => electron_1.ipcRenderer.invoke('git:isTracked', path, filePath),
        branches: (path) => electron_1.ipcRenderer.invoke('git:branches', path),
        stashes: (path) => electron_1.ipcRenderer.invoke('git:stashes', path),
        remotes: (path) => electron_1.ipcRenderer.invoke('git:remotes', path),
        tags: (path) => electron_1.ipcRenderer.invoke('git:tags', path),
        diff: (path, file, staged) => electron_1.ipcRenderer.invoke('git:diff', path, file, staged),
        currentBranch: (path) => electron_1.ipcRenderer.invoke('git:currentBranch', path),
        createBranch: (path, name) => electron_1.ipcRenderer.invoke('git:createBranch', path, name),
        checkout: (path, branch) => electron_1.ipcRenderer.invoke('git:checkout', path, branch),
        syncStatus: (path) => electron_1.ipcRenderer.invoke('git:syncStatus', path),
        stage: (path, file) => electron_1.ipcRenderer.invoke('git:stage', path, file),
        unstage: (path, file) => electron_1.ipcRenderer.invoke('git:unstage', path, file),
        stageAll: (path) => electron_1.ipcRenderer.invoke('git:stageAll', path),
        unstageAll: (path) => electron_1.ipcRenderer.invoke('git:unstageAll', path),
        remove: (path, files, options) => electron_1.ipcRenderer.invoke('git:remove', path, files, options),
        restore: (path, files) => electron_1.ipcRenderer.invoke('git:restore', path, files),
        deletePath: (path, paths) => electron_1.ipcRenderer.invoke('fs:deletePath', path, paths),
        commit: (path, message) => electron_1.ipcRenderer.invoke('git:commit', path, message),
        push: (path) => electron_1.ipcRenderer.invoke('git:push', path),
        pull: (path) => electron_1.ipcRenderer.invoke('git:pull', path),
        fetch: (path) => electron_1.ipcRenderer.invoke('git:fetch', path),
        rebase: (path, branch) => electron_1.ipcRenderer.invoke('git:rebase', path, branch),
        init: (path) => electron_1.ipcRenderer.invoke('git:init', path),
        clone: (url, destination) => electron_1.ipcRenderer.invoke('git:clone', url, destination),
        stash: (path) => electron_1.ipcRenderer.invoke('git:stash', path),
        undoCommit: (path) => electron_1.ipcRenderer.invoke('git:undoCommit', path),
        merge: (path, branch, noFF) => electron_1.ipcRenderer.invoke('git:merge', path, branch, noFF),
        abortMerge: (path) => electron_1.ipcRenderer.invoke('git:abortMerge', path),
        mergeStatus: (path) => electron_1.ipcRenderer.invoke('git:mergeStatus', path),
        resolveConflict: (path, file, resolution) => electron_1.ipcRenderer.invoke('git:resolveConflict', path, file, resolution),
        deleteBranch: (path, name, force) => electron_1.ipcRenderer.invoke('git:deleteBranch', path, name, force),
        renameBranch: (path, oldName, newName) => electron_1.ipcRenderer.invoke('git:renameBranch', path, oldName, newName),
        discardFile: (path, filePath) => electron_1.ipcRenderer.invoke('git:discardFile', path, filePath),
        stashPop: (path, index) => electron_1.ipcRenderer.invoke('git:stashPop', path, index),
        stashApply: (path, index) => electron_1.ipcRenderer.invoke('git:stashApply', path, index),
        stashDrop: (path, index) => electron_1.ipcRenderer.invoke('git:stashDrop', path, index),
        reset: (path, mode, target) => electron_1.ipcRenderer.invoke('git:reset', path, mode, target),
        revert: (path, commitHash) => electron_1.ipcRenderer.invoke('git:revert', path, commitHash),
    },
    onMenuAction: (cb) => {
        const h = (_, a) => cb(a);
        electron_1.ipcRenderer.on('menu-action', h);
        return () => electron_1.ipcRenderer.removeListener('menu-action', h);
    },
    onOpenRepository: (cb) => {
        const h = (_, p) => cb(p);
        electron_1.ipcRenderer.on('open-repository', h);
        return () => electron_1.ipcRenderer.removeListener('open-repository', h);
    },
    onInitRepository: (cb) => {
        const h = (_, p) => cb(p);
        electron_1.ipcRenderer.on('init-repository', h);
        return () => electron_1.ipcRenderer.removeListener('init-repository', h);
    },
});
