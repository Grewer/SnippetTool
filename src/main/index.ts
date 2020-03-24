'use strict'

import { app, BrowserWindow, ipcMain } from 'electron'
import * as path from 'path'
import * as url from 'url'

let mainWindow: BrowserWindow

function  createWindow() {
  mainWindow = new BrowserWindow({
    width: 900, height: 680, webPreferences: {
      nodeIntegration: true,
    }
  })

  const indexPath = url.format({
    protocol: 'http:',
    host: 'localhost:8080',
    pathname: 'index.html',
    slashes: true
  })

  // const indexPath = url.format({
  //   protocol: 'file:',
  //   pathname: path.join(__dirname, 'dist', 'index.html'),
  //   slashes: true
  // })

  mainWindow.loadURL(indexPath)
  mainWindow.on('closed', () => (mainWindow.destroy()))

  ipcMain.on('channel', (event, msg: any) => {
    console.log(msg)
    mainWindow.webContents.send('response', { title: 'mymessage', data: 1 })
  })
}

app.on('ready', createWindow)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
