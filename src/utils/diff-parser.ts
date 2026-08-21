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

/**
 * Generate mock diff data for demo purposes
 */
export function generateMockDiff(filePath: string): GitFileDiff {
  const mockHunks: GitDiffHunk[] = [
    {
      oldStart: 1, oldLines: 8, newStart: 1, newLines: 12,
      header: 'import statements',
      lines: [
        { type: 'context', content: "import React from 'react';", oldLineNumber: 1, newLineNumber: 1 },
        { type: 'context', content: "import { useEffect, useRef } from 'react';", oldLineNumber: 2, newLineNumber: 2 },
        { type: 'delete', content: "import { drawGraph } from '../utils/graph';", oldLineNumber: 3 },
        { type: 'add', content: "import { GraphRenderer } from '../utils/graph-renderer';", newLineNumber: 3 },
        { type: 'add', content: "import { useRepositoryStore } from '../store';", newLineNumber: 4 },
        { type: 'add', content: "import type { GraphData } from '../types/git';", newLineNumber: 5 },
        { type: 'context', content: '', oldLineNumber: 4, newLineNumber: 6 },
        { type: 'context', content: "interface GitGraphProps {", oldLineNumber: 5, newLineNumber: 7 },
        { type: 'delete', content: "  data: any[];", oldLineNumber: 6 },
        { type: 'add', content: "  data: GraphData;", newLineNumber: 8 },
        { type: 'add', content: "  onSelectCommit?: (hash: string) => void;", newLineNumber: 9 },
        { type: 'context', content: '}', oldLineNumber: 7, newLineNumber: 10 },
      ]
    },
    {
      oldStart: 15, oldLines: 10, newStart: 19, newLines: 18,
      header: 'function GitGraph',
      lines: [
        { type: 'context', content: "export function GitGraph({ data, onSelectCommit }: GitGraphProps) {", oldLineNumber: 15, newLineNumber: 19 },
        { type: 'context', content: "  const canvasRef = useRef<HTMLCanvasElement>(null);", oldLineNumber: 16, newLineNumber: 20 },
        { type: 'add', content: "  const rendererRef = useRef<GraphRenderer | null>(null);", newLineNumber: 21 },
        { type: 'add', content: "  const commits = useRepositoryStore(s => s.commits);", newLineNumber: 22 },
        { type: 'context', content: '', oldLineNumber: 17, newLineNumber: 23 },
        { type: 'context', content: '  useEffect(() => {', oldLineNumber: 18, newLineNumber: 24 },
        { type: 'delete', content: '    if (!canvasRef.current) return;', oldLineNumber: 19 },
        { type: 'delete', content: '    const ctx = canvasRef.current.getContext("2d");', oldLineNumber: 20 },
        { type: 'delete', content: '    drawGraph(ctx, data);', oldLineNumber: 21 },
        { type: 'add', content: '    const canvas = canvasRef.current;', newLineNumber: 25 },
        { type: 'add', content: '    if (!canvas) return;', newLineNumber: 26 },
        { type: 'add', content: '', newLineNumber: 27 },
        { type: 'add', content: '    const renderer = new GraphRenderer(canvas, {', newLineNumber: 28 },
        { type: 'add', content: '      nodeRadius: 4,', newLineNumber: 29 },
        { type: 'add', content: '      lineWidth: 2,', newLineNumber: 30 },
        { type: 'add', content: '      rowHeight: 32,', newLineNumber: 31 },
        { type: 'add', content: '    });', newLineNumber: 32 },
        { type: 'add', content: '    rendererRef.current = renderer;', newLineNumber: 33 },
        { type: 'add', content: '    renderer.render(data);', newLineNumber: 34 },
        { type: 'context', content: '  }, [data]);', oldLineNumber: 22, newLineNumber: 35 },
        { type: 'context', content: '', oldLineNumber: 23, newLineNumber: 36 },
      ]
    },
  ];

  return {
    oldPath: filePath,
    newPath: filePath,
    status: 'modified',
    hunks: mockHunks,
    isBinary: false,
    additions: 14,
    deletions: 5,
  };
}
