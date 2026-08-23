<<<<<<< HEAD
"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
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
function ok(data, stdout = "") {
  return { success: true, data, stdout, stderr: "", code: 0 };
}
function fail(command, error) {
  return {
    success: false,
    stdout: typeof (error == null ? void 0 : error.stdout) === "string" ? error.stdout : "",
    stderr: typeof (error == null ? void 0 : error.stderr) === "string" ? error.stderr : "",
    code: typeof (error == null ? void 0 : error.code) === "number" || typeof (error == null ? void 0 : error.code) === "string" ? error.code : void 0,
    error: (error == null ? void 0 : error.message) ?? String(error),
    meta: {
      kind: /CONFLICT|conflict/i.test((error == null ? void 0 : error.message) ?? "") ? "conflict" : "unknown",
      actionable: /auth|permission/i.test((error == null ? void 0 : error.message) ?? "") ? "Check credentials or repository permissions." : "Inspect stderr and retry the operation.",
      command
    }
  };
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
      return ok({ root: root.trim() });
    } catch (e) {
      return fail(["rev-parse", "--show-toplevel"], e);
    }
  });
  electron.ipcMain.handle("git:log", async (_, repoPath, maxCount = 200) => {
    try {
      const SEP = "|||";
      const fmt = `%H${SEP}%h${SEP}%an${SEP}%ae${SEP}%aI${SEP}%s${SEP}%P${SEP}%D`;
      const output = await git(repoPath, ["log", `--max-count=${maxCount}`, `--format=${fmt}`]);
      return ok(output, output);
    } catch (e) {
      return fail(["log", `--max-count=${maxCount}`], e);
    }
  });
  electron.ipcMain.handle("git:status", async (_, repoPath) => {
    try {
      const output = await git(repoPath, ["status", "--porcelain=v1", "-u"]);
      return ok(output, output);
    } catch (e) {
      return fail(["status", "--porcelain=v1", "-u"], e);
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
      return ok(output, output);
    } catch (e) {
      return fail(["branch", "-a", "-vv"], e);
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
  electron.ipcMain.handle("git:rebase", async (_, repoPath, branch) => {
    try {
      await git(repoPath, ["rebase", branch]);
      return { success: true };
    } catch (e) {
      const isConflict = /CONFLICT|conflict|resolve/i.test((e == null ? void 0 : e.message) ?? "");
      return { success: false, error: e.message, hasConflict: isConflict };
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
  electron.ipcMain.handle("git:merge", async (_, repoPath, branch, noFF = false) => {
    try {
      const args = noFF ? ["merge", "--no-ff", branch] : ["merge", branch];
      const output = await git(repoPath, args);
      return { success: true, output };
    } catch (e) {
      const isConflict = e.message.includes("CONFLICT") || e.message.includes("Automatic merge failed");
      return { success: false, error: e.message, hasConflict: isConflict };
    }
  });
  electron.ipcMain.handle("git:abortMerge", async (_, repoPath) => {
    try {
      await git(repoPath, ["merge", "--abort"]);
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  });
  electron.ipcMain.handle("git:mergeStatus", async (_, repoPath) => {
    try {
      const { existsSync } = await import("fs");
      const isMerging = existsSync(`${repoPath}/.git/MERGE_HEAD`);
      const statusOutput = await git(repoPath, ["status", "--porcelain=v1"]);
      const conflictedFiles = statusOutput.split("\n").filter((l) => l.match(/^(UU|AA|DD|AU|UA|DU|UD)/)).map((l) => l.slice(3).trim());
      return { success: true, isMerging, conflictedFiles };
    } catch (e) {
      return { success: false, error: e.message, isMerging: false, conflictedFiles: [] };
    }
  });
  electron.ipcMain.handle("git:resolveConflict", async (_, repoPath, filePath, resolution) => {
    try {
      await git(repoPath, ["checkout", `--${resolution}`, "--", filePath]);
      await git(repoPath, ["add", "--", filePath]);
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  });
  electron.ipcMain.handle("git:deleteBranch", async (_, repoPath, name, force = false) => {
    try {
      await git(repoPath, ["branch", force ? "-D" : "-d", name]);
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  });
  electron.ipcMain.handle("git:renameBranch", async (_, repoPath, oldName, newName) => {
    try {
      await git(repoPath, ["branch", "-m", oldName, newName]);
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  });
  electron.ipcMain.handle("git:discardFile", async (_, repoPath, filePath) => {
    try {
      try {
        await git(repoPath, ["checkout", "HEAD", "--", filePath]);
      } catch {
        await git(repoPath, ["clean", "-f", "--", filePath]);
      }
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  });
  electron.ipcMain.handle("git:stashPop", async (_, repoPath, index) => {
    try {
      const ref = index !== void 0 ? `stash@{${index}}` : void 0;
      const args = ref ? ["stash", "pop", ref] : ["stash", "pop"];
      await git(repoPath, args);
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  });
  electron.ipcMain.handle("git:stashApply", async (_, repoPath, index) => {
    try {
      const ref = index !== void 0 ? `stash@{${index}}` : void 0;
      const args = ref ? ["stash", "apply", ref] : ["stash", "apply"];
      await git(repoPath, args);
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  });
  electron.ipcMain.handle("git:stashDrop", async (_, repoPath, index) => {
    try {
      await git(repoPath, ["stash", "drop", `stash@{${index}}`]);
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  });
  electron.ipcMain.handle("git:reset", async (_, repoPath, mode, target = "HEAD") => {
    try {
      await git(repoPath, ["reset", `--${mode}`, target]);
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  });
  electron.ipcMain.handle("git:revert", async (_, repoPath, commitHash) => {
    try {
      await git(repoPath, ["revert", "--no-edit", commitHash]);
      return { success: true };
    } catch (e) {
      return { success: false, error: e.message };
    }
  });
});
=======
"use strict";var y=Object.create;var d=Object.defineProperty;var f=Object.getOwnPropertyDescriptor;var w=Object.getOwnPropertyNames;var b=Object.getPrototypeOf,_=Object.prototype.hasOwnProperty;var M=(a,e,t,s)=>{if(e&&typeof e=="object"||typeof e=="function")for(let i of w(e))!_.call(a,i)&&i!==t&&d(a,i,{get:()=>e[i],enumerable:!(s=f(e,i))||s.enumerable});return a};var C=(a,e,t)=>(t=a!=null?y(b(a)):{},M(e||!a||!a.__esModule?d(t,"default",{value:a,enumerable:!0}):t,a));const c=require("electron"),p=require("path"),v=require("child_process"),D=require("util"),E=D.promisify(v.execFile);process.env.DIST=p.join(__dirname,"../dist");process.env.VITE_PUBLIC=c.app.isPackaged?process.env.DIST:p.join(process.env.DIST,"../public");let r;const g=process.env.VITE_DEV_SERVER_URL;async function n(a,e){const{stdout:t}=await E("git",["-C",a,...e],{maxBuffer:52428800,encoding:"utf8"});return t.trim()}function u(a,e=""){return{success:!0,data:a,stdout:e,stderr:"",code:0}}function l(a,e){return{success:!1,stdout:typeof(e==null?void 0:e.stdout)=="string"?e.stdout:"",stderr:typeof(e==null?void 0:e.stderr)=="string"?e.stderr:"",code:typeof(e==null?void 0:e.code)=="number"||typeof(e==null?void 0:e.code)=="string"?e.code:void 0,error:(e==null?void 0:e.message)??String(e),meta:{kind:/CONFLICT|conflict/i.test((e==null?void 0:e.message)??"")?"conflict":"unknown",actionable:/auth|permission/i.test((e==null?void 0:e.message)??"")?"Check credentials or repository permissions.":"Inspect stderr and retry the operation.",command:a}}}function A(){const a=process.platform==="darwin",e=[{label:"File",submenu:[{label:"New Repository...",accelerator:"CmdOrCtrl+N",click:async()=>{if(!r)return;const{canceled:t,filePaths:s}=await c.dialog.showOpenDialog(r,{properties:["openDirectory"],title:"Initialize Git Repository"});!t&&s[0]&&(r.webContents.send("menu-action","init-repo"),r.webContents.send("init-repository",s[0]))}},{label:"Open Repository...",accelerator:"CmdOrCtrl+O",click:async()=>{if(!r)return;const{canceled:t,filePaths:s}=await c.dialog.showOpenDialog(r,{properties:["openDirectory"],title:"Open Git Repository"});!t&&s[0]&&r.webContents.send("open-repository",s[0])}},{label:"Clone Repository...",accelerator:"CmdOrCtrl+Shift+O",click:()=>r==null?void 0:r.webContents.send("menu-action","clone")},{type:"separator"},{label:"Settings",accelerator:"CmdOrCtrl+,",click:()=>r==null?void 0:r.webContents.send("menu-action","settings")},{type:"separator"},a?{role:"close"}:{role:"quit"}]},{label:"Edit",submenu:[{role:"undo"},{role:"redo"},{type:"separator"},{role:"cut"},{role:"copy"},{role:"paste"},{role:"selectAll"}]},{label:"View",submenu:[{label:"Changes",accelerator:"CmdOrCtrl+1",click:()=>r==null?void 0:r.webContents.send("menu-action","view:changes")},{label:"History",accelerator:"CmdOrCtrl+2",click:()=>r==null?void 0:r.webContents.send("menu-action","view:history")},{label:"Graph",accelerator:"CmdOrCtrl+3",click:()=>r==null?void 0:r.webContents.send("menu-action","view:graph")},{label:"Branches",click:()=>r==null?void 0:r.webContents.send("menu-action","view:branches")},{type:"separator"},{label:"Command Palette",accelerator:"CmdOrCtrl+K",click:()=>r==null?void 0:r.webContents.send("menu-action","command-palette")},{type:"separator"},{role:"reload"},{role:"forceReload"},{role:"toggleDevTools"},{type:"separator"},{role:"resetZoom"},{role:"zoomIn"},{role:"zoomOut"},{type:"separator"},{role:"togglefullscreen"}]},{label:"Window",submenu:[{role:"minimize"},{role:"zoom"},...a?[{type:"separator"},{role:"front"}]:[{role:"close"}]]},{label:"Help",submenu:[{label:"EasyGit Documentation",click:()=>c.shell.openExternal("https://github.com/")},{label:"Report an Issue",click:()=>c.shell.openExternal("https://github.com/")},{type:"separator"},{label:"About EasyGit",click:()=>r==null?void 0:r.webContents.send("menu-action","about")}]}];c.Menu.setApplicationMenu(c.Menu.buildFromTemplate(e))}function m(){r=new c.BrowserWindow({title:"EasyGit — Professional Git Client",width:1280,height:800,minWidth:900,minHeight:600,webPreferences:{preload:p.join(__dirname,"preload.js")}}),r.webContents.on("did-finish-load",()=>{r==null||r.webContents.send("main-process-message",new Date().toLocaleString())}),g?r.loadURL(g):r.loadFile(p.join(process.env.DIST,"index.html"))}c.app.on("window-all-closed",()=>{process.platform!=="darwin"&&(c.app.quit(),r=null)});c.app.on("activate",()=>{c.BrowserWindow.getAllWindows().length===0&&m()});c.app.whenReady().then(()=>{A(),m(),c.ipcMain.handle("dialog:openDirectory",async()=>{if(!r)return null;const{canceled:a,filePaths:e}=await c.dialog.showOpenDialog(r,{properties:["openDirectory"]});return a?null:e[0]}),c.ipcMain.handle("git:openRepo",async(a,e)=>{try{const t=await n(e,["rev-parse","--show-toplevel"]);return u({root:t.trim()})}catch(t){return l(["rev-parse","--show-toplevel"],t)}}),c.ipcMain.handle("git:log",async(a,e,t=200)=>{try{const s="|||",i=`%H${s}%h${s}%an${s}%ae${s}%aI${s}%s${s}%P${s}%D`,o=await n(e,["log",`--max-count=${t}`,`--format=${i}`]);return u(o,o)}catch(s){return l(["log",`--max-count=${t}`],s)}}),c.ipcMain.handle("git:status",async(a,e)=>{try{const t=await n(e,["status","--porcelain=v1","-u"]);return u(t,t)}catch(t){return l(["status","--porcelain=v1","-u"],t)}}),c.ipcMain.handle("git:branches",async(a,e)=>{try{const t=await n(e,["branch","-a","-vv","--format=%(if)%(HEAD)%(then)*%(else) %(end)|%(refname:short)|%(objectname:short)|%(upstream:short)|%(upstream:track)"]);return u(t,t)}catch(t){return l(["branch","-a","-vv"],t)}}),c.ipcMain.handle("git:stashes",async(a,e)=>{try{return{success:!0,output:await n(e,["stash","list","--format=%gd|%s|%aI|%gs"])}}catch(t){return{success:!1,error:t.message}}}),c.ipcMain.handle("git:remotes",async(a,e)=>{try{return{success:!0,output:await n(e,["remote","-v"])}}catch(t){return{success:!1,error:t.message}}}),c.ipcMain.handle("git:tags",async(a,e)=>{try{return{success:!0,output:await n(e,["tag","-l","--sort=-creatordate","--format=%(refname:short)|%(objectname:short)|%(creatordate:iso)|%(subject)|%(taggername)"])}}catch(t){return{success:!1,error:t.message}}}),c.ipcMain.handle("git:diff",async(a,e,t,s=!1)=>{try{return{success:!0,output:await n(e,s?["diff","--cached","--",t]:["diff","HEAD","--",t])}}catch(i){return{success:!1,error:i.message}}}),c.ipcMain.handle("git:currentBranch",async(a,e)=>{try{return{success:!0,output:await n(e,["rev-parse","--abbrev-ref","HEAD"])}}catch(t){return{success:!1,error:t.message}}}),c.ipcMain.handle("git:createBranch",async(a,e,t)=>{try{return await n(e,["branch",t]),{success:!0}}catch(s){return{success:!1,error:s.message}}}),c.ipcMain.handle("git:checkout",async(a,e,t)=>{try{return await n(e,["checkout",t]),{success:!0}}catch(s){return{success:!1,error:s.message}}}),c.ipcMain.handle("git:syncStatus",async(a,e)=>{try{const t=await n(e,["rev-list","--left-right","--count","HEAD...@{upstream}"]),[s,i]=t.split("	").map(Number);return{success:!0,ahead:s||0,behind:i||0}}catch{return{success:!0,ahead:0,behind:0}}}),c.ipcMain.handle("git:stage",async(a,e,t)=>{try{return await n(e,["add","--",t]),{success:!0}}catch(s){return{success:!1,error:s.message}}}),c.ipcMain.handle("git:unstage",async(a,e,t)=>{try{return await n(e,["reset","HEAD","--",t]),{success:!0}}catch(s){return{success:!1,error:s.message}}}),c.ipcMain.handle("git:stageAll",async(a,e)=>{try{return await n(e,["add","-A"]),{success:!0}}catch(t){return{success:!1,error:t.message}}}),c.ipcMain.handle("git:unstageAll",async(a,e)=>{try{return await n(e,["reset","HEAD"]),{success:!0}}catch(t){return{success:!1,error:t.message}}}),c.ipcMain.handle("git:commit",async(a,e,t)=>{try{return await n(e,["commit","-m",t]),{success:!0}}catch(s){return{success:!1,error:s.message}}}),c.ipcMain.handle("git:push",async(a,e)=>{try{return await n(e,["push"]),{success:!0}}catch(t){return{success:!1,error:t.message}}}),c.ipcMain.handle("git:pull",async(a,e)=>{try{return await n(e,["pull"]),{success:!0}}catch(t){return{success:!1,error:t.message}}}),c.ipcMain.handle("git:fetch",async(a,e)=>{try{return await n(e,["fetch","--all"]),{success:!0}}catch(t){return{success:!1,error:t.message}}}),c.ipcMain.handle("git:init",async(a,e)=>{try{return await n(e,["init"]),{success:!0}}catch(t){return{success:!1,error:t.message}}}),c.ipcMain.handle("git:clone",async(a,e,t)=>{try{return await n(process.cwd(),["clone",e,t]),{success:!0}}catch(s){return{success:!1,error:s.message}}}),c.ipcMain.handle("git:stash",async(a,e)=>{try{return await n(e,["stash"]),{success:!0}}catch(t){return{success:!1,error:t.message}}}),c.ipcMain.handle("git:undoCommit",async(a,e)=>{try{return await n(e,["reset","HEAD~1"]),{success:!0}}catch(t){return{success:!1,error:t.message}}}),c.ipcMain.handle("git:merge",async(a,e,t,s=!1)=>{try{return{success:!0,output:await n(e,s?["merge","--no-ff",t]:["merge",t])}}catch(i){const o=i.message.includes("CONFLICT")||i.message.includes("Automatic merge failed");return{success:!1,error:i.message,hasConflict:o}}}),c.ipcMain.handle("git:abortMerge",async(a,e)=>{try{return await n(e,["merge","--abort"]),{success:!0}}catch(t){return{success:!1,error:t.message}}}),c.ipcMain.handle("git:mergeStatus",async(a,e)=>{try{const{existsSync:t}=await import("fs"),s=t(`${e}/.git/MERGE_HEAD`),o=(await n(e,["status","--porcelain=v1"])).split(`
`).filter(h=>h.match(/^(UU|AA|DD|AU|UA|DU|UD)/)).map(h=>h.slice(3).trim());return{success:!0,isMerging:s,conflictedFiles:o}}catch(t){return{success:!1,error:t.message,isMerging:!1,conflictedFiles:[]}}}),c.ipcMain.handle("git:resolveConflict",async(a,e,t,s)=>{try{return await n(e,["checkout",`--${s}`,"--",t]),await n(e,["add","--",t]),{success:!0}}catch(i){return{success:!1,error:i.message}}}),c.ipcMain.handle("git:deleteBranch",async(a,e,t,s=!1)=>{try{return await n(e,["branch",s?"-D":"-d",t]),{success:!0}}catch(i){return{success:!1,error:i.message}}}),c.ipcMain.handle("git:renameBranch",async(a,e,t,s)=>{try{return await n(e,["branch","-m",t,s]),{success:!0}}catch(i){return{success:!1,error:i.message}}}),c.ipcMain.handle("git:discardFile",async(a,e,t)=>{try{try{await n(e,["checkout","HEAD","--",t])}catch{await n(e,["clean","-f","--",t])}return{success:!0}}catch(s){return{success:!1,error:s.message}}}),c.ipcMain.handle("git:stashPop",async(a,e,t)=>{try{const s=t!==void 0?`stash@{${t}}`:void 0;return await n(e,s?["stash","pop",s]:["stash","pop"]),{success:!0}}catch(s){return{success:!1,error:s.message}}}),c.ipcMain.handle("git:stashApply",async(a,e,t)=>{try{const s=t!==void 0?`stash@{${t}}`:void 0;return await n(e,s?["stash","apply",s]:["stash","apply"]),{success:!0}}catch(s){return{success:!1,error:s.message}}}),c.ipcMain.handle("git:stashDrop",async(a,e,t)=>{try{return await n(e,["stash","drop",`stash@{${t}}`]),{success:!0}}catch(s){return{success:!1,error:s.message}}}),c.ipcMain.handle("git:reset",async(a,e,t,s="HEAD")=>{try{return await n(e,["reset",`--${t}`,s]),{success:!0}}catch(i){return{success:!1,error:i.message}}}),c.ipcMain.handle("git:revert",async(a,e,t)=>{try{return await n(e,["revert","--no-edit",t]),{success:!0}}catch(s){return{success:!1,error:s.message}}})});
>>>>>>> 675534764cce2d6380ec24f6ed2abb07df8fed57
