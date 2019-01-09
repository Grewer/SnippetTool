import {enableLiveReload} from 'electron-compile';
import {app, BrowserWindow, ipcMain} from 'electron';
import {loadCollection} from "./src/db";

let mainWindow: BrowserWindow | null
const isDev = process.env.NODE_ENV === 'development'

if (isDev) {
  enableLiveReload();
}
//
// console.log(app.getAppPath()) // 当前项目地址
// console.log(app.getPath('appData')) // 当前用户的应用数据文件夹
// console.log(app.getPath('home')) // 用户的 home 文件夹（主目录）  /Users/admin
console.log(app.getPath('userData')) // /Users/admin/Library/Application Support/Electron


function createWindow() {
  // Create the browser window.
  mainWindow = new BrowserWindow({width: 800, height: 600, titleBarStyle: 'hidden'})
  // 隐藏头部后 只有光标变后才可以拖曳  此种有 bug ,至今(2018-12-12) 未解决
  // https://github.com/electron/electron/issues/3647


  // and load the index.html of the app.
  mainWindow.loadFile('src/index.html')

  // Open the DevTools.
  mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function () {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)


ipcMain.on('saveFile', (event, arg) => {
  console.log('savefile', arg)
  loadCollection('file', (files, db) => {
    console.log(files)
    files.insert(arg)
    db.saveDatabase()
  })
  event.returnValue = 'save file' // 若没有返回值 则会渲染为空白
})


// enableLiveReload({strategy: 'react-hmr'});

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})


// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
