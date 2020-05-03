import React from 'react'
import Loki from 'lokijs'
import FileLists from '~/pages/FileLists'
import Editor from '~/pages/Editor'
import useMount from '~/hooks/useMount'

function App() {
  console.log('render App')
  useMount(() => {
    // 此操作放入主渲染程序
    // const db = new Loki('db/Main.json', {
    //   persistenceMethod: 'fs',
    // })
    // const users = db.addCollection('title', { indices: ['id'] })
    // const newUser = {
    //   name: `user_${new Date().getTime()}`,
    // }
    // users.insert(newUser as any)
    //
    // db.saveDatabase()
    // console.log(db)
  })

  return (
    <>
      <FileLists />
      <Editor />
    </>
  )
}

export default App
