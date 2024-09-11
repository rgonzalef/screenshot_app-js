const { contextBridge, ipcRenderer } = require('electron')

contextBridge.exposeInMainWorld('electron', {
  captureScreenshot: (url, format) =>
    ipcRenderer.invoke('capture-screenshot', url, format),
})
