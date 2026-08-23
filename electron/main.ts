import { app, BrowserWindow, ipcMain, dialog, Menu, shell } from 'electron';
import { join } from 'path';
import { rm } from 'fs/promises';
import { execFile } from 'child_process';
import { promisify } from 'util';
import type { GitResult } from '../src/types/git';

const execFileAsync = promisify(execFile);

process.env.DIST = join(__dirname, '../dist');
process.env.VITE_PUBLIC = app.isPackaged ? process.env.DIST : join(process.env.DIST, '../public');

let win: BrowserWindow | null;
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL'];

// ── Git runner ────────────────────────────────────────────────────────────────
async function git(repoPath: string, args: string[]): Promise<string> {
  const { stdout } = await execFileAsync('git', ['-C', repoPath, ...args], {
    maxBuffer: 50 * 1024 * 1024, // 50MB
    encoding: 'utf8',
  });
  return stdout.trim();
}

function ok<T = undefined>(data?: T, stdout = ''): GitResult<T> {
  return { success: true, data, stdout, stderr: '', code: 0 };
}

function fail(command: string[], error: any): GitResult {
  return {
    success: false,
    stdout: typeof error?.stdout === 'string' ? error.stdout : '',
    stderr: typeof error?.stderr === 'string' ? error.stderr : '',
    code: typeof error?.code === 'number' || typeof error?.code === 'string' ? error.code : undefined,
    error: error?.message ?? String(error),
    meta: {
      kind: /CONFLICT|conflict/i.test(error?.message ?? '') ? 'conflict' : 'unknown',
      actionable: /auth|permission/i.test(error?.message ?? '') ? 'Check credentials or repository permissions.' : 'Inspect stderr and retry the operation.',
      command,
    },
  };
}

// ── Menu ──────────────────────────────────────────────────────────────────────
function buildMenu() {
  const isMac = process.platform === 'darwin';
  const template: Electron.MenuItemConstructorOptions[] = [
    {
      label: 'File',
      submenu: [
        {
          label: 'New Repository...',
          accelerator: 'CmdOrCtrl+N',
          click: async () => {
            if (!win) return;
            const { canceled, filePaths } = await dialog.showOpenDialog(win, {
              properties: ['openDirectory'],
              title: 'Initialize Git Repository',
            });
            if (!canceled && filePaths[0]) {
              win.webContents.send('menu-action', 'init-repo');
              // We'll need to pass the path as well, so let's send a custom event or include the path
              win.webContents.send('init-repository', filePaths[0]);
            }
          }
        },
        {
          label: 'Open Repository...',
          accelerator: 'CmdOrCtrl+O',
          click: async () => {
            if (!win) return;
            const { canceled, filePaths } = await dialog.showOpenDialog(win, {
              properties: ['openDirectory'],
              title: 'Open Git Repository',
            });
            if (!canceled && filePaths[0]) {
              win.webContents.send('open-repository', filePaths[0]);
            }
          },
        },
        {
          label: 'Clone Repository...',
          accelerator: 'CmdOrCtrl+Shift+O',
          click: () => win?.webContents.send('menu-action', 'clone'),
        },
        { type: 'separator' },
        {
          label: 'Settings',
          accelerator: 'CmdOrCtrl+,',
          click: () => win?.webContents.send('menu-action', 'settings'),
        },
        { type: 'separator' },
        isMac ? { role: 'close' as const } : { role: 'quit' as const },
      ],
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' as const }, { role: 'redo' as const },
        { type: 'separator' },
        { role: 'cut' as const }, { role: 'copy' as const },
        { role: 'paste' as const }, { role: 'selectAll' as const },
      ],
    },
    {
      label: 'View',
      submenu: [
        { label: 'Changes',          accelerator: 'CmdOrCtrl+1', click: () => win?.webContents.send('menu-action', 'view:changes') },
        { label: 'History',          accelerator: 'CmdOrCtrl+2', click: () => win?.webContents.send('menu-action', 'view:history') },
        { label: 'Graph',            accelerator: 'CmdOrCtrl+3', click: () => win?.webContents.send('menu-action', 'view:graph') },
        { label: 'Branches',                                      click: () => win?.webContents.send('menu-action', 'view:branches') },
        { type: 'separator' },
        { label: 'Command Palette',  accelerator: 'CmdOrCtrl+K', click: () => win?.webContents.send('menu-action', 'command-palette') },
        { type: 'separator' },
        { role: 'reload' as const }, { role: 'forceReload' as const }, { role: 'toggleDevTools' as const },
        { type: 'separator' },
        { role: 'resetZoom' as const }, { role: 'zoomIn' as const }, { role: 'zoomOut' as const },
        { type: 'separator' },
        { role: 'togglefullscreen' as const },
      ],
    },
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' as const },
        { role: 'zoom' as const },
        ...(isMac ? [{ type: 'separator' as const }, { role: 'front' as const }] : [{ role: 'close' as const }]),
      ],
    },
    {
      label: 'Help',
      submenu: [
        { label: 'EasyGit Documentation', click: () => shell.openExternal('https://github.com/') },
        { label: 'Report an Issue',       click: () => shell.openExternal('https://github.com/') },
        { type: 'separator' },
        { label: 'About EasyGit',         click: () => win?.webContents.send('menu-action', 'about') },
      ],
    },
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

