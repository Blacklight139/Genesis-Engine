"use strict";
const electron = require("electron");
const path = require("node:path");
const isDev = process.env.NODE_ENV === "development";
const VITE_DEV_SERVER_URL = process.env.VITE_DEV_SERVER_URL;
path.join(__dirname, "../dist-electron");
const RENDERER_DIST = path.join(__dirname, "../dist");
let win = null;
function createWindow() {
  win = new electron.BrowserWindow({
    width: 1280,
    height: 800,
    icon: path.join(RENDERER_DIST, "favicon.ico"),
    // 可替换为你的图标
    show: false,
    // 先不显示，等待 ready-to-show 避免白屏
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
      // preload 脚本（可选，如果你需要安全地暴露 API）
      // preload: path.join(__dirname, 'preload.js')
    }
  });
  if (isDev && VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
    win.webContents.openDevTools({ mode: "detach" });
  } else {
    win.loadFile(path.join(RENDERER_DIST, "index.html"));
  }
  win.once("ready-to-show", () => {
    win == null ? void 0 : win.show();
  });
  win.webContents.on("did-finish-load", () => {
    win == null ? void 0 : win.webContents.send("main-process-message", `Electron ${process.versions.electron} ready`);
  });
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
  createWindow();
});
electron.app.on("activate", () => {
  if (!electron.BrowserWindow.getAllWindows().length) {
    createWindow();
  }
});
