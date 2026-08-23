import { describe, expect, it } from 'vitest';
import { buildGraphData } from './graph';
import type { GitCommit } from '../types/git';

const commit = (hash: string, parents: string[] = [], refs: GitCommit['refs'] = []): GitCommit => ({
  hash,
  shortHash: hash.slice(0, 7),
  author: 'A',
  authorEmail: 'a@example.com',
  date: '2026-08-23T00:00:00Z',
  message: hash,
  parentHashes: parents,
  refs,
});

describe('buildGraphData', () => {
  it('renders linear history', () => {
    const commits = [commit('c3', ['c2']), commit('c2', ['c1']), commit('c1')];
    const graph = buildGraphData(commits);
    expect(graph.nodes).toHaveLength(3);
    expect(graph.edges).toHaveLength(2);
    expect(graph.nodes.map((n) => n.row)).toEqual([0, 1, 2]);
  });

  it('keeps merge parents in the graph', () => {
    const commits = [
      commit('merge', ['main', 'feature'], [{ name: 'main', type: 'branch' }, { name: 'HEAD', type: 'head' }]),
      commit('main', ['base']),
      commit('feature', ['base']),
      commit('base'),
    ];

    const graph = buildGraphData(commits);
    expect(graph.edges).toHaveLength(4);
    expect(graph.edges.some((edge) => edge.isMerge)).toBe(true);
  });

  it('supports detached HEAD refs without branch refs', () => {
    const graph = buildGraphData([
      commit('head', ['parent'], [{ name: 'HEAD', type: 'head' }]),
      commit('parent'),
    ]);

    expect(graph.nodes[0].commit.refs).toEqual([{ name: 'HEAD', type: 'head' }]);
  });
});
