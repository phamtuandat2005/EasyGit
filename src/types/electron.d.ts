/* ============================================
   Electron IPC API Type Declarations
   ============================================ */

import type { GitResult } from './git';

export interface ElectronGitAPI {
  status: (repoPath: string) => Promise<GitResult<string>>;
  log: (repoPath: string, maxCount?: number) => Promise<GitResult<string>>;
  diff: (repoPath: string, file?: string) => Promise<GitResult<string>>;
  diffStaged: (repoPath: string, file?: string) => Promise<GitResult<string>>;
  add: (repoPath: string, files: string[]) => Promise<GitResult>;
  reset: (repoPath: string, files: string[]) => Promise<GitResult>;
  remove: (repoPath: string, files: string[], options?: { cached?: boolean }) => Promise<GitResult>;
  restore: (repoPath: string, files: string[]) => Promise<GitResult>;
  deletePath: (paths: string[]) => Promise<GitResult>;
  commit: (repoPath: string, message: string) => Promise<GitResult>;
  push: (repoPath: string) => Promise<GitResult>;
  pull: (repoPath: string) => Promise<GitResult>;
  fetch: (repoPath: string) => Promise<GitResult>;
  checkout: (repoPath: string, branch: string) => Promise<GitResult>;
  createBranch: (repoPath: string, name: string) => Promise<GitResult>;
  deleteBranch: (repoPath: string, name: string, force?: boolean) => Promise<GitResult>;
  merge: (repoPath: string, branch: string) => Promise<GitResult<{ hasConflict?: boolean }>>;
  rebase: (repoPath: string, branch: string) => Promise<GitResult>;
  stashSave: (repoPath: string, message?: string) => Promise<GitResult>;
  stashPop: (repoPath: string, index?: number) => Promise<GitResult>;
  stashApply: (repoPath: string, index?: number) => Promise<GitResult>;
  stashDrop: (repoPath: string, index?: number) => Promise<GitResult>;
  stashList: (repoPath: string) => Promise<GitResult<string>>;
  branchList: (repoPath: string) => Promise<GitResult<string>>;
  tagList: (repoPath: string) => Promise<GitResult<string>>;
  remoteList: (repoPath: string) => Promise<GitResult<string>>;
}

export interface ElectronAPI {
  git: ElectronGitAPI;
  openDirectory: () => Promise<string | null>;
  openInEditor: (path: string) => Promise<void>;
  platform: string;
}

declare global {
  interface Window {
    electron?: ElectronAPI;
  }
}
