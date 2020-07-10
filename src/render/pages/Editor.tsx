import React, { useContext, useEffect, useRef } from 'react'
import * as HyperMD from 'hypermd'
import './editor.global.less'
import { cm_t } from 'hypermd/core/type'
import ConfigContext from '~/context/ConfigContext'
import BaseDBStore from '~/db/DBStore'

// Load these modes if you want highlighting ...
require('codemirror/mode/htmlmixed/htmlmixed') // for embedded HTML
require('codemirror/mode/yaml/yaml') // for Front Matters

// Load PowerPacks if you want to utilize 3rd-party libs
require('hypermd/powerpack/hover-with-marked') // implicitly requires "marked"
// and other power packs...
// Power packs need 3rd-party libraries. Don't forget to install them!
let internal: NodeJS.Timeout
function Editor() {
  const { current } = useContext(ConfigContext)

  const cmRef: React.MutableRefObject<cm_t> = useRef()

  useEffect(() => {
    console.log('current 改变 获取', cmRef.current)
    if (internal) {
      clearInterval(internal)
    }
    if (current.id) {
      internal = setInterval(() => {
        BaseDBStore.updateContent(current, cmRef.current?.getValue())
      }, 2000)
    }
    cmRef.current?.setValue(current.content)
    // todo 键入后 5 秒保存 或者 按下 cmd+s 时 保存
  }, [current])

  console.log('render Editor', current)

  useEffect(() => {
    const myTextarea = document.getElementById('myTextarea') as HTMLTextAreaElement
    const cm = HyperMD.fromTextArea(myTextarea, {
      /* optional editor options here */
      hmdModeLoader: false, // 这个选项忘记了是什么 后面补上是否需要
      lineNumbers: false, // 是否显示行数
      gutters: [], // 行数右边的小按钮,因为我改了样式,会让这个功能有 bug, 所以直接隐藏
    })
    cmRef.current = cm
  }, [])

  return <textarea id="myTextarea" />
}

export default React.memo(Editor)
