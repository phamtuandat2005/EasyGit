"use strict";
const electron = require("electron");
const path = require("path");
process.env.DIST = path.join(__dirname, "../dist");
process.env.VITE_PUBLIC = electron.app.isPackaged ? process.env.DIST : path.join(process.env.DIST, "../public");
let win;
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
function buildMenu() {
  const isMac = process.platform === "darwin";
  const template = [
    // File
    {
      label: "File",
      submenu: [
        {
          label: "Open Repository...",
          accelerator: "CmdOrCtrl+O",
          click: async () => {
            if (!win) return;
            const { canceled, filePaths } = await electron.dialog.showOpenDialog(win, {
              properties: ["openDirectory"],
              title: "Open Git Repository"
            });
            if (!canceled && filePaths[0]) {
              win.webContents.send("open-repository", filePaths[0]);
            }
          }
        },
        {
          label: "Clone Repository...",
          accelerator: "CmdOrCtrl+Shift+O",
          click: () => win == null ? void 0 : win.webContents.send("menu-action", "clone")
        },
        { type: "separator" },
        {
          label: "Settings",
          accelerator: "CmdOrCtrl+,",
          click: () => win == null ? void 0 : win.webContents.send("menu-action", "settings")
        },
        { type: "separator" },
        isMac ? { role: "close" } : { role: "quit" }
      ]
    },
    // Edit
    {
      label: "Edit",
      submenu: [
        { role: "undo" },
        { role: "redo" },
        { type: "separator" },
        { role: "cut" },
        { role: "copy" },
        { role: "paste" },
        { role: "selectAll" }
      ]
    },
    // View
    {
      label: "View",
      submenu: [
        {
          label: "Changes",
          accelerator: "CmdOrCtrl+1",
          click: () => win == null ? void 0 : win.webContents.send("menu-action", "view:changes")
        },
        {
          label: "History",
          accelerator: "CmdOrCtrl+2",
          click: () => win == null ? void 0 : win.webContents.send("menu-action", "view:history")
        },
        {
          label: "Graph",
          accelerator: "CmdOrCtrl+3",
          click: () => win == null ? void 0 : win.webContents.send("menu-action", "view:graph")
        },
        {
          label: "Branches",
          click: () => win == null ? void 0 : win.webContents.send("menu-action", "view:branches")
        },
        { type: "separator" },
        {
          label: "Command Palette",
          accelerator: "CmdOrCtrl+K",
          click: () => win == null ? void 0 : win.webContents.send("menu-action", "command-palette")
        },
        { type: "separator" },
        { role: "reload" },
        { role: "forceReload" },
        { role: "toggleDevTools" },
        { type: "separator" },
        { role: "resetZoom" },
        { role: "zoomIn" },
        { role: "zoomOut" },
        { type: "separator" },
        { role: "togglefullscreen" }
      ]
    },
    // Window
    {
      label: "Window",
      submenu: [
        { role: "minimize" },
        { role: "zoom" },
        ...isMac ? [{ type: "separator" }, { role: "front" }] : [{ role: "close" }]
      ]
    },
    // Help
    {
      label: "Help",
      submenu: [
        {
          label: "EasyGit Documentation",
          click: () => electron.shell.openExternal("https://github.com/")
        },
        {
          label: "Report an Issue",
          click: () => electron.shell.openExternal("https://github.com/")
        },
        { type: "separator" },
        {
          label: "About EasyGit",
          click: () => win == null ? void 0 : win.webContents.send("menu-action", "about")
        }
      ]
    }
  ];
  const menu = electron.Menu.buildFromTemplate(template);
  electron.Menu.setApplicationMenu(menu);
}
function createWindow() {
  win = new electron.BrowserWindow({
    title: "EasyGit — Professional Git Client",
    width: 1280,
    height: 800,
    minWidth: 900,
    minHeight: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js")
    }
  });
  win.webContents.on("did-finish-load", () => {
    win == null ? void 0 : win.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  });
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(process.env.DIST, "index.html"));
  }
}
electron.app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    electron.app.quit();
    win = null;
  }
});
electron.app.on("activate", () => {
  if (electron.BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
electron.app.whenReady().then(() => {
  buildMenu();
  createWindow();
  electron.ipcMain.handle("dialog:openDirectory", async () => {
    if (!win) return null;
    const { canceled, filePaths } = await electron.dialog.showOpenDialog(win, {
      properties: ["openDirectory"]
    });
    return canceled ? null : filePaths[0];
  });
  electron.ipcMain.handle("git:status", async (_, repoPath) => {
    console.log(`git status in ${repoPath}`);
    return ` M src/App.tsx
?? new-file.txt`;
  });
});
