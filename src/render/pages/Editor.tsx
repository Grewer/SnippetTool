import React, { useEffect } from 'react'
import * as HyperMD from 'hypermd'
import './editor.global.less'

// Load these modes if you want highlighting ...
require('codemirror/mode/htmlmixed/htmlmixed') // for embedded HTML
require('codemirror/mode/yaml/yaml') // for Front Matters

// Load PowerPacks if you want to utilize 3rd-party libs
require('hypermd/powerpack/hover-with-marked') // implicitly requires "marked"
// and other power packs...
// Power packs need 3rd-party libraries. Don't forget to install them!

function Editor() {
  useEffect(() => {
    const myTextarea = document.getElementById('myTextarea') as HTMLTextAreaElement
    const cm = HyperMD.fromTextArea(myTextarea, {
      /* optional editor options here */
      hmdModeLoader: false, // 这个选项忘记了是什么 后面补上是否需要
      lineNumbers: false, // 是否显示行数
      gutters: [], // 行数右边的小按钮,因为我改了样式,会让这个功能有 bug, 所以直接隐藏
    })
  }, [])
  return (
    <textarea
      //       defaultValue="# Hello World
      //
      // ```js
      // function(){
      //   return 1;
      // }
      // ```"
      id="myTextarea"
    />
  )
}

export default React.memo(Editor)
