"use strict";
const electron = require("electron");
const path = require("path");
const child_process = require("child_process");
const util = require("util");
const execFileAsync = util.promisify(child_process.execFile);
process.env.DIST = path.join(__dirname, "../dist");
process.env.VITE_PUBLIC = electron.app.isPackaged ? process.env.DIST : path.join(process.env.DIST, "../public");
let win;
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
async function git(repoPath, args) {
  const { stdout } = await execFileAsync("git", ["-C", repoPath, ...args], {
    maxBuffer: 50 * 1024 * 1024,
    // 50MB
    encoding: "utf8"
  });
  return stdout.trim();
}
function buildMenu() {
  const isMac = process.platform === "darwin";
  const template = [
    {
      label: "File",
      submenu: [
        {
          label: "New Repository...",
          accelerator: "CmdOrCtrl+N",
          click: async () => {
            if (!win) return;
            const { canceled, filePaths } = await electron.dialog.showOpenDialog(win, {
              properties: ["openDirectory"],
              title: "Initialize Git Repository"
            });
            if (!canceled && filePaths[0]) {
              win.webContents.send("menu-action", "init-repo");
              win.webContents.send("init-repository", filePaths[0]);
            }
          }
        },
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
    {
      label: "View",
      submenu: [
        { label: "Changes", accelerator: "CmdOrCtrl+1", click: () => win == null ? void 0 : win.webContents.send("menu-action", "view:changes") },
        { label: "History", accelerator: "CmdOrCtrl+2", click: () => win == null ? void 0 : win.webContents.send("menu-action", "view:history") },
        { label: "Graph", accelerator: "CmdOrCtrl+3", click: () => win == null ? void 0 : win.webContents.send("menu-action", "view:graph") },
        { label: "Branches", click: () => win == null ? void 0 : win.webContents.send("menu-action", "view:branches") },
        { type: "separator" },
        { label: "Command Palette", accelerator: "CmdOrCtrl+K", click: () => win == null ? void 0 : win.webContents.send("menu-action", "command-palette") },
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
    {
      label: "Window",
      submenu: [
        { role: "minimize" },
        { role: "zoom" },
        ...isMac ? [{ type: "separator" }, { role: "front" }] : [{ role: "close" }]
      ]
    },
    {
      label: "Help",
      submenu: [
        { label: "EasyGit Documentation", click: () => electron.shell.openExternal("https://github.com/") },
        { label: "Report an Issue", click: () => electron.shell.openExternal("https://github.com/") },
        { type: "separator" },
        { label: "About EasyGit", click: () => win == null ? void 0 : win.webContents.send("menu-action", "about") }
      ]
    }
  ];
  electron.Menu.setApplicationMenu(electron.Menu.buildFromTemplate(template));
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
  if (electron.BrowserWindow.getAllWindows().length === 0) createWindow();
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
  electron.ipcMain.handle("git:openRepo", async (_, repoPath) => {
    try {
      const root = await git(repoPath, ["rev-parse", "--show-toplevel"]);
      return { success: true, root: root.trim() };
    } catch (e) {
      return { success: false, error: e.message };
    }
  });
  electron.ipcMain.handle("git:log", async (_, repoPath, maxCount = 200) => {
    try {
      const SEP = "|||";
      const fmt = `%H${SEP}%h${SEP}%an${SEP}%ae${SEP}%aI${SEP}%s${SEP}%P${SEP}%D`;
      const output = await git(repoPath, ["log", `--max-count=${maxCount}`, `--format=${fmt}`]);
      return { success: true, output };
    } catch (e) {
      return { success: false, error: e.message };
    }
  });
  electron.ipcMain.handle("git:status", async (_, repoPath) => {
    try {
      const output = await git(repoPath, ["status", "--porcelain=v1", "-u"]);
      return { success: true, output };
    } catch (e) {
      return { success: false, error: e.message };
    }
  });
  electron.ipcMain.handle("git:branches", async (_, repoPath) => {
    try {
      const output = await git(repoPath, [
        "branch",
        "-a",
        "-vv",
        "--format=%(if)%(HEAD)%(then)*%(else) %(end)|%(refname:short)|%(objectname:short)|%(upstream:short)|%(upstream:track)"
      ]);
      return { success: true, output };
    } catch (e) {
      return { success: false, error: e.message };
    }
  });
  electron.ipcMain.handle("git:stashes", async (_, repoPath) => {
    try {
      const output = await git(repoPath, ["stash", "list", "--format=%gd|%s|%aI|%gs"]);
      return { success: true, output };
    } catch (e) {
      return { success: false, error: e.message };
    }
  });
  electron.ipcMain.handle("git:remotes", async (_, repoPath) => {
    try {
      const output = await git(repoPath, ["remote", "-v"]);
      return { success: true, output };
    } catch (e) {
      return { success: false, error: e.message };
    }
  });
  electron.ipcMain.handle("git:tags", async (_, repoPath) => {
    try {
      const output = await git(repoPath, [
        "tag",
        "-l",
        "--sort=-creatordate",
        "--format=%(refname:short)|%(objectname:short)|%(creatordate:iso)|%(subject)|%(taggername)"
      ]);
      return { success: true, output };
    } catch (e) {
      return { success: false, error: e.message };
    }
  });
  electron.ipcMain.handle("git:diff", async (_, repoPath, filePath, staged = false) => {
    try {
      const args = staged ? ["diff", "--cached", "--", filePath] : ["diff", "HEAD", "--", filePath];
      const output = await git(repoPath, args);
      return { success: true, output };
    } catch (e) {
      return { success: false, error: e.message };
    }
  });
  electron.ipcMain.handle("git:currentBranch", async (_, repoPath) => {
    try {
      const output = await git(repoPath, ["rev-parse", "--abbrev-ref", "HEAD"]);
      return { success: true, output };
    } catch (e) {
      return { success: false, error: e.message };
    }
  });
  electron.ipcMain.handle("git:createBranch", async (_, repoPath, name) => {
    try {
      await git(repoPath, ["branch", name]);
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  });
  electron.ipcMain.handle("git:checkout", async (_, repoPath, branch) => {
    try {
      await git(repoPath, ["checkout", branch]);
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  });
  electron.ipcMain.handle("git:syncStatus", async (_, repoPath) => {
    try {
      const output = await git(repoPath, ["rev-list", "--left-right", "--count", "HEAD...@{upstream}"]);
      const [ahead, behind] = output.split("	").map(Number);
      return { success: true, ahead: ahead || 0, behind: behind || 0 };
    } catch {
      return { success: true, ahead: 0, behind: 0 };
    }
  });
  electron.ipcMain.handle("git:stage", async (_, repoPath, filePath) => {
    try {
      await git(repoPath, ["add", "--", filePath]);
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  });
  electron.ipcMain.handle("git:unstage", async (_, repoPath, filePath) => {
    try {
      await git(repoPath, ["reset", "HEAD", "--", filePath]);
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  });
  electron.ipcMain.handle("git:stageAll", async (_, repoPath) => {
    try {
      await git(repoPath, ["add", "-A"]);
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  });
  electron.ipcMain.handle("git:unstageAll", async (_, repoPath) => {
    try {
      await git(repoPath, ["reset", "HEAD"]);
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  });
  electron.ipcMain.handle("git:commit", async (_, repoPath, message) => {
    try {
      await git(repoPath, ["commit", "-m", message]);
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  });
  electron.ipcMain.handle("git:push", async (_, repoPath) => {
    try {
      await git(repoPath, ["push"]);
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  });
  electron.ipcMain.handle("git:pull", async (_, repoPath) => {
    try {
      await git(repoPath, ["pull"]);
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  });
  electron.ipcMain.handle("git:fetch", async (_, repoPath) => {
    try {
      await git(repoPath, ["fetch", "--all"]);
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  });
  electron.ipcMain.handle("git:init", async (_, repoPath) => {
    try {
      await git(repoPath, ["init"]);
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  });
  electron.ipcMain.handle("git:clone", async (_, url, destination) => {
    try {
      await git(process.cwd(), ["clone", url, destination]);
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  });
  electron.ipcMain.handle("git:stash", async (_, repoPath) => {
    try {
      await git(repoPath, ["stash"]);
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  });
  electron.ipcMain.handle("git:undoCommit", async (_, repoPath) => {
    try {
      await git(repoPath, ["reset", "HEAD~1"]);
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  });
});
