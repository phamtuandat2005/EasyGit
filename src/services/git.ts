/**
 * src/services/git.ts
 * Parse raw git command output into typed objects.
 */

import type { GitCommit, GitChangedFile, GitBranch, GitStash, GitRemote, GitTag } from '../types/git';

const SEP = '|||';

// ── Log ───────────────────────────────────────────────────────────────────────
export function parseLog(output: string): GitCommit[] {
  if (!output.trim()) return [];

  return output.split('\n').filter(Boolean).map((line) => {
    const parts = line.split(SEP);
    const [hash, shortHash, author, authorEmail, date, message, parentHashesRaw, refsRaw] = parts;

    const parentHashes = (parentHashesRaw ?? '').trim().split(' ').filter(Boolean);

    const refs: GitCommit['refs'] = [];
    if (refsRaw) {
      for (const ref of refsRaw.split(',').map((r) => r.trim()).filter(Boolean)) {
        if (ref === 'HEAD' || ref.startsWith('HEAD ->')) {
          const branchName = ref.replace('HEAD -> ', '');
          if (branchName !== 'HEAD') {
            refs.push({ name: branchName, type: 'branch' });
          }
          refs.push({ name: 'HEAD', type: 'head' });
        } else if (ref.startsWith('tag: ')) {
          refs.push({ name: ref.replace('tag: ', ''), type: 'tag' });
        } else if (ref.includes('/')) {
          refs.push({ name: ref, type: 'remote-branch' });
        } else {
          refs.push({ name: ref, type: 'branch' });
        }
      }
    }

    return {
      hash: hash ?? '',
      shortHash: shortHash ?? '',
      author: author ?? '',
      authorEmail: authorEmail ?? '',
      date: date ?? '',
      message: message ?? '',
      parentHashes,
      refs,
      stats: { additions: 0, deletions: 0, filesChanged: 0 },
    };
  });
}

// ── Status ────────────────────────────────────────────────────────────────────
export function parseStatus(output: string): { staged: GitChangedFile[]; unstaged: GitChangedFile[] } {
  const staged: GitChangedFile[] = [];
  const unstaged: GitChangedFile[] = [];

  if (!output.trim()) return { staged, unstaged };

  for (const line of output.split('\n').filter(Boolean)) {
    if (line.length < 3) continue;
    const indexStatus = line[0]; // staged status
    const workStatus  = line[1]; // unstaged status
    const path = line.slice(3).trim();
    const filename = path.split('/').pop() ?? path;
    const directory = path.includes('/') ? path.substring(0, path.lastIndexOf('/')) : '.';

    const statusMap: Record<string, GitChangedFile['status']> = {
      M: 'modified', A: 'added', D: 'deleted', R: 'renamed', C: 'copied', '?': 'untracked', '!': 'ignored',
    };

    if (indexStatus !== ' ' && indexStatus !== '?') {
      staged.push({
        path, filename, directory,
        status: statusMap[indexStatus] ?? 'modified',
        additions: 0, deletions: 0, staged: true,
      });
    }
    if (workStatus !== ' ') {
      unstaged.push({
        path, filename, directory,
        status: workStatus === '?' ? 'untracked' : (statusMap[workStatus] ?? 'modified'),
        additions: 0, deletions: 0, staged: false,
      });
    }
  }

  return { staged, unstaged };
}

