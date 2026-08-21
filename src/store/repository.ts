import { create } from 'zustand';
import type { RepositoryState, GitChangedFile, GitCommit, GitBranch, GitStash, GitRemote, GitTag } from '../types/git';

// ── Mock Data ──────────────────────────────────────────

const MOCK_UNSTAGED: GitChangedFile[] = [
  { path: 'src/components/GitGraph.tsx', filename: 'GitGraph.tsx', directory: 'src/components', status: 'modified', additions: 42, deletions: 8, staged: false },
  { path: 'src/hooks/useRepository.ts', filename: 'useRepository.ts', directory: 'src/hooks', status: 'modified', additions: 15, deletions: 3, staged: false },
  { path: 'src/views/GraphView.tsx', filename: 'GraphView.tsx', directory: 'src/views', status: 'added', additions: 128, deletions: 0, staged: false },
  { path: 'src/utils/format.ts', filename: 'format.ts', directory: 'src/utils', status: 'modified', additions: 7, deletions: 2, staged: false },
  { path: 'tests/unit/graph.test.ts', filename: 'graph.test.ts', directory: 'tests/unit', status: 'added', additions: 54, deletions: 0, staged: false },
];

const MOCK_STAGED: GitChangedFile[] = [
  { path: 'src/store/repository.ts', filename: 'repository.ts', directory: 'src/store', status: 'modified', additions: 22, deletions: 5, staged: true },
  { path: 'src/types/git.ts', filename: 'git.ts', directory: 'src/types', status: 'modified', additions: 18, deletions: 0, staged: true },
  { path: 'README.md', filename: 'README.md', directory: '.', status: 'modified', additions: 3, deletions: 1, staged: true },
];

const BRANCH_COLORS = ['#58a6ff', '#3fb950', '#f85149', '#bc8cff', '#d29922', '#39d2c0', '#e3b341', '#f778ba'];

