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
