'use strict'

import { app, BrowserWindow, globalShortcut, ipcMain, protocol, shell } from 'electron'
// import installExtension, { VUEJS_DEVTOOLS } from 'electron-devtools-installer'
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib'
// import { globalShortcut } from 'electron/main'
const isDevelopment = process.env.NODE_ENV !== 'production'
const ipc = ipcMain
const init = require('./js/init.js')

// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
  { scheme: 'app', privileges: { secure: true, standard: true } }
])

async function createWindow () {
  // Create the browser window.
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    // transparent: true,
    frame: false,
    webPreferences: {
      // Use pluginOptions.nodeIntegration, leave this alone
      // See nklayman.github.io/vue-cli-plugin-electron-builder/guide/security.html#node-integration for more info
      nodeIntegration: process.env.ELECTRON_NODE_INTEGRATION,
      contextIsolation: !process.env.ELECTRON_NODE_INTEGRATION,
      webSecurity: false,
    }
  })
  win.maximize()
  init.initipc(win, ipc, shell, app)
  globalShortcut.register('Alt+Ctrl+D', () => { console.log('in showing window');win.show() })
  if (process.env.WEBPACK_DEV_SERVER_URL) {
    // Load the url of the dev server if in development mode

    setTimeout(() => {
      win.loadURL(process.env.WEBPACK_DEV_SERVER_URL)
      // win.webContents.toggleDevTools()
      // console.log(win.webContents.isDevToolsOpened())
      if (!process.env.IS_TEST)win.webContents.openDevTools()
    }, 1000)
  } else {
    createProtocol('app')
    // Load the index.html when not in development
    win.loadURL('app://./index.html')
  }
  // // hot keys send message to view
  // win.webContents.on('before-input-event', (event, input) => {
  //   if (input.control && input.key.toLocaleLowerCase() === 't') {
  //     win.webContents.send('setpage', 1);
  //   }
  //   if (input.control && input.key.toLocaleLowerCase() === 'e') {
  //     win.webContents.send('setpage', 6);
  //   }
  //   if (input.control && input.key.toLocaleLowerCase() === 's') {
  //     win.webContents.send('setpage', 2);
  //   }
  //   if (input.control && input.key.toLocaleLowerCase() === 'f') {
  //     win.webContents.send('setpage', 3);
  //   }
  //   if (input.control && input.key.toLocaleLowerCase() === 'q') {
  //     win.webContents.send('setpage', 4);
  //   }
  //   if (input.control && input.key.toLocaleLowerCase() === 'w') {
  //     win.webContents.send('setpage', 5);
  //   }
  // })
  win.webContents.on('will-navigate', function(e, url) {
    e.preventDefault();
    require('electron').shell.openExternal(url)
  })
}

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar

  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    // Install Vue Devtools
    try {
      // await installExtension(VUEJS_DEVTOOLS)
    } catch (e) {
      console.error('Vue Devtools failed to install:', e.toString())
    }
  }
  createWindow()
})
// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', (data) => {
      if (data === 'graceful-exit') {
        app.quit()
      }
    })
  } else {
    process.on('SIGTERM', () => {
      app.quit()
    })
  }
}