const MOCK_COMMITS: GitCommit[] = [
  {
    hash: 'a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0', shortHash: 'a1b2c3d',
    author: 'Sarah Chen', authorEmail: 'sarah@example.com',
    date: '2026-08-21T14:30:00Z', message: 'feat: implement repository graph visualization',
    parentHashes: ['b2c3d4e5'], refs: [{ name: 'main', type: 'branch' }, { name: 'HEAD', type: 'head' }],
    stats: { additions: 245, deletions: 12, filesChanged: 8 }
  },
  {
    hash: 'b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1', shortHash: 'b2c3d4e',
    author: 'Alex Kim', authorEmail: 'alex@example.com',
    date: '2026-08-21T11:15:00Z', message: 'fix: resolve sync state calculation for diverged branches',
    parentHashes: ['c3d4e5f6'], refs: [],
    stats: { additions: 34, deletions: 18, filesChanged: 3 }
  },
  {
    hash: 'c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2', shortHash: 'c3d4e5f',
    author: 'Sarah Chen', authorEmail: 'sarah@example.com',
    date: '2026-08-20T16:45:00Z', message: 'refactor: extract diff parser into standalone utility',
    parentHashes: ['d4e5f6a7'], refs: [{ name: 'origin/main', type: 'remote-branch' }],
    stats: { additions: 156, deletions: 89, filesChanged: 5 }
  },
  {
    hash: 'd4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3', shortHash: 'd4e5f6a',
    author: 'Marcus Johnson', authorEmail: 'marcus@example.com',
    date: '2026-08-20T10:20:00Z', message: 'feat: add command palette with fuzzy search',
    parentHashes: ['e5f6a7b8', 'f6a7b8c9'], refs: [],
    stats: { additions: 312, deletions: 0, filesChanged: 6 }
  },
  {
    hash: 'e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4', shortHash: 'e5f6a7b',
    author: 'Elena Rodriguez', authorEmail: 'elena@example.com',
    date: '2026-08-19T15:30:00Z', message: 'style: update design tokens for dark theme consistency',
    parentHashes: ['g7h8i9j0'], refs: [{ name: 'v1.2.0', type: 'tag' }],
    stats: { additions: 67, deletions: 43, filesChanged: 4 }
  },
  {
    hash: 'f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5', shortHash: 'f6a7b8c',
    author: 'Alex Kim', authorEmail: 'alex@example.com',
    date: '2026-08-19T12:00:00Z', message: 'feat: implement branch management view with upstream tracking',
    parentHashes: ['g7h8i9j0'], refs: [{ name: 'feature/branches', type: 'branch' }],
    stats: { additions: 198, deletions: 15, filesChanged: 7 }
  },
  {
    hash: 'g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6', shortHash: 'g7h8i9j',
    author: 'Sarah Chen', authorEmail: 'sarah@example.com',
    date: '2026-08-18T17:45:00Z', message: 'fix: correct line number display in unified diff view',
    parentHashes: ['h8i9j0k1'], refs: [],
    stats: { additions: 23, deletions: 11, filesChanged: 2 }
  },
  {
    hash: 'h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7', shortHash: 'h8i9j0k',
    author: 'Marcus Johnson', authorEmail: 'marcus@example.com',
    date: '2026-08-18T09:30:00Z', message: 'chore: update dependencies and fix type errors',
    parentHashes: ['i9j0k1l2'], refs: [],
    stats: { additions: 89, deletions: 45, filesChanged: 12 }
  },
  {
    hash: 'i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8', shortHash: 'i9j0k1l',
    author: 'Elena Rodriguez', authorEmail: 'elena@example.com',
    date: '2026-08-17T14:15:00Z', message: 'feat: add stash management with apply/pop/drop actions',
    parentHashes: ['j0k1l2m3'], refs: [{ name: 'v1.1.0', type: 'tag' }],
    stats: { additions: 176, deletions: 8, filesChanged: 5 }
  },
  {
    hash: 'j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9', shortHash: 'j0k1l2m',
    author: 'Alex Kim', authorEmail: 'alex@example.com',
    date: '2026-08-17T10:00:00Z', message: 'refactor: reorganize component architecture for extensibility',
    parentHashes: ['k1l2m3n4'], refs: [],
    stats: { additions: 432, deletions: 287, filesChanged: 18 }
  },
  {
    hash: 'k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6a7b8c9d0', shortHash: 'k1l2m3n',
    author: 'Sarah Chen', authorEmail: 'sarah@example.com',
    date: '2026-08-16T16:30:00Z', message: 'feat: initial commit — project scaffold with Electron + React',
    parentHashes: [], refs: [{ name: 'v1.0.0', type: 'tag' }],
    stats: { additions: 1247, deletions: 0, filesChanged: 32 }
  },
];

const MOCK_BRANCHES: GitBranch[] = [
  { name: 'main', isRemote: false, isCurrent: true, upstream: 'origin/main', ahead: 2, behind: 0, tracking: 'origin/main' },
  { name: 'feature/graph-view', isRemote: false, isCurrent: false, upstream: 'origin/feature/graph-view', ahead: 3, behind: 1, tracking: 'origin/feature/graph-view' },
  { name: 'feature/branches', isRemote: false, isCurrent: false, upstream: 'origin/feature/branches', ahead: 0, behind: 0, tracking: 'origin/feature/branches' },
  { name: 'fix/diff-parser', isRemote: false, isCurrent: false, upstream: 'origin/fix/diff-parser', ahead: 1, behind: 2, tracking: 'origin/fix/diff-parser' },
  { name: 'refactor/store', isRemote: false, isCurrent: false, ahead: 5, behind: 0 },
  { name: 'experiment/ai-commit', isRemote: false, isCurrent: false, ahead: 0, behind: 4 },
];

const MOCK_REMOTE_BRANCHES: GitBranch[] = [
  { name: 'origin/main', isRemote: true, isCurrent: false, ahead: 0, behind: 0 },
  { name: 'origin/feature/graph-view', isRemote: true, isCurrent: false, ahead: 0, behind: 0 },
  { name: 'origin/feature/branches', isRemote: true, isCurrent: false, ahead: 0, behind: 0 },
  { name: 'origin/fix/diff-parser', isRemote: true, isCurrent: false, ahead: 0, behind: 0 },
  { name: 'origin/develop', isRemote: true, isCurrent: false, ahead: 0, behind: 0 },
];

