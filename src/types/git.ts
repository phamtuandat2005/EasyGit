/* ============================================
   Git Entity Types
   ============================================ */

export type GitFileStatus = 'modified' | 'added' | 'deleted' | 'renamed' | 'conflict' | 'untracked';



export interface GitChangedFile {
  path: string;
  filename: string;
  directory: string;
  status: GitFileStatus;
  additions: number;
  deletions: number;
  staged: boolean;
  oldPath?: string; // for renames
}

export interface GitCommit {
  hash: string;
  shortHash: string;
  author: string;
  authorEmail: string;
  date: string;
  message: string;
  body?: string;
  parentHashes: string[];
  refs: GitRef[];
  stats?: {
    additions: number;
    deletions: number;
    filesChanged: number;
  };
}

export interface GitRef {
  name: string;
  type: 'branch' | 'remote-branch' | 'tag' | 'head';
}

export interface GitBranch {
  name: string;
  isRemote: boolean;
  isCurrent: boolean;
  upstream?: string;
  ahead: number;
  behind: number;
  lastCommit?: GitCommit;
  tracking?: string;
}

export interface GitStash {
  index: number;
  message: string;
  date: string;
  branch: string;
  filesChanged: number;
  additions: number;
  deletions: number;
}

export interface GitRemote {
  name: string;
  fetchUrl: string;
  pushUrl: string;
}

export interface GitTag {
  name: string;
  hash: string;
  message?: string;
  tagger?: string;
  date?: string;
  isAnnotated: boolean;
}

export interface GitDiffHunk {
  oldStart: number;
  oldLines: number;
  newStart: number;
  newLines: number;
  header: string;
  lines: GitDiffLine[];
}

export interface GitDiffLine {
  type: 'add' | 'delete' | 'context' | 'header';
  content: string;
  oldLineNumber?: number;
  newLineNumber?: number;
}

export interface GitFileDiff {
  oldPath: string;
  newPath: string;
  status: GitFileStatus;
  hunks: GitDiffHunk[];
  isBinary: boolean;
  additions: number;
  deletions: number;
}

export type RepositoryStatus = 'clean' | 'modified' | 'conflict' | 'rebasing' | 'merging' | 'detached';

export interface RepositoryState {
  path: string | null;
  name: string;
  currentBranch: string;
  status: RepositoryStatus;
  ahead: number;
  behind: number;
  unstagedChanges: GitChangedFile[];
  stagedChanges: GitChangedFile[];
  commits: GitCommit[];
  branches: GitBranch[];
  remoteBranches: GitBranch[];
  stashes: GitStash[];
  remotes: GitRemote[];
  tags: GitTag[];
  isLoading: boolean;
  error?: string;
}

// Graph types for DAG rendering
export interface GraphNode {
  commit: GitCommit;
  column: number;
  row: number;
  color: string;
}

export interface GraphEdge {
  fromRow: number;
  fromCol: number;
  toRow: number;
  toCol: number;
  color: string;
  isMerge: boolean;
}

export interface GraphData {
  nodes: GraphNode[];
  edges: GraphEdge[];
  maxColumns: number;
}
