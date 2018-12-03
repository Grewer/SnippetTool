# SnippetTool

### todo

## 开发环境

仍旧使用 webpack 开发,因为有部使用 loader 有一些问题不好解决
Dev 时 使用 webpack-dev-server 启动 hot
electron 中 mainWindow.loadURL(`http://localhost:8080/index.html`) 仍旧可以使用热启动
这样在启动 electron 后仍旧有 hot 效果 

使用 scss 开发时 启用 watch-css ,会将 scss 自动编译成 css,然后通过 .css 文件引入 HTML

## 因安全问题 无法直接引入 less sass/scss 文件了
https://github.com/electron/electron/issues/15315