const MOCK_STASHES: GitStash[] = [
  { index: 0, message: 'WIP: graph rendering optimizations', date: '2026-08-21T10:00:00Z', branch: 'main', filesChanged: 3, additions: 45, deletions: 12 },
  { index: 1, message: 'Experiment: canvas-based diff viewer', date: '2026-08-20T09:15:00Z', branch: 'feature/graph-view', filesChanged: 5, additions: 234, deletions: 0 },
  { index: 2, message: 'Quick fix for sidebar layout', date: '2026-08-18T14:30:00Z', branch: 'main', filesChanged: 1, additions: 8, deletions: 3 },
];

const MOCK_REMOTES: GitRemote[] = [
  { name: 'origin', fetchUrl: 'git@github.com:user/easygit.git', pushUrl: 'git@github.com:user/easygit.git' },
  { name: 'upstream', fetchUrl: 'git@github.com:org/easygit.git', pushUrl: 'git@github.com:org/easygit.git' },
];

const MOCK_TAGS: GitTag[] = [
  { name: 'v1.2.0', hash: 'e5f6a7b8', message: 'Release 1.2.0 — Design system update', tagger: 'Elena Rodriguez', date: '2026-08-19T15:30:00Z', isAnnotated: true },
  { name: 'v1.1.0', hash: 'i9j0k1l2', message: 'Release 1.1.0 — Stash management', tagger: 'Elena Rodriguez', date: '2026-08-17T14:15:00Z', isAnnotated: true },
  { name: 'v1.0.0', hash: 'k1l2m3n4', message: 'Initial release', tagger: 'Sarah Chen', date: '2026-08-16T16:30:00Z', isAnnotated: true },
];

// ── Store ──────────────────────────────────────────────

interface RepositoryStore extends RepositoryState {
  setRepository: (path: string, name: string) => void;
  setBranch: (branch: string) => void;
  stageFile: (path: string) => void;
  unstageFile: (path: string) => void;
  stageAll: () => void;
  unstageAll: () => void;
  selectCommit: (hash: string | null) => void;
  selectedCommitHash: string | null;
  selectFile: (path: string | null) => void;
  selectedFile: string | null;
}

export const useRepositoryStore = create<RepositoryStore>((set, get) => ({
  path: 'C:/Projects/easygit',
  name: 'easygit',
  currentBranch: 'main',
  status: 'modified',
  ahead: 2,
  behind: 3,
  unstagedChanges: MOCK_UNSTAGED,
  stagedChanges: MOCK_STAGED,
  commits: MOCK_COMMITS,
  branches: MOCK_BRANCHES,
  remoteBranches: MOCK_REMOTE_BRANCHES,
  stashes: MOCK_STASHES,
  remotes: MOCK_REMOTES,
  tags: MOCK_TAGS,
  isLoading: false,
  error: undefined,
  selectedCommitHash: null,
  selectedFile: null,

  setRepository: (path, name) => set({ path, name }),
  setBranch: (branch) => set({ currentBranch: branch }),

  stageFile: (filePath) => set((state) => {
    const file = state.unstagedChanges.find(f => f.path === filePath);
    if (!file) return state;
    return {
      unstagedChanges: state.unstagedChanges.filter(f => f.path !== filePath),
      stagedChanges: [...state.stagedChanges, { ...file, staged: true }],
    };
  }),

  unstageFile: (filePath) => set((state) => {
    const file = state.stagedChanges.find(f => f.path === filePath);
    if (!file) return state;
    return {
      stagedChanges: state.stagedChanges.filter(f => f.path !== filePath),
      unstagedChanges: [...state.unstagedChanges, { ...file, staged: false }],
    };
  }),

  stageAll: () => set((state) => ({
    stagedChanges: [...state.stagedChanges, ...state.unstagedChanges.map(f => ({ ...f, staged: true }))],
    unstagedChanges: [],
  })),

  unstageAll: () => set((state) => ({
    unstagedChanges: [...state.unstagedChanges, ...state.stagedChanges.map(f => ({ ...f, staged: false }))],
    stagedChanges: [],
  })),

  selectCommit: (hash) => set({ selectedCommitHash: hash }),
  selectFile: (path) => set({ selectedFile: path }),
}));