// ── Branches ──────────────────────────────────────────────────────────────────
export function parseBranches(output: string): GitBranch[] {
  if (!output.trim()) return [];

  const branches: GitBranch[] = [];

  for (const line of output.split('\n').filter(Boolean)) {
    const parts = line.split('|');
    if (parts.length < 3) continue;
    const [headMark, name, , upstream, track] = parts;
    if (!name) continue;

    const isCurrent = headMark.trim() === '*';
    const isRemote = name.startsWith('remotes/') || name.startsWith('origin/');
    const cleanName = name.replace(/^remotes\//, '').trim();

    // Parse ahead/behind from track like "[ahead 2, behind 1]"
    let ahead = 0;
    let behind = 0;
    if (track) {
      const aMatch = track.match(/ahead (\d+)/);
      const bMatch = track.match(/behind (\d+)/);
      if (aMatch) ahead = parseInt(aMatch[1]);
      if (bMatch) behind = parseInt(bMatch[1]);
    }

    branches.push({
      name: cleanName,
      isRemote,
      isCurrent,
      upstream: upstream?.trim() || undefined,
      tracking: upstream?.trim() || undefined,
      ahead,
      behind,
    });
  }

  return branches;
}

// ── Stashes ───────────────────────────────────────────────────────────────────
export function parseStashes(output: string): GitStash[] {
  if (!output.trim()) return [];

  return output.split('\n').filter(Boolean).map((line, index) => {
    const parts = line.split('|');
    const [ref, subject, date] = parts;
    const indexNum = parseInt(ref?.match(/\{(\d+)\}/)?.[1] ?? String(index));
    // Extract branch from subject like "WIP on main: abc message"
    const branchMatch = subject?.match(/^(?:WIP on|On) ([^:]+)/);
    const branch = branchMatch?.[1] ?? 'unknown';
    const message = subject?.replace(/^(?:WIP on|On) [^:]+: /, '') ?? subject ?? '';

    return {
      index: indexNum,
      message,
      date: date ?? '',
      branch,
      filesChanged: 0,
      additions: 0,
      deletions: 0,
    };
  });
}

// ── Remotes ───────────────────────────────────────────────────────────────────
export function parseRemotes(output: string): GitRemote[] {
  if (!output.trim()) return [];

  const map = new Map<string, GitRemote>();
  for (const line of output.split('\n').filter(Boolean)) {
    const match = line.match(/^(\S+)\s+(\S+)\s+\((fetch|push)\)$/);
    if (!match) continue;
    const [, name, url, type] = match;
    if (!map.has(name)) {
      map.set(name, { name, fetchUrl: '', pushUrl: '' });
    }
    const remote = map.get(name)!;
    if (type === 'fetch') remote.fetchUrl = url;
    else remote.pushUrl = url;
  }
  return Array.from(map.values());
}

// ── Tags ──────────────────────────────────────────────────────────────────────
export function parseTags(output: string): GitTag[] {
  if (!output.trim()) return [];

  return output.split('\n').filter(Boolean).map((line) => {
    const parts = line.split('|');
    const [name, hash, date, message, tagger] = parts;
    return {
      name: name ?? '',
      hash: hash ?? '',
      message: message ?? '',
      tagger: tagger ?? '',
      date: date ?? '',
      isAnnotated: !!tagger,
    };
  });
}

// ── Diff ──────────────────────────────────────────────────────────────────────
export function parseDiff(output: string, filePath: string): import('../types/git').GitFileDiff {
  const lines = output.split('\n');
  const hunks: import('../types/git').GitDiffHunk[] = [];
  let additions = 0;
  let deletions = 0;
  let currentHunk: import('../types/git').GitDiffHunk | null = null;
  let oldLineNum = 0;
  let newLineNum = 0;
  let isBinary = false;

  for (const line of lines) {
    if (line.startsWith('Binary files')) {
      isBinary = true;
      continue;
    }
    if (line.startsWith('diff --git')) continue;
    if (line.startsWith('index ')) continue;
    if (line.startsWith('--- ')) continue;
    if (line.startsWith('+++ ')) continue;
    
    if (line.startsWith('@@ ')) {
      const match = line.match(/@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@/);
      if (match) {
        currentHunk = {
          oldStart: parseInt(match[1]),
          oldLines: match[2] ? parseInt(match[2]) : 1,
          newStart: parseInt(match[3]),
          newLines: match[4] ? parseInt(match[4]) : 1,
          header: line,
          lines: []
        };
        hunks.push(currentHunk);
        oldLineNum = currentHunk.oldStart;
        newLineNum = currentHunk.newStart;
      }
      continue;
    }
    
    if (currentHunk) {
      if (line.startsWith('+')) {
        currentHunk.lines.push({ type: 'add', content: line.substring(1), newLineNumber: newLineNum++ });
        additions++;
      } else if (line.startsWith('-')) {
        currentHunk.lines.push({ type: 'delete', content: line.substring(1), oldLineNumber: oldLineNum++ });
        deletions++;
      } else if (line.startsWith(' ')) {
        currentHunk.lines.push({ type: 'context', content: line.substring(1), oldLineNumber: oldLineNum++, newLineNumber: newLineNum++ });
      }
    }
  }

  return {
    oldPath: filePath,
    newPath: filePath,
    status: 'modified',
    hunks,
    isBinary,
    additions,
    deletions
  };
}
