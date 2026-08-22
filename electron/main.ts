import { app, BrowserWindow, ipcMain, dialog, Menu, shell } from 'electron';
import { join } from 'path';

process.env.DIST = join(__dirname, '../dist');
process.env.VITE_PUBLIC = app.isPackaged ? process.env.DIST : join(process.env.DIST, '../public');

let win: BrowserWindow | null;

const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL'];

function buildMenu() {
  const isMac = process.platform === 'darwin';

  const template: Electron.MenuItemConstructorOptions[] = [
    // File
    {
      label: 'File',
      submenu: [
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
    // Edit
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' as const },
        { role: 'redo' as const },
        { type: 'separator' },
        { role: 'cut' as const },
        { role: 'copy' as const },
        { role: 'paste' as const },
        { role: 'selectAll' as const },
      ],
    },
    // View
    {
      label: 'View',
      submenu: [
        {
          label: 'Changes',
          accelerator: 'CmdOrCtrl+1',
          click: () => win?.webContents.send('menu-action', 'view:changes'),
        },
        {
          label: 'History',
          accelerator: 'CmdOrCtrl+2',
          click: () => win?.webContents.send('menu-action', 'view:history'),
        },
        {
          label: 'Graph',
          accelerator: 'CmdOrCtrl+3',
          click: () => win?.webContents.send('menu-action', 'view:graph'),
        },
        {
          label: 'Branches',
          click: () => win?.webContents.send('menu-action', 'view:branches'),
        },
        { type: 'separator' },
        {
          label: 'Command Palette',
          accelerator: 'CmdOrCtrl+K',
          click: () => win?.webContents.send('menu-action', 'command-palette'),
        },
        { type: 'separator' },
        { role: 'reload' as const },
        { role: 'forceReload' as const },
        { role: 'toggleDevTools' as const },
        { type: 'separator' },
        { role: 'resetZoom' as const },
        { role: 'zoomIn' as const },
        { role: 'zoomOut' as const },
        { type: 'separator' },
        { role: 'togglefullscreen' as const },
      ],
    },
    // Window
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' as const },
        { role: 'zoom' as const },
        ...(isMac
          ? [{ type: 'separator' as const }, { role: 'front' as const }]
          : [{ role: 'close' as const }]),
      ],
    },
    // Help
    {
      label: 'Help',
      submenu: [
        {
          label: 'EasyGit Documentation',
          click: () => shell.openExternal('https://github.com/'),
        },
        {
          label: 'Report an Issue',
          click: () => shell.openExternal('https://github.com/'),
        },
        { type: 'separator' },
        {
          label: 'About EasyGit',
          click: () => win?.webContents.send('menu-action', 'about'),
        },
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

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
    win?.webContents.send('main-process-message', (new Date).toLocaleString());
  });

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(join(process.env.DIST as string, 'index.html'));
  }
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
    win = null;
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

app.whenReady().then(() => {
  buildMenu();
  createWindow();

  // IPC: open directory dialog
  ipcMain.handle('dialog:openDirectory', async () => {
    if (!win) return null;
    const { canceled, filePaths } = await dialog.showOpenDialog(win, {
      properties: ['openDirectory'],
    });
    return canceled ? null : filePaths[0];
  });

  // IPC: git status mock
  ipcMain.handle('git:status', async (_, repoPath) => {
    console.log(`git status in ${repoPath}`);
    return ` M src/App.tsx\n?? new-file.txt`;
  });
});
