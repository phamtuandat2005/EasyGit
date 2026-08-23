import type { GitOperationDescriptor, GitOperationType } from '../types/git';

export function describeGitOperation(type: GitOperationType, args: Record<string, string | boolean | number | undefined>): GitOperationDescriptor {
  switch (type) {
    case 'stage': {
      const file = String(args.file ?? '');
      return { type, command: `git add -- ${file}`, explanation: 'Working Tree → Staging Area' };
    }
    case 'unstage': {
      const file = String(args.file ?? '');
      return { type, command: `git reset HEAD -- ${file}`, explanation: 'Staging Area → Working Tree' };
    }
    case 'stageAll':
      return { type, command: 'git add -A', explanation: 'Working Tree → Staging Area' };
    case 'unstageAll':
      return { type, command: 'git reset HEAD', explanation: 'Staging Area → Working Tree' };
    case 'commit': {
      const message = String(args.message ?? '');
      return { type, command: `git commit -m "${message.replace(/"/g, '\\"')}"`, explanation: 'Staging Area → New Commit' };
    }
    case 'push': {
      const remote = String(args.remote ?? 'origin');
      const branch = String(args.branch ?? 'main');
      return { type, command: `git push ${remote} ${branch}`, explanation: 'Local Commits → origin/main' };
    }
    case 'pull': {
      const remote = String(args.remote ?? 'origin');
      const branch = String(args.branch ?? 'main');
      return { type, command: `git pull ${remote} ${branch}`, explanation: 'origin/main → Local Branch' };
    }
    case 'fetch': {
      const remote = String(args.remote ?? 'origin');
      return { type, command: `git fetch ${remote}`, explanation: 'Remote refs → Remote-tracking refs' };
    }
    case 'createBranch': {
      const name = String(args.name ?? '');
      const startPoint = String(args.startPoint ?? 'HEAD');
      return { type, command: `git branch ${name} ${startPoint}`.trim(), explanation: 'Create branch ref' };
    }
    case 'checkout': {
      const branch = String(args.branch ?? '');
      return { type, command: `git checkout ${branch}`, explanation: 'Switch working tree to branch' };
    }
    case 'merge': {
      const branch = String(args.branch ?? '');
      const noFF = args.noFF ? ' --no-ff' : '';
      return { type, command: `git merge${noFF} ${branch}`.trim(), explanation: 'Integrate branch history' };
    }
    case 'stash': {
      return { type, command: 'git stash push', explanation: 'Working Tree → Stash' };
    }
    case 'stashPop':
      return { type, command: `git stash pop${args.index !== undefined ? ` stash@{${args.index}}` : ''}`.trim(), explanation: 'Stash → Working Tree' };
    case 'stashApply':
      return { type, command: `git stash apply${args.index !== undefined ? ` stash@{${args.index}}` : ''}`.trim(), explanation: 'Stash → Working Tree' };
    case 'stashDrop':
      return { type, command: `git stash drop stash@{${args.index ?? 0}}`, explanation: 'Remove stash entry' };
    case 'discard':
      return { type, command: `git checkout HEAD -- ${String(args.file ?? '')}`.trim(), explanation: 'Discard local changes' };
    case 'reset': {
      const mode = String(args.mode ?? 'mixed');
      const target = String(args.target ?? 'HEAD');
      return { type, command: `git reset --${mode} ${target}`.trim(), explanation: 'Move HEAD and optionally index/working tree' };
    }
    case 'revert': {
      const hash = String(args.hash ?? '');
      return { type, command: `git revert --no-edit ${hash}`, explanation: 'Create inverse commit' };
    }
    default:
      return { type, command: 'git', explanation: 'Git operation' };
  }
}
