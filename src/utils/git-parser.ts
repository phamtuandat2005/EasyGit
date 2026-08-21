/**
 * Parse git status output
 */
export function parseGitStatus(output: string) {
  const lines = output.trim().split('\n').filter(Boolean);
  const files = [];

  for (const line of lines) {
    const staged = line[0];
    const unstaged = line[1];
    const path = line.slice(3).trim();
    const filename = path.split('/').pop() || path;
    const directory = path.split('/').slice(0, -1).join('/') || '.';

    if (staged !== ' ' && staged !== '?') {
      files.push({
        path,
        filename,
        directory,
        status: statusFromLetter(staged),
        additions: 0,
        deletions: 0,
        staged: true,
      });
    }

    if (unstaged !== ' ') {
      files.push({
        path,
        filename,
        directory,
        status: unstaged === '?' ? 'untracked' as const : statusFromLetter(unstaged),
        additions: 0,
        deletions: 0,
        staged: false,
      });
    }
  }

  return files;
}

function statusFromLetter(letter: string) {
  const map: Record<string, string> = {
    'M': 'modified',
    'A': 'added',
    'D': 'deleted',
    'R': 'renamed',
    'C': 'copied',
    'U': 'conflict',
    '?': 'untracked',
  };
  return (map[letter] || 'modified') as 'modified' | 'added' | 'deleted' | 'renamed' | 'copied' | 'conflict' | 'untracked';
}

/**
 * Parse git log output (--format=...)
 */
export function parseGitLog(output: string) {
  // Expected format: hash|shortHash|author|email|date|message|parentHashes|refs
  const lines = output.trim().split('\n').filter(Boolean);
  return lines.map(line => {
    const [hash, shortHash, author, authorEmail, date, message, parentHashStr, refStr] = line.split('|');
    const parentHashes = parentHashStr ? parentHashStr.split(' ').filter(Boolean) : [];
    const refs = refStr ? parseRefs(refStr) : [];

    return { hash, shortHash, author, authorEmail, date, message, parentHashes, refs };
  });
}

function parseRefs(refStr: string) {
  if (!refStr || refStr === '') return [];
  return refStr.split(', ').map(ref => {
    const trimmed = ref.trim().replace(/[()]/g, '');
    if (trimmed === 'HEAD') return { name: 'HEAD', type: 'head' as const };
    if (trimmed.startsWith('tag: ')) return { name: trimmed.replace('tag: ', ''), type: 'tag' as const };
    if (trimmed.includes('/')) return { name: trimmed, type: 'remote-branch' as const };
    return { name: trimmed, type: 'branch' as const };
  });
}
