import React from 'react'
import { ipcRenderer } from 'electron'
import FileLists from '~/pages/FileLists'
import Editor from '~/pages/Editor'
import useMount from '~/hooks/useMount'

function App() {
  console.log('render App')
  useMount(async () => {
    // 此操作放入主渲染程序
    console.log('loading...')
    await ipcRenderer.invoke('app-init')
    console.log('loading end')
  })

  return (
    <>
      <FileLists />
      <Editor />
    </>
  )
}

export default App
