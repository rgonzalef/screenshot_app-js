const { app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const { takeScreenshot } = require('./screenshot')

function createWindow() {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 700,
    height: 400,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true, // Improve security
      nodeIntegration: false,
    },
  })

  // Devtool of Electron
  //win.webContents.openDevTools()

  //Load  HTML file
  win.loadFile('index.html')

  // Handle loading errors
  win.webContents.on('did-fail-load', () => {
    console.error('Error: Could not load HTML file')
  })

  // Display a message when successfully loaded
  win.webContents.on('did-finish-load', () => {
    console.log('HTML file uploaded successfully')
  })
}

app.whenReady().then(createWindow)

//Close de app when exit
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

//Call to takeScreenshot function
ipcMain.handle('capture-screenshot', async (event, url, format) => {
  try {
    const filePath = await takeScreenshot(url, format)
    return { success: true, filePath }
  } catch (error) {
    console.error('Error capturing screen:', error)
    return { success: false, message: error.message }
  }
})
