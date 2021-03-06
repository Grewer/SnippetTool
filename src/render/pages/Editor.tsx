import React, { FC, useCallback, useEffect, useRef } from 'react'
import * as HyperMD from 'hypermd'
import './editor.global.less'
import { cm_t } from 'hypermd/core/type'
import { debounce } from '@grewer/tools'
import BaseDBStore from '~/db/DBStore'
import useMount from '~/hooks/useMount'
import { IFileListItemFile } from '~/definition/Main'

// Load these modes if you want highlighting ...
require('codemirror/mode/htmlmixed/htmlmixed') // for embedded HTML
require('codemirror/mode/yaml/yaml') // for Front Matters

// Load PowerPacks if you want to utilize 3rd-party libs
require('hypermd/powerpack/hover-with-marked') // implicitly requires "marked"
// and other power packs...
// Power packs need 3rd-party libraries. Don't forget to install them!

function Editor(props) {
  const { current } = props

  const cmRef: React.MutableRefObject<cm_t> = useRef()

  const autoSave = useCallback(
    debounce(() => {
      console.log('run autoSave', current)
      try {
        BaseDBStore.updateContent(current, cmRef.current?.getValue())
      } catch (e) {
        console.error(e)
      }
    }, 2000),
    [current]
  )

  useEffect(() => {
    console.log('current 改变 获取', cmRef.current)
    if (!current.id) {
      return
    }
    cmRef.current?.setValue(current.content)

    cmRef.current.on('change', autoSave)

    cmRef.current.setOption('extraKeys', {
      'Cmd-S': () => {
        // 判断 Mac or win
        // var runKey = (mac ? "Cmd" : "Ctrl") + "-Enter";
        try {
          BaseDBStore.updateContent(current, cmRef.current?.getValue())
        } catch (e) {
          console.error(e)
        }
      },
    })
    return () => {
      cmRef.current.off('change', autoSave)
    }

    // 键入后 2 秒保存 或者 按下 cmd+s 时 保存
  }, [autoSave, current])

  console.log('%c render Editor', 'background:yellow;', current)

  useMount(() => {
    const myTextarea = document.getElementById('myTextarea') as HTMLTextAreaElement
    cmRef.current = HyperMD.fromTextArea(myTextarea, {
      /* optional editor options here */
      hmdModeLoader: false, // 这个选项忘记了是什么 后面补上是否需要
      lineNumbers: false, // 是否显示行数
      gutters: [], // 行数右边的小按钮,因为我改了样式,会让这个功能有 bug, 所以直接隐藏
    })
  })

  return <textarea id="myTextarea" />
}

export default React.memo(Editor) as FC<{ current: IFileListItemFile }>
