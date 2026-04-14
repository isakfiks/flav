const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("arcApi", {
  sendRequest: (payload) => ipcRenderer.invoke("arc:send-request", payload),
});

contextBridge.exposeInMainWorld("arcWindow", {
  minimize: () => ipcRenderer.invoke("arc:window:minimize"),
  maximizeToggle: () => ipcRenderer.invoke("arc:window:maximize-toggle"),
  isMaximized: () => ipcRenderer.invoke("arc:window:is-maximized"),
  close: () => ipcRenderer.invoke("arc:window:close"),
});
