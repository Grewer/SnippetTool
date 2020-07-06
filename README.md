## electron 镜像

electron_mirror=https://npm.taobao.org/mirrors/electron/

这个地址因为"v"而出错了

## 关于样式
基本上是仿照 notion


## 所见即所得 编辑
HyperMD
https://github.com/laobubu/HyperMD/blob/master/docs/quick-start.md

## 关于数据的处理
数据存储至 GitHub 中

更新数据的话,使用 
Basic authentication
或者 OAuth2 token
来获取权限
https://segmentfault.com/a/1190000015144126 
(这是 v3 版本)

https://developer.github.com/v3/repos/contents/#get-contents

现在(2020.04) 我在 GitHub 上发现了 v4 版本


## 框架选择声明

一开始我选择的框架就是 electron, 但是因为当时用的技术和手法太多老旧,所以想重构一下

但是,经历了一下三个框架的使用:
- proton-native 使用原始构造性能高,现在这个版本不支持 css(后面版本支持),我使用了几次就 pass 了

- flutter 本来想试试 flutter 的手机端的功能,但是因为这个这是 PC 端的,所以试试,结果只能说很遗憾,光是环境上就有 N 个问题,再就是生态过差,富文本框也没有好用的

- react-nodegui 这个框架特别好,使用 Qt 构造,如果不是因为要渲染 MarkDown比较困难,我是不会放弃这个框架的,如果以后有简单的 PC 软件需要制作,这是我首选的框架


兜兜转转,又准备回到 electron,今天先写个记录,周末又要优化工作中用到的 react-native 组件,有一定空隙再使用 electron 重构

grewer  

2020-3-13

2020-04-25

今天发现了一个新的框架 `tauri`  ,我发现 这是一个更加好的东西
优点一: 无缝融合 web 项目, 即在一个 web 项目 引入包,init 即可打包为 PC 端项目  
优点二: 打出的包特别小例如: electron 打包 100M ,而 tauri 打出的包在 5M ,差距明显

原理可以参考 pwa, 即一个 webview


## 打包
只用在electron-packager打包命令中加入 --asar 这一个参数，就会自动在
outputpath/resources/路径下生成app.asar文件


## db 方案

创建一个 store 用来存储 db 的映射


db 的操作 增删改查 通过 new DB(xxx/xxx.json) 来创建


## lokijs


LokiJS是一个内存数据库，将性能考虑放在第一位。
LokiJS支持索引和更快的文档访问，执行性能非常好（近50万OPS/秒）。其内置DynamicView类可以用于数据子集的索引，甚至获取更快的性能。

LokiJS即可运行在Node.js端和浏览器端。

```typescript jsx
let user = {id: 1, name: 'new name'};
let obj = coll.findObject({'id': user.id});
if (obj) {
  user['$loki'] = obj['$loki'];
  user['meta'] = obj['meta'];
  coll.update(user);
} else {
  coll.insert(user);
}
```



## 数据库设计

### fileList

name : 名称

type : 类型 (1=文件,2=文件夹)

createTime : 创建时间

updateTime : 更新时间

isDel : 是否删除(0/undefined=未删除,1=删除)


// totoList

eslint:
去除 jsx-a11y/no-static-element-interactions
jsx-a11y/click-events-have-key-events


### TODO 插件
purifycss-webpack
有时候我们 css 写得多了或者重复了，这就造成了多余的代码，我们希望在生产环境进行去除。
```
const path = require('path')
const PurifyCssWebpack = require('purifycss-webpack') // 引入PurifyCssWebpack插件
const glob = require('glob') // 引入glob模块,用于扫描全部html文件中所引用的css

module.exports = merge(common, {
  plugins: [
    new PurifyCssWebpack({
      paths: glob.sync(path.join(__dirname, 'src/*.html')),
    }),
  ],
})
```

optimize-css-assets-webpack-plugin
我们希望减小 css 打包后的体积，可以用到 optimize-css-assets-webpack-plugin。
```
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin") // 压缩css代码

optimization: {
  minimizer: [
    // 压缩css
    new OptimizeCSSAssetsPlugin({})
  ]
 }
```

terser-webpack-plugin
Webpack4.0 默认是使用 terser-webpack-plugin 这个压缩插件，在此之前是使用 uglifyjs-webpack-plugin，两者的区别是后者对 ES6 的压缩不是很好，同时我们可以开启 parallel 参数，使用多进程压缩，加快压缩。
```
const TerserPlugin = require('terser-webpack-plugin') // 压缩js代码

optimization: {
  minimizer: [
    new TerserPlugin({
      parallel: 4, // 开启几个进程来处理压缩，默认是 os.cpus().length - 1
      cache: true, // 是否缓存
      sourceMap: false,
    }),
  ]
}
```


### 关于代理的实现

https://github.com/felicienfrancois/node-electron-proxy-agent/blob/master/index.js
