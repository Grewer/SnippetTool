import React, { useReducer } from 'react'
import { appInit } from '~/db/db'
import FileLists from '~/pages/FileLists'
import Editor from '~/pages/Editor'
import useMount from '~/hooks/useMount'

const AppReducer = (state, action) => {
  console.log(state, action)
  return state
}

function App() {
  const [state, setState] = useReducer(AppReducer, {
    loading: false,
  })
  console.log('render App', state)
  useMount(async () => {
    // 此操作放入主渲染程序
    console.log('loading...')
    await appInit()
    console.log('loading end')
  })

  return state.loading ? (
    <span>loading...</span>
  ) : (
    <>
      <FileLists />
      <Editor />
    </>
  )
}

export default App
