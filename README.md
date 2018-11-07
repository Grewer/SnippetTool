# SnippetTool

### todo

## 开发环境

仍旧使用 webpack 开发,因为有部使用 loader 有一些问题不好解决
Dev 时 使用 webpack-dev-server 启动 hot
electron 中 mainWindow.loadURL(`http://localhost:8080/index.html`) 仍旧可以使用热启动
这样在启动 electron 后仍旧有 hot 效果 