import { create } from 'zustand';
import type { RepositoryState, GitChangedFile, GitCommit, GitBranch, GitStash, GitRemote, GitTag } from '../types/git';
import { parseLog, parseStatus, parseBranches, parseStashes, parseRemotes, parseTags, parseDiff } from '../services/git';
import type { GitFileDiff } from '../types/git';
// ── Electron IPC bridge (undefined in browser) ─────────────────────────────
const electronGit = (window as any).electron?.git;

// ── Store interface ────────────────────────────────────────────────────────────
interface RepositoryStore extends RepositoryState {
  // Actions
  loadRepository: (path: string) => Promise<boolean>;
  refreshStatus: () => Promise<void>;

  setBranch: (branch: string) => void;
  createBranch: (name: string) => Promise<boolean>;
  checkout: (branch: string) => Promise<boolean>;
  deleteBranch: (name: string, force?: boolean) => Promise<boolean>;
  renameBranch: (oldName: string, newName: string) => Promise<boolean>;

  stageFile: (filePath: string) => Promise<void>;
  unstageFile: (filePath: string) => Promise<void>;
  stageAll: () => Promise<void>;
  unstageAll: () => Promise<void>;
  discardFile: (filePath: string) => Promise<boolean>;
  commitChanges: (message: string) => Promise<boolean>;
  push: () => Promise<boolean>;
  pull: () => Promise<boolean>;
  fetch: () => Promise<boolean>;
  stash: () => Promise<boolean>;
  stashPop: (index?: number) => Promise<boolean>;
  stashApply: (index?: number) => Promise<boolean>;
  stashDrop: (index: number) => Promise<boolean>;
  undoCommit: () => Promise<boolean>;

  // Merge
  mergeBranch: (branch: string, noFF?: boolean) => Promise<{ success: boolean; hasConflict?: boolean; error?: string }>;
  abortMerge: () => Promise<boolean>;
  resolveConflict: (filePath: string, resolution: 'ours' | 'theirs') => Promise<boolean>;
  isMerging: boolean;
  conflictedFiles: string[];

  // Advanced
  resetTo: (mode: 'soft' | 'mixed' | 'hard', target?: string) => Promise<boolean>;
  revertCommit: (commitHash: string) => Promise<boolean>;

  selectCommit: (hash: string | null) => void;
  selectedCommitHash: string | null;

  selectFile: (path: string | null) => void;
  selectedFile: string | null;

  getFileDiff: (filePath: string, staged?: boolean) => Promise<GitFileDiff | null>;

  isLoadingRepo: boolean;
  repoError: string | null;
}

