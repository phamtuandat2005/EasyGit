import { describe, expect, it } from 'vitest';
import { parseBranches, parseDiff, parseLog, parseStatus } from './git';

describe('parseStatus', () => {
  it('separates staged, unstaged, untracked and conflict files', () => {
    const result = parseStatus([
      'M  staged.ts',
      ' M working.ts',
      '?? new file.ts',
      'UU conflict.ts',
    ].join('\n'));

    expect(result.staged.map((file) => [file.path, file.status])).toEqual([
      ['staged.ts', 'modified'],
      ['conflict.ts', 'conflict'],
    ]);
    expect(result.unstaged.map((file) => [file.path, file.status])).toEqual([
      ['working.ts', 'modified'],
      ['new file.ts', 'untracked'],
      ['conflict.ts', 'conflict'],
    ]);
  });
});

describe('parseLog', () => {
  it('parses parents and branch/tag refs', () => {
    const output = [
      'abc123|||abc123|||Alice|||alice@example.com|||2026-08-23T10:00:00+00:00|||Merge feature|||parent1 parent2|||HEAD -> main, tag: v1.0.0, origin/main',
    ].join('\n');

    const [commit] = parseLog(output);

    expect(commit.parentHashes).toEqual(['parent1', 'parent2']);
    expect(commit.refs).toEqual([
      { name: 'main', type: 'branch' },
      { name: 'HEAD', type: 'head' },
      { name: 'v1.0.0', type: 'tag' },
      { name: 'origin/main', type: 'remote-branch' },
    ]);
  });
});

describe('parseBranches', () => {
  it('parses current, remote and tracking state', () => {
    const result = parseBranches([
      '*|main|abc123|origin/main|[ahead 2, behind 1]',
      ' |remotes/origin/main|abc123||',
    ].join('\n'));

    expect(result[0]).toMatchObject({
      name: 'main',
      isCurrent: true,
      isRemote: false,
      ahead: 2,
      behind: 1,
      tracking: 'origin/main',
    });
    expect(result[1]).toMatchObject({ name: 'origin/main', isRemote: true });
  });
});

describe('parseDiff', () => {
  it('counts changes and preserves line numbers', () => {
    const diff = parseDiff([
      'diff --git a/file.ts b/file.ts',
      '--- a/file.ts',
      '+++ b/file.ts',
      '@@ -1,2 +1,3 @@',
      ' context',
      '-old',
      '+new',
      '+added',
    ].join('\n'), 'file.ts');

    expect(diff.additions).toBe(2);
    expect(diff.deletions).toBe(1);
    expect(diff.hunks[0].lines).toEqual([
      { type: 'context', content: 'context', oldLineNumber: 1, newLineNumber: 1 },
      { type: 'delete', content: 'old', oldLineNumber: 2 },
      { type: 'add', content: 'new', newLineNumber: 2 },
      { type: 'add', content: 'added', newLineNumber: 3 },
    ]);
  });
});
