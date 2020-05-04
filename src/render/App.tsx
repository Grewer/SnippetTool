import React, { useReducer } from 'react'
import createAction from '~/action/createAction'
import GlobalLoading from '~/components/GlobalLoading'
import { appInit } from '~/db/db'
import FileLists from '~/pages/FileLists'
import Editor from '~/pages/Editor'
import useMount from '~/hooks/useMount'

const AppReducer = (state, action: { type: string; payload: any }) => {
  console.log('AppReducer', state, action)
  switch (action.type) {
    case 'setValue':
      return {
        ...state,
        loading: false,
      }
    case 'setLoading':
      return {
        ...state,
        loading: action.payload,
      }
    default:
      return state
  }
}

function App() {
  const [state, setState] = useReducer(AppReducer, {
    loading: false,
    fileList: [],
    config: {},
  })

  console.log('render App', state)

  useMount(async () => {
    // 此操作放入主渲染程序
    console.log('loading...')
    const timeout = setTimeout(() => {
      setState(createAction('setLoading', true))
    }, 200)
    try {
      await appInit()
      console.log(state)
      if (!state.loading) {
        clearTimeout(timeout)
      }
      setState(createAction('setValue', '12'))
    } catch (e) {}
    console.log('loading end')
  })

  return (
    <GlobalLoading loading={state.loading} text="环境加载中...">
      <FileLists />
      <Editor />
    </GlobalLoading>
  )
}

export default App
