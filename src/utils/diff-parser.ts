import type { GitDiffHunk, GitDiffLine, GitFileDiff, GitFileStatus } from '../types/git';

/**
 * Parse unified diff output into structured data
 */
export function parseDiff(diffText: string): GitFileDiff[] {
  const files: GitFileDiff[] = [];
  const fileBlocks = diffText.split(/^diff --git /m).filter(Boolean);

  for (const block of fileBlocks) {
    const lines = block.split('\n');
    const headerMatch = lines[0]?.match(/a\/(.*?) b\/(.*)/);
    if (!headerMatch) continue;

    const oldPath = headerMatch[1];
    const newPath = headerMatch[2];

    let status: GitFileStatus = 'modified';
    if (block.includes('new file')) status = 'added';
    else if (block.includes('deleted file')) status = 'deleted';
    else if (block.includes('rename from')) status = 'renamed';

    const isBinary = block.includes('Binary files');
    const hunks: GitDiffHunk[] = [];
    let additions = 0;
    let deletions = 0;

    if (!isBinary) {
      const hunkMatches = block.matchAll(/@@ -(\d+)(?:,(\d+))? \+(\d+)(?:,(\d+))? @@(.*)/g);

      for (const match of hunkMatches) {
        const oldStart = parseInt(match[1], 10);
        const oldLines = parseInt(match[2] ?? '1', 10);
        const newStart = parseInt(match[3], 10);
        const newLines = parseInt(match[4] ?? '1', 10);
        const header = match[5]?.trim() ?? '';

        const hunkStartIndex = block.indexOf(match[0]) + match[0].length;
        const nextHunkIndex = block.indexOf('\n@@', hunkStartIndex);
        const hunkContent = nextHunkIndex === -1
          ? block.slice(hunkStartIndex)
          : block.slice(hunkStartIndex, nextHunkIndex);

        const diffLines: GitDiffLine[] = [];
        let oldNum = oldStart;
        let newNum = newStart;

        for (const line of hunkContent.split('\n')) {
          if (line.startsWith('+')) {
            diffLines.push({ type: 'add', content: line.slice(1), newLineNumber: newNum++ });
            additions++;
          } else if (line.startsWith('-')) {
            diffLines.push({ type: 'delete', content: line.slice(1), oldLineNumber: oldNum++ });
            deletions++;
          } else if (line.startsWith(' ') || line === '') {
            diffLines.push({ type: 'context', content: line.slice(1) || '', oldLineNumber: oldNum++, newLineNumber: newNum++ });
          }
        }

        hunks.push({ oldStart, oldLines, newStart, newLines, header, lines: diffLines });
      }
    }

    files.push({ oldPath, newPath, status, hunks, isBinary, additions, deletions });
  }

  return files;
}
