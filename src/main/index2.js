var electron_1 = require("electron/index");
var url = require("url");

console.dir(electron_1)

const { app, BrowserWindow } = electron_1

let mainWindow

// 添加 dev 拓展工具, https://www.electronjs.org/docs/tutorial/devtools-extension

// 以后可能会用到的 api
// https://www.electronjs.org/docs/tutorial/progress-bar 任务栏的进度条
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 680,
    webPreferences: {
      nodeIntegration: true,
      webSecurity: false,
    },
    titleBarStyle: 'hidden',
    show: false,
    frame: false,
    resizable: false,
  })

  const indexPath = url.format({
    protocol: 'http:',
    host: 'localhost:3000',
    pathname: 'index.html',
    slashes: true,
  })

  // const indexPath = url.format({
  //   protocol: 'file:',
  //   pathname: path.join(__dirname, 'dist', 'index.html'),
  //   slashes: true
  // })

  mainWindow.loadURL(indexPath)

  mainWindow.on('closed', () => mainWindow.destroy())

  // ipcMain.on('channel', (event, msg: any) => {
  //   console.log(msg)
  //   mainWindow.webContents.send('response', { title: 'mymessage', data: 1 })
  // })

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })
}

app.on('ready', createWindow)
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.allowRendererProcessReuse = true

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})
