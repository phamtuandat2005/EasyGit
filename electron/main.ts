import { app, BrowserWindow, ipcMain, dialog, Menu, shell } from 'electron';
import { join } from 'path';
import { execFile } from 'child_process';
import { promisify } from 'util';

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
      return { success: true, root: root.trim() };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  });

  // ── git:log ─────────────────────────────────────────────────────────────────
  // Format: hash|shortHash|author|email|isoDate|message|parentHashes|refs
  ipcMain.handle('git:log', async (_, repoPath: string, maxCount = 200) => {
    try {
      const SEP = '|||';
      const fmt = `%H${SEP}%h${SEP}%an${SEP}%ae${SEP}%aI${SEP}%s${SEP}%P${SEP}%D`;
      const output = await git(repoPath, ['log', `--max-count=${maxCount}`, `--format=${fmt}`]);
      return { success: true, output };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  });

  // ── git:status ──────────────────────────────────────────────────────────────
  ipcMain.handle('git:status', async (_, repoPath: string) => {
    try {
      const output = await git(repoPath, ['status', '--porcelain=v1', '-u']);
      return { success: true, output };
    } catch (e: any) {
      return { success: false, error: e.message };
    }
  });

  // ── git:branches ────────────────────────────────────────────────────────────
  ipcMain.handle('git:branches', async (_, repoPath: string) => {
    try {
      const output = await git(repoPath, [
        'branch', '-a', '-vv',
        '--format=%(if)%(HEAD)%(then)*%(else) %(end)|%(refname:short)|%(objectname:short)|%(upstream:short)|%(upstream:track)',
      ]);
      return { success: true, output };
    } catch (e: any) {
      return { success: false, error: e.message };
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
});
