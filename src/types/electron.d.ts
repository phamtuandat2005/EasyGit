/* ============================================
   Electron IPC API Type Declarations
   ============================================ */

export interface ElectronGitAPI {
  status: (repoPath: string) => Promise<string>;
  log: (repoPath: string, maxCount?: number) => Promise<string>;
  diff: (repoPath: string, file?: string) => Promise<string>;
  diffStaged: (repoPath: string, file?: string) => Promise<string>;
  add: (repoPath: string, files: string[]) => Promise<string>;
  reset: (repoPath: string, files: string[]) => Promise<string>;
  commit: (repoPath: string, message: string) => Promise<string>;
  push: (repoPath: string) => Promise<string>;
  pull: (repoPath: string) => Promise<string>;
  fetch: (repoPath: string) => Promise<string>;
  checkout: (repoPath: string, branch: string) => Promise<string>;
  createBranch: (repoPath: string, name: string) => Promise<string>;
  deleteBranch: (repoPath: string, name: string, force?: boolean) => Promise<string>;
  merge: (repoPath: string, branch: string) => Promise<string>;
  rebase: (repoPath: string, branch: string) => Promise<string>;
  stashSave: (repoPath: string, message?: string) => Promise<string>;
  stashPop: (repoPath: string, index?: number) => Promise<string>;
  stashApply: (repoPath: string, index?: number) => Promise<string>;
  stashDrop: (repoPath: string, index?: number) => Promise<string>;
  stashList: (repoPath: string) => Promise<string>;
  branchList: (repoPath: string) => Promise<string>;
  tagList: (repoPath: string) => Promise<string>;
  remoteList: (repoPath: string) => Promise<string>;
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
