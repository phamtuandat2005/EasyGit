import type { GitCommit, GraphData, GraphNode, GraphEdge } from '../types/git';
import { stringToColor } from '../utils/format';

const keyOf = (hash: string) => hash.toLowerCase();

export function buildGraphData(commits: GitCommit[]): GraphData {
  const nodes: GraphNode[] = [];
  const edges: GraphEdge[] = [];
  const commitIndex = new Map<string, number>();
  const columnByCommit = new Map<string, number>();
  const laneHeads: Array<string | null> = [];

  commits.forEach((commit, index) => {
    commitIndex.set(keyOf(commit.hash), index);
    commitIndex.set(keyOf(commit.shortHash), index);
  });

  commits.forEach((commit, row) => {
    const commitKey = keyOf(commit.hash);
    const parentKeys = commit.parentHashes.map(keyOf);

    let column = columnByCommit.get(commitKey);
    if (column === undefined) {
      const reused = laneHeads.findIndex((laneHead) => laneHead && parentKeys.includes(keyOf(laneHead)));
      column = reused >= 0 ? reused : laneHeads.findIndex((laneHead) => laneHead === null);
      if (column === -1) column = laneHeads.length;
      laneHeads[column] = commit.hash;
    }

    columnByCommit.set(commitKey, column);
    nodes.push({ commit, row, column, color: stringToColor(commit.hash) });

    commit.parentHashes.forEach((parentHash, parentIndex) => {
      const parentRow = commitIndex.get(keyOf(parentHash));
      if (parentRow === undefined) return;
      const parentCommit = commits[parentRow];
      const parentKey = keyOf(parentCommit.hash);
      const targetColumn = columnByCommit.get(parentKey) ?? column;

      columnByCommit.set(parentKey, targetColumn);
      laneHeads[targetColumn] = parentCommit.hash;
      edges.push({
        fromRow: row,
        fromCol: column,
        toRow: parentRow,
        toCol: targetColumn,
        color: stringToColor(commit.hash),
        isMerge: parentIndex > 0,
      });
    });
  });

  const maxColumns = Math.max(1, ...nodes.map((node) => node.column + 1));
  return { nodes, edges, maxColumns };
}