export const useRepositoryStore = create<RepositoryStore>((set, get) => ({
  // ── Default empty state ──────────────────────────────────────────────────────
  path: null,
  name: '',
  currentBranch: '',
  status: 'clean',
  ahead: 0,
  behind: 3,
  unstagedChanges: [],
  stagedChanges: [],
  commits: [],
  branches: [],
  remoteBranches: [],
  stashes: [],
  remotes: [],
  tags: [],
  isLoading: false,
  error: undefined,
  selectedCommitHash: null,
  selectedFile: null,
  isLoadingRepo: false,
  repoError: null,
  isMerging: false,
  conflictedFiles: [],

  // ── loadRepository — open and parse a real git repo ──────────────────────────
  loadRepository: async (repoPath: string) => {
    set({ isLoadingRepo: true, repoError: null });

    try {
      // 1. Validate it's a git repo
      if (electronGit) {
        const validation = await electronGit.openRepo(repoPath);
        if (!validation.success) {
          set({ isLoadingRepo: false, repoError: `Not a git repository: ${repoPath}` });
          return false;
        }
        // Use the root path (in case user opened a subdirectory)
        repoPath = validation.root;
      }

      const name = repoPath.split(/[\\/]/).pop() ?? repoPath;

      // 2. Fetch all data in parallel
      const [logRes, statusRes, branchRes, stashRes, remoteRes, tagRes, branchNameRes, syncRes] =
        await Promise.all([
          electronGit?.log(repoPath, 300),
          electronGit?.status(repoPath),
          electronGit?.branches(repoPath),
          electronGit?.stashes(repoPath),
          electronGit?.remotes(repoPath),
          electronGit?.tags(repoPath),
          electronGit?.currentBranch(repoPath),
          electronGit?.syncStatus(repoPath),
        ]);

      // 3. Parse everything
      const commits: GitCommit[] = logRes?.success ? parseLog(logRes.output) : [];
      const { staged, unstaged } = statusRes?.success ? parseStatus(statusRes.output) : { staged: [], unstaged: [] };
      const allBranches: GitBranch[] = branchRes?.success ? parseBranches(branchRes.output) : [];
      const stashes: GitStash[] = stashRes?.success ? parseStashes(stashRes.output) : [];
      const remotes: GitRemote[] = remoteRes?.success ? parseRemotes(remoteRes.output) : [];
      const tags: GitTag[] = tagRes?.success ? parseTags(tagRes.output) : [];
      const currentBranch: string = branchNameRes?.success ? branchNameRes.output.trim() : '';
      const ahead: number = syncRes?.success ? syncRes.ahead : 0;
      const behind: number = syncRes?.success ? syncRes.behind : 0;

      const localBranches = allBranches.filter(b => !b.isRemote);
      const remoteBranches = allBranches.filter(b => b.isRemote);

      set({
        path: repoPath,
        name,
        currentBranch,
        status: (staged.length + unstaged.length) > 0 ? 'modified' : 'clean',
        ahead,
        behind,
        commits,
        stagedChanges: staged,
        unstagedChanges: unstaged,
        branches: localBranches,
        remoteBranches,
        stashes,
        remotes,
        tags,
        isLoadingRepo: false,
        repoError: null,
      });

      return true;
    } catch (e: any) {
      set({ isLoadingRepo: false, repoError: e.message });
      return false;
    }
  },

  // ── refreshStatus — reload status after stage/unstage/commit ─────────────────
  refreshStatus: async () => {
    const { path } = get();
    if (!path || !electronGit) return;

    const [statusRes, logRes, syncRes] = await Promise.all([
      electronGit.status(path),
      electronGit.log(path, 300),
      electronGit.syncStatus(path),
    ]);

    const { staged, unstaged } = statusRes?.success ? parseStatus(statusRes.output) : { staged: [], unstaged: [] };
    const commits = logRes?.success ? parseLog(logRes.output) : get().commits;
    const ahead = syncRes?.success ? syncRes.ahead : get().ahead;
    const behind = syncRes?.success ? syncRes.behind : get().behind;

    set({ stagedChanges: staged, unstagedChanges: unstaged, commits, ahead, behind,
          status: (staged.length + unstaged.length) > 0 ? 'modified' : 'clean' });
  },

  // ── Branch Management ─────────────────────────────────────────────────────────
  setBranch: (branch) => set({ currentBranch: branch }),

  createBranch: async (name: string) => {
    const { path } = get();
    if (!path || !electronGit) return false;
    const result = await electronGit.createBranch(path, name);
    if (result?.success) {
      await electronGit.checkout(path, name); // Auto-checkout
      await get().loadRepository(path);
      return true;
    }
    return false;
  },

  checkout: async (branch: string) => {
    const { path } = get();
    if (!path || !electronGit) return false;
    const result = await electronGit.checkout(path, branch);
    if (result?.success) {
      await get().loadRepository(path);
      return true;
    }
    return false;
  },

  deleteBranch: async (name: string, force = false) => {
    const { path } = get();
    if (!path || !electronGit) return false;
    const result = await electronGit.deleteBranch(path, name, force);
    if (result?.success) {
      await get().loadRepository(path);
      return true;
    }
    return false;
  },

  renameBranch: async (oldName: string, newName: string) => {
    const { path } = get();
    if (!path || !electronGit) return false;
    const result = await electronGit.renameBranch(path, oldName, newName);
    if (result?.success) {
      await get().loadRepository(path);
      return true;
    }
    return false;
  },

  // ── Merge ────────────────────────────────────────────────────────────────────
  mergeBranch: async (branch: string, noFF = false) => {
    const { path } = get();
    if (!path || !electronGit) return { success: false, error: 'No repository open' };
    const result = await electronGit.merge(path, branch, noFF);
    if (result?.success) {
      await get().loadRepository(path);
      return { success: true };
    }
    // Handle conflict case
    if (result?.hasConflict) {
      const mergeStatusResult = await electronGit.mergeStatus(path);
      const conflictedFiles: string[] = mergeStatusResult?.conflictedFiles ?? [];
      set({ isMerging: true, conflictedFiles, status: 'conflict' });
      await get().refreshStatus();
    }
    return { success: false, hasConflict: result?.hasConflict, error: result?.error };
  },

  abortMerge: async () => {
    const { path } = get();
    if (!path || !electronGit) return false;
    const result = await electronGit.abortMerge(path);
    if (result?.success) {
      set({ isMerging: false, conflictedFiles: [] });
      await get().loadRepository(path);
      return true;
    }
    return false;
  },

  resolveConflict: async (filePath: string, resolution: 'ours' | 'theirs') => {
    const { path } = get();
    if (!path || !electronGit) return false;
    const result = await electronGit.resolveConflict(path, filePath, resolution);
    if (result?.success) {
      // Remove file from conflicted list
      set(s => ({ conflictedFiles: s.conflictedFiles.filter(f => f !== filePath) }));
      // Check if all conflicts resolved
      const mergeStatusResult = await electronGit.mergeStatus(path);
      const remaining: string[] = mergeStatusResult?.conflictedFiles ?? [];
      if (remaining.length === 0) {
        set({ isMerging: false, conflictedFiles: [] });
      }
      await get().refreshStatus();
      return true;
    }
    return false;
  },

  // ── Stage / Unstage ──────────────────────────────────────────────────────────
  stageFile: async (filePath: string) => {
    const { path } = get();
    if (!path) return;
    if (electronGit) {
      await electronGit.stage(path, filePath);
      await get().refreshStatus();
    } else {
      // Fallback: optimistic update in browser
      set((state) => {
        const file = state.unstagedChanges.find(f => f.path === filePath);
        if (!file) return state;
        return {
          unstagedChanges: state.unstagedChanges.filter(f => f.path !== filePath),
          stagedChanges: [...state.stagedChanges, { ...file, staged: true }],
        };
      });
    }
  },

  unstageFile: async (filePath: string) => {
    const { path } = get();
    if (!path) return;
    if (electronGit) {
      await electronGit.unstage(path, filePath);
      await get().refreshStatus();
    } else {
      set((state) => {
        const file = state.stagedChanges.find(f => f.path === filePath);
        if (!file) return state;
        return {
          stagedChanges: state.stagedChanges.filter(f => f.path !== filePath),
          unstagedChanges: [...state.unstagedChanges, { ...file, staged: false }],
        };
      });
    }
  },

  stageAll: async () => {
    const { path } = get();
    if (!path) return;
    if (electronGit) {
      await electronGit.stageAll(path);
      await get().refreshStatus();
    } else {
      set((state) => ({
        stagedChanges: [...state.stagedChanges, ...state.unstagedChanges.map(f => ({ ...f, staged: true }))],
        unstagedChanges: [],
      }));
    }
  },

  unstageAll: async () => {
    const { path } = get();
    if (!path) return;
    if (electronGit) {
      await electronGit.unstageAll(path);
      await get().refreshStatus();
    } else {
      set((state) => ({
        unstagedChanges: [...state.unstagedChanges, ...state.stagedChanges.map(f => ({ ...f, staged: false }))],
        stagedChanges: [],
      }));
    }
  },

  // ── Discard File ─────────────────────────────────────────────────────────────
  discardFile: async (filePath: string) => {
    const { path } = get();
    if (!path || !electronGit) return false;
    const result = await electronGit.discardFile(path, filePath);
    if (result?.success) {
      await get().refreshStatus();
      return true;
    }
    return false;
  },

  // ── Commit ────────────────────────────────────────────────────────────────────
  commitChanges: async (message: string) => {
    const { path } = get();
    if (!path || !electronGit) return false;
    const result = await electronGit.commit(path, message);
    if (result?.success) {
      await get().refreshStatus();
      return true;
    }
    return false;
  },

  // ── Network (Push, Pull, Fetch) ──────────────────────────────────────────────
  push: async () => {
    const { path } = get();
    if (!path || !electronGit) return false;
    const result = await electronGit.push(path);
    if (result?.success) {
      await get().refreshStatus();
      return true;
    }
    return false;
  },

  pull: async () => {
    const { path } = get();
    if (!path || !electronGit) return false;
    const result = await electronGit.pull(path);
    if (result?.success) {
      await get().refreshStatus();
      return true;
    }
    return false;
  },

  fetch: async () => {
    const { path } = get();
    if (!path || !electronGit) return false;
    const result = await electronGit.fetch(path);
    if (result?.success) {
      await get().refreshStatus();
      return true;
    }
    return false;
  },

  stash: async () => {
    const { path } = get();
    if (!path || !electronGit) return false;
    const result = await electronGit.stash(path);
    if (result?.success) {
      await get().loadRepository(path);
      return true;
    }
    return false;
  },

  stashPop: async (index?: number) => {
    const { path } = get();
    if (!path || !electronGit) return false;
    const result = await electronGit.stashPop(path, index);
    if (result?.success) {
      await get().loadRepository(path);
      return true;
    }
    return false;
  },

  stashApply: async (index?: number) => {
    const { path } = get();
    if (!path || !electronGit) return false;
    const result = await electronGit.stashApply(path, index);
    if (result?.success) {
      await get().loadRepository(path);
      return true;
    }
    return false;
  },

  stashDrop: async (index: number) => {
    const { path } = get();
    if (!path || !electronGit) return false;
    const result = await electronGit.stashDrop(path, index);
    if (result?.success) {
      await get().loadRepository(path);
      return true;
    }
    return false;
  },

  undoCommit: async () => {
    const { path } = get();
    if (!path || !electronGit) return false;
    const result = await electronGit.undoCommit(path);
    if (result?.success) {
      await get().loadRepository(path);
      return true;
    }
    return false;
  },

  // ── Advanced Git ──────────────────────────────────────────────────────────────
  resetTo: async (mode: 'soft' | 'mixed' | 'hard', target = 'HEAD') => {
    const { path } = get();
    if (!path || !electronGit) return false;
    const result = await electronGit.reset(path, mode, target);
    if (result?.success) {
      await get().loadRepository(path);
      return true;
    }
    return false;
  },

  revertCommit: async (commitHash: string) => {
    const { path } = get();
    if (!path || !electronGit) return false;
    const result = await electronGit.revert(path, commitHash);
    if (result?.success) {
      await get().loadRepository(path);
      return true;
    }
    return false;
  },

  // ── Select ────────────────────────────────────────────────────────────────────
  selectCommit: (hash) => set({ selectedCommitHash: hash }),
  selectFile: (path) => set({ selectedFile: path }),

  getFileDiff: async (filePath: string, staged = false) => {
    const { path } = get();
    if (!path || !electronGit) return null;
    const result = await electronGit.diff(path, filePath, staged);
    if (result?.success) {
      return parseDiff(result.output, filePath);
    }
    return null;
  },
}));
