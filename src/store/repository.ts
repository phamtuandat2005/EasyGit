import { create } from 'zustand';
import type { RepositoryState, GitChangedFile, GitCommit, GitBranch, GitStash, GitRemote, GitTag } from '../types/git';
import { parseLog, parseStatus, parseBranches, parseStashes, parseRemotes, parseTags } from '../services/git';

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

  stageFile: (filePath: string) => Promise<void>;
  unstageFile: (filePath: string) => Promise<void>;
  stageAll: () => Promise<void>;
  unstageAll: () => Promise<void>;
  commitChanges: (message: string) => Promise<boolean>;
  push: () => Promise<boolean>;
  pull: () => Promise<boolean>;
  fetch: () => Promise<boolean>;

  selectCommit: (hash: string | null) => void;
  selectedCommitHash: string | null;

  selectFile: (path: string | null) => void;
  selectedFile: string | null;

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

  // ── Select ────────────────────────────────────────────────────────────────────
  selectCommit: (hash) => set({ selectedCommitHash: hash }),
  selectFile: (path) => set({ selectedFile: path }),
}));