// ── Window ────────────────────────────────────────────────────────────────────
function createWindow() {
  win = new BrowserWindow({
    title: 'EasyGit — Professional Git Client',
    width: 1280,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    webPreferences: {
      preload: join(__dirname, 'preload.js'),
    },
  });

  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString());
  });

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(join(process.env.DIST as string, 'index.html'));
  }
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') { app.quit(); win = null; }
});
app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

app.whenReady().then(() => {
  buildMenu();
  createWindow();

  // ── Dialog ──────────────────────────────────────────────────────────────────
  ipcMain.handle('dialog:openDirectory', async () => {
    if (!win) return null;
    const { canceled, filePaths } = await dialog.showOpenDialog(win, {
      properties: ['openDirectory'],
    });
    return canceled ? null : filePaths[0];
  });

  // ── git:openRepo — validate that the path is a git repo ────────────────────
  ipcMain.handle('git:openRepo', async (_, repoPath: string) => {
    try {
      const root = await git(repoPath, ['rev-parse', '--show-toplevel']);
      return ok({ root: root.trim() });
    } catch (e: any) {
      return fail(['rev-parse', '--show-toplevel'], e);
    }
  });

  // ── git:log ─────────────────────────────────────────────────────────────────
  // Format: hash|shortHash|author|email|isoDate|message|parentHashes|refs
  ipcMain.handle('git:log', async (_, repoPath: string, maxCount = 200) => {
    try {
      const SEP = '|||';
      const fmt = `%H${SEP}%h${SEP}%an${SEP}%ae${SEP}%aI${SEP}%s${SEP}%P${SEP}%D`;
      const output = await git(repoPath, ['log', `--max-count=${maxCount}`, `--format=${fmt}`]);
      return ok(output, output);
    } catch (e: any) {
      return fail(['log', `--max-count=${maxCount}`], e);
    }
  });

  // ── git:status ──────────────────────────────────────────────────────────────
  ipcMain.handle('git:status', async (_, repoPath: string) => {
    try {
      const output = await git(repoPath, ['status', '--porcelain=v1', '-u']);
      return ok(output, output);
    } catch (e: any) {
      return fail(['status', '--porcelain=v1', '-u'], e);
    }
  });

  // ── git:branches ────────────────────────────────────────────────────────────
  ipcMain.handle('git:branches', async (_, repoPath: string) => {
    try {
      const output = await git(repoPath, [
        'branch', '-a', '-vv',
        '--format=%(if)%(HEAD)%(then)*%(else) %(end)|%(refname:short)|%(objectname:short)|%(upstream:short)|%(upstream:track)',
      ]);
      return ok(output, output);
    } catch (e: any) {
      return fail(['branch', '-a', '-vv'], e);
    }
  });

  // ── git:stashes ─────────────────────────────────────────────────────────────
  ipcMain.handle('git:stashes', async (_, repoPath: string) => {
    try {
      const output = await git(repoPath, ['stash', 'list', '--format=%gd|%s|%aI|%gs']);
      return { success: true, output };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  });

  // ── git:remotes ─────────────────────────────────────────────────────────────
  ipcMain.handle('git:remotes', async (_, repoPath: string) => {
    try {
      const output = await git(repoPath, ['remote', '-v']);
      return { success: true, output };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  });

  // ── git:tags ─────────────────────────────────────────────────────────────────
  ipcMain.handle('git:tags', async (_, repoPath: string) => {
    try {
      const output = await git(repoPath, [
        'tag', '-l', '--sort=-creatordate',
        '--format=%(refname:short)|%(objectname:short)|%(creatordate:iso)|%(subject)|%(taggername)',
      ]);
      return { success: true, output };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  });

  // ── git:diff ─────────────────────────────────────────────────────────────────
  ipcMain.handle('git:diff', async (_, repoPath: string, filePath: string, staged = false) => {
    try {
      const args = staged
        ? ['diff', '--cached', '--', filePath]
        : ['diff', 'HEAD', '--', filePath];
      const output = await git(repoPath, args);
      return { success: true, output };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  });

  // ── git:currentBranch ────────────────────────────────────────────────────────
  ipcMain.handle('git:currentBranch', async (_, repoPath: string) => {
    try {
      const output = await git(repoPath, ['rev-parse', '--abbrev-ref', 'HEAD']);
      return { success: true, output };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  });

  // ── git:createBranch ─────────────────────────────────────────────────────────
  ipcMain.handle('git:createBranch', async (_, repoPath: string, name: string) => {
    try {
      await git(repoPath, ['branch', name]);
      // Optional: automatically checkout? The user usually expects to checkout after creating,
      // but 'git branch <name>' just creates it. Let's stick to standard git semantics.
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  });

  // ── git:checkout ─────────────────────────────────────────────────────────────
  ipcMain.handle('git:checkout', async (_, repoPath: string, branch: string) => {
    try {
      await git(repoPath, ['checkout', branch]);
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  });

  // ── git:syncStatus (ahead/behind) ────────────────────────────────────────────
  ipcMain.handle('git:syncStatus', async (_, repoPath: string) => {
    try {
      const output = await git(repoPath, ['rev-list', '--left-right', '--count', 'HEAD...@{upstream}']);
      const [ahead, behind] = output.split('\t').map(Number);
      return { success: true, ahead: ahead || 0, behind: behind || 0 };
    } catch {
      return { success: true, ahead: 0, behind: 0 };
    }
  });

  // ── git:stage / unstage / stageAll / unstageAll ───────────────────────────────
  ipcMain.handle('git:stage', async (_, repoPath: string, filePath: string) => {
    try {
      await git(repoPath, ['add', '--', filePath]);
      return { success: true };
    } catch (e: any) { return { success: false, error: e.message }; }
  });

  ipcMain.handle('git:unstage', async (_, repoPath: string, filePath: string) => {
    try {
      await git(repoPath, ['reset', 'HEAD', '--', filePath]);
      return { success: true };
    } catch (e: any) { return { success: false, error: e.message }; }
  });

  ipcMain.handle('git:stageAll', async (_, repoPath: string) => {
    try {
      await git(repoPath, ['add', '-A']);
      return { success: true };
    } catch (e: any) { return { success: false, error: e.message }; }
  });

  ipcMain.handle('git:unstageAll', async (_, repoPath: string) => {
    try {
      await git(repoPath, ['reset', 'HEAD']);
      return { success: true };
    } catch (e: any) { return { success: false, error: e.message }; }
  });

  ipcMain.handle('fs:deletePath', async (_, paths: string[]) => {
    try {
      const uniquePaths = Array.from(new Set((paths ?? []).filter(Boolean)));
      await Promise.all(uniquePaths.map((p) => rm(p, { recursive: true, force: true })));
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  });

  ipcMain.handle('git:remove', async (_, repoPath: string, files: string[], options?: { cached?: boolean }) => {
    try {
      const uniqueFiles = Array.from(new Set((files ?? []).filter(Boolean)));
      if (uniqueFiles.length === 0) return { success: false, error: 'No files provided' };
      if (options?.cached) {
        await git(repoPath, ['rm', '--cached', '--', ...uniqueFiles]);
        return { success: true };
      }
      await git(repoPath, ['rm', '-f', '--', ...uniqueFiles]);
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  });

  ipcMain.handle('git:restore', async (_, repoPath: string, files: string[]) => {
    try {
      const uniqueFiles = Array.from(new Set((files ?? []).filter(Boolean)));
      if (uniqueFiles.length === 0) return { success: false, error: 'No files provided' };
      await git(repoPath, ['restore', '--staged', '--worktree', '--', ...uniqueFiles]);
      return { success: true };
    } catch (e: any) {
      try {
        await git(repoPath, ['checkout', 'HEAD', '--', ...(files ?? [])]);
        return { success: true };
      } catch (err: any) {
        return { success: false, error: err.message };
      }
    }
  });

  // ── git:commit ───────────────────────────────────────────────────────────────
  ipcMain.handle('git:commit', async (_, repoPath: string, message: string) => {
    try {
      await git(repoPath, ['commit', '-m', message]);
      return { success: true };
    } catch (e: any) { return { success: false, error: e.message }; }
  });

  // ── git:push / pull / fetch ──────────────────────────────────────────────
  ipcMain.handle('git:push', async (_, repoPath: string) => {
    try {
      await git(repoPath, ['push']);
      return { success: true };
    } catch (e: any) { return { success: false, error: e.message }; }
  });

  ipcMain.handle('git:pull', async (_, repoPath: string) => {
    try {
      await git(repoPath, ['pull']);
      return { success: true };
    } catch (e: any) { return { success: false, error: e.message }; }
  });

  ipcMain.handle('git:fetch', async (_, repoPath: string) => {
    try {
      await git(repoPath, ['fetch', '--all']);
      return { success: true };
    } catch (e: any) { return { success: false, error: e.message }; }
  });

  // ── git:rebase ──────────────────────────────────────────────────────────────
  ipcMain.handle('git:rebase', async (_, repoPath: string, branch: string) => {
    try {
      await git(repoPath, ['rebase', branch]);
      return { success: true };
    } catch (e: any) {
      const isConflict = /CONFLICT|conflict|resolve/i.test(e?.message ?? '');
      return { success: false, error: e.message, hasConflict: isConflict };
    }
  });

  // ── git:init ────────────────────────────────────────────────────────────────
  ipcMain.handle('git:init', async (_, repoPath: string) => {
    try {
      await git(repoPath, ['init']);
      return { success: true };
    } catch (e: any) { return { success: false, error: e.message }; }
  });

  // ── git:clone ──────────────────────────────────────────────────────────────
  ipcMain.handle('git:clone', async (_, url: string, destination: string) => {
    try {
      // Execute git clone in the parent directory of the destination
      // Using 'clone', url, destination path
      await git(process.cwd(), ['clone', url, destination]);
      return { success: true };
    } catch (e: any) { return { success: false, error: e.message }; }
  });

  // ── git:stash / undo ────────────────────────────────────────────────────────
  ipcMain.handle('git:stash', async (_, repoPath: string) => {
    try {
      await git(repoPath, ['stash']);
      return { success: true };
    } catch (e: any) { return { success: false, error: e.message }; }
  });

  ipcMain.handle('git:undoCommit', async (_, repoPath: string) => {
    try {
      await git(repoPath, ['reset', 'HEAD~1']);
      return { success: true };
    } catch (e: any) { return { success: false, error: e.message }; }
  });

  // ── git:merge ────────────────────────────────────────────────────────────────
  ipcMain.handle('git:merge', async (_, repoPath: string, branch: string, noFF = false) => {
    try {
      const args = noFF ? ['merge', '--no-ff', branch] : ['merge', branch];
      const output = await git(repoPath, args);
      return { success: true, output };
    } catch (e: any) {
      // Check if it's a conflict error
      const isConflict = e.message.includes('CONFLICT') || e.message.includes('Automatic merge failed');
      return { success: false, error: e.message, hasConflict: isConflict };
    }
  });

  ipcMain.handle('git:abortMerge', async (_, repoPath: string) => {
    try {
      await git(repoPath, ['merge', '--abort']);
      return { success: true };
    } catch (e: any) { return { success: false, error: e.message }; }
  });

  ipcMain.handle('git:mergeStatus', async (_, repoPath: string) => {
    try {
      // Check if MERGE_HEAD exists → means we are in a merge conflict state
      const { existsSync } = await import('fs');
      const isMerging = existsSync(`${repoPath}/.git/MERGE_HEAD`);
      // Get conflicted files from git status (UU, AA, DD prefixes)
      const statusOutput = await git(repoPath, ['status', '--porcelain=v1']);
      const conflictedFiles = statusOutput
        .split('\n')
        .filter(l => l.match(/^(UU|AA|DD|AU|UA|DU|UD)/))
        .map(l => l.slice(3).trim());
      return { success: true, isMerging, conflictedFiles };
    } catch (e: any) { return { success: false, error: e.message, isMerging: false, conflictedFiles: [] }; }
  });

  // Resolve conflict by choosing one side (ours or theirs)
  ipcMain.handle('git:resolveConflict', async (_, repoPath: string, filePath: string, resolution: 'ours' | 'theirs') => {
    try {
      await git(repoPath, ['checkout', `--${resolution}`, '--', filePath]);
      await git(repoPath, ['add', '--', filePath]);
      return { success: true };
    } catch (e: any) { return { success: false, error: e.message }; }
  });

  // ── git:deleteBranch ─────────────────────────────────────────────────────────
  ipcMain.handle('git:deleteBranch', async (_, repoPath: string, name: string, force = false) => {
    try {
      await git(repoPath, ['branch', force ? '-D' : '-d', name]);
      return { success: true };
    } catch (e: any) { return { success: false, error: e.message }; }
  });

  ipcMain.handle('git:renameBranch', async (_, repoPath: string, oldName: string, newName: string) => {
    try {
      await git(repoPath, ['branch', '-m', oldName, newName]);
      return { success: true };
    } catch (e: any) { return { success: false, error: e.message }; }
  });

  // ── git:discardFile ──────────────────────────────────────────────────────────
  ipcMain.handle('git:discardFile', async (_, repoPath: string, filePath: string) => {
    try {
      // checkout -- will restore tracked file; for untracked files we need to remove them
      try {
        await git(repoPath, ['checkout', 'HEAD', '--', filePath]);
      } catch {
        // If it was untracked, checkout won't work; we try to remove it cleanly
        await git(repoPath, ['clean', '-f', '--', filePath]);
      }
      return { success: true };
    } catch (e: any) { return { success: false, error: e.message }; }
  });

  // ── git:stashPop / stashApply / stashDrop ────────────────────────────────────
  ipcMain.handle('git:stashPop', async (_, repoPath: string, index?: number) => {
    try {
      const ref = index !== undefined ? `stash@{${index}}` : undefined;
      const args = ref ? ['stash', 'pop', ref] : ['stash', 'pop'];
      await git(repoPath, args);
      return { success: true };
    } catch (e: any) { return { success: false, error: e.message }; }
  });

  ipcMain.handle('git:stashApply', async (_, repoPath: string, index?: number) => {
    try {
      const ref = index !== undefined ? `stash@{${index}}` : undefined;
      const args = ref ? ['stash', 'apply', ref] : ['stash', 'apply'];
      await git(repoPath, args);
      return { success: true };
    } catch (e: any) { return { success: false, error: e.message }; }
  });

  ipcMain.handle('git:stashDrop', async (_, repoPath: string, index: number) => {
    try {
      await git(repoPath, ['stash', 'drop', `stash@{${index}}`]);
      return { success: true };
    } catch (e: any) { return { success: false, error: e.message }; }
  });

  // ── git:reset ────────────────────────────────────────────────────────────────
  ipcMain.handle('git:reset', async (_, repoPath: string, mode: 'soft' | 'mixed' | 'hard', target = 'HEAD') => {
    try {
      await git(repoPath, ['reset', `--${mode}`, target]);
      return { success: true };
    } catch (e: any) { return { success: false, error: e.message }; }
  });

  // ── git:revert ───────────────────────────────────────────────────────────────
  ipcMain.handle('git:revert', async (_, repoPath: string, commitHash: string) => {
    try {
      // --no-edit: don't open editor for commit message
      await git(repoPath, ['revert', '--no-edit', commitHash]);
      return { success: true };
    } catch (e: any) { return { success: false, error: e.message }; }
  });
});
