## electron 镜像

electron_mirror=https://npm.taobao.org/mirrors/electron/

这个地址因为"v"而出错了


## 框架选择声明

一开始我选择的框架就是 electron, 但是因为当时用的技术和手法太多老旧,所以想重构一下

但是,经历了一下三个框架的使用:
- proton-native 使用原始构造性能高,现在这个版本不支持 css(后面版本支持),我使用了几次就 pass 了

- flutter 本来想试试 flutter 的手机端的功能,但是因为这个这是 PC 端的,所以试试,结果只能说很遗憾,光是环境上就有 N 个问题,再就是生态过差,富文本框也没有好用的

- react-nodegui 这个框架特别好,使用 Qt 构造,如果不是因为要渲染 MarkDown比较困难,我是不会放弃这个框架的,如果以后有简单的 PC 软件需要制作,这是我首选的框架


兜兜转转,又准备回到 electron,今天先写个记录,周末又要优化工作中用到的 react-native 组件,有一定空隙再使用 electron 重构

grewer  

2020-3-13
